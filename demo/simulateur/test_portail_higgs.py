"""Contrôles indépendants du potentiel, du spectre et des profils couplés."""
import copy
import math
import unittest

from portail_higgs import (CONFIG, derivatives, homogeneous_minima, load_config,
                           lowest_eigenvalue, potential, probe_profile, run, scenario,
                           validate, verify)


class HiggsPortalTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.config = load_config(CONFIG)
        cls.config['grille']['intervalles'] = 240
        cls.result = run(cls.config)

    def test_potential_derivatives_by_finite_differences(self):
        p = self.config['potentiel']
        phi, h, t, eps = .37, .23, .4, 1e-5
        ds, dh = derivatives(phi, h, p, t)
        numeric_s = (potential(phi + eps, h, p, t) - potential(phi - eps, h, p, t)) / (2 * eps)
        numeric_h = (potential(phi, h + eps, p, t) - potential(phi, h - eps, p, t)) / (2 * eps)
        self.assertAlmostEqual(ds, numeric_s, places=9)
        self.assertAlmostEqual(dh, numeric_h, places=9)
        self.assertEqual(potential(phi, h, p, t), potential(-phi, h, p, t))

    def test_sturm_matches_exact_dirichlet_spectrum(self):
        n, length, mass2 = 81, 10., .3
        dz = length / (n + 1)
        actual = lowest_eigenvalue([2 / dz**2 + mass2] * n, -1 / dz**2)
        exact = mass2 + 4 / dz**2 * math.sin(math.pi / (2 * (n + 1)))**2
        self.assertAlmostEqual(actual, exact, places=11)

    def test_mixed_homogeneous_phase_is_not_omitted(self):
        p = dict(self.config['potentiel'], lambda_phi=1., lambda_h=1., kappa=1., mu_h2_reduit=1.)
        phases = homogeneous_minima(p, 0.)
        lowest = min(phases, key=lambda r: r['V_reduit'])
        self.assertEqual(lowest['phase'], 'mixte')
        self.assertTrue(lowest['minimum_local'])
        self.assertAlmostEqual(lowest['phi_reduit']**2, 2 / 3)
        self.assertAlmostEqual(lowest['h_reduit']**2, 2 / 3)
        self.assertAlmostEqual(lowest['V_reduit'], -1 / 3)

    def test_gradient_cost_changes_local_stability_diagnosis(self):
        a, b, c = self.result['scenarios']
        self.assertLess(a['omega2_reference_analytique'], 0)
        self.assertGreater(a['h_centre'], .5)
        for case in (b, c):
            self.assertLess(case['courbure_h_centre'], 0)
            self.assertGreater(case['omega2_reference_analytique'], 0)
            self.assertLess(case['h_max'], 1e-4)
        for case in (a, b, c):
            self.assertLess(case['erreur_spectre_absolue'], 5e-5)
            self.assertEqual(case['phase_globale'], 'phi')

    def test_coupled_equations_free_energy_and_honest_outputs(self):
        self.assertEqual(len(verify(self.result)), 9)
        case = self.result['scenarios'][0]
        self.assertLess(case['solution']['energie_libre_par_aire'], case['energie_libre_reference'] - .01)
        self.assertIsNone(case['puissance_transfert_vers_plasma'])
        self.assertIsNone(case['taux_reactions'])
        self.assertIsNone(case['temperature_nucleation'])
        self.assertEqual(case['stabilite_profil_final'], 'non_calculee')
        # La baisse de Phi au centre/aux alentours est résolue, pas un fond figé.
        row = case['profil'][150]
        bare = case['v_phi_T'] * math.tanh(row['z_reduit'] / case['ell_reference'])
        self.assertGreater(abs(row['phi_reduit'] - bare), .01)

    def test_resolution_and_box_size_convergence(self):
        coarse = self.result['scenarios'][0]
        fine_config = copy.deepcopy(self.config)
        fine_config['grille']['intervalles'] = 480
        fine = scenario(fine_config, .2)
        self.assertLess(fine['erreur_spectre_absolue'], coarse['erreur_spectre_absolue'] / 3)
        self.assertLess(abs(fine['h_centre'] - coarse['h_centre']), .002)
        larger_config = copy.deepcopy(fine_config)
        larger_config['grille'].update(demi_largeur_en_ell=18., intervalles=720)
        larger = scenario(larger_config, .2)
        self.assertLess(abs(larger['h_centre'] - fine['h_centre']), .001)
        self.assertLess(abs(larger['solution']['energie_libre_par_aire'] - fine['solution']['energie_libre_par_aire']), 1e-5)

    def test_decoupling_recovers_scalar_kink(self):
        config = copy.deepcopy(self.config)
        config['potentiel'].update(kappa=0., mu_h2_reduit=-.2)
        case = scenario(config, .2)
        self.assertLess(case['h_max'], 1e-5)
        tension = 2 * math.sqrt(2 * config['potentiel']['lambda_phi']) * case['v_phi_T']**3 / 3
        self.assertLess(abs(case['solution']['energie_libre_par_aire'] / tension - 1), .001)
        for row in case['profil']:
            bare = case['v_phi_T'] * math.tanh(row['z_reduit'] / case['ell_reference'])
            self.assertLess(abs(row['phi_reduit'] - bare), .001)

    def test_probe_force_is_energy_gradient(self):
        z = [-1., -.5, 0., .5, 1.]
        h = [0., .5, 1., .5, 0.]
        rows = probe_profile(z, h, self.config['sondes'])
        self.assertAlmostEqual(rows[2]['m_top_Higgs_reduit'], 1 / math.sqrt(2))
        self.assertEqual(rows[2]['E_Fz_top_reduit'], 0)
        self.assertAlmostEqual(rows[1]['E_Fz_top_reduit'], -rows[3]['E_Fz_top_reduit'])
        self.assertLess(rows[1]['E_Fz_top_reduit'], 0)

    def test_absent_walls_bulk_instability_and_invalid_config(self):
        self.assertEqual(scenario(self.config, 3.)['statut'], 'pas_de_domaines_phi_a_cette_temperature')
        config = copy.deepcopy(self.config)
        config['potentiel']['mu_h2_reduit'] = 1.
        self.assertEqual(scenario(config, .2)['statut'], 'domaines_phi_instables_dans_le_volume')
        for section, key, value in [('potentiel', 'kappa', -.1), ('potentiel', 'lambda_h', 0),
                                    ('grille', 'intervalles', 121), ('sondes', 'g', float('nan'))]:
            invalid = copy.deepcopy(self.config)
            invalid[section][key] = value
            with self.assertRaises(ValueError):
                validate(invalid)
        for bad in [[False], [float('nan')], [], [-1]]:
            invalid = copy.deepcopy(self.config)
            invalid['temperatures_reduites'] = bad
            with self.assertRaises(ValueError):
                validate(invalid)


if __name__ == '__main__':
    unittest.main()
