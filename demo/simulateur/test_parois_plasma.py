"""Contrôles physiques et numériques du premier module paroi/bain."""
import json
import math
import tempfile
import unittest
from pathlib import Path

from parois_plasma import CONFIG, catalogue, load_config, thermal_state, wall_profile


class FieldPlasmaTest(unittest.TestCase):
    def test_standard_model_and_qcd_counting(self):
        sm = thermal_state(1, 1, 'sm_symetrique_ideal')
        self.assertEqual((sm['g_bosons'], sm['g_fermions'], sm['g_etoile']), (28, 90, 106.75))
        qcd = thermal_state(1, 1, 'qcd_uds_ideal')
        self.assertEqual((qcd['g_bosons'], qcd['g_fermions'], qcd['g_etoile']), (16, 36, 47.5))
        self.assertFalse(any(r['id'] in ('photon', 'Z') for r in catalogue()))

    def test_antiparticles_and_zero_net_charges(self):
        sm = thermal_state(1, 7, 'sm_symetrique_ideal')
        for charge in sm['charges_net_moyennes'].values():
            self.assertAlmostEqual(charge, 0, places=13)
        rows = {r['id']: r for r in catalogue()}
        self.assertEqual(rows['u_L']['Q_sur_e'], '2/3')
        self.assertEqual(rows['d_R']['Q_sur_e'], '-1/3')
        self.assertEqual(rows['u_L_anti']['B'], '-1/3')
        self.assertEqual(rows['u_L_anti']['representation_couleur'], '3bar')
        self.assertEqual(rows['gluons']['Q_sur_e'], '0')

    def test_thermal_scalings_and_first_law(self):
        a = thermal_state(1, 1, 'sm_symetrique_ideal')
        b = thermal_state(2, 1, 'sm_symetrique_ideal')
        self.assertAlmostEqual(b['rho_reduite'] / a['rho_reduite'], 16)
        self.assertAlmostEqual(b['nombre_moyen_total'] / a['nombre_moyen_total'], 8)
        self.assertAlmostEqual(b['entropie_reduite'] / a['entropie_reduite'], 8)
        eps = 1e-5
        plus = thermal_state(1 + eps, 1, 'sm_symetrique_ideal')
        minus = thermal_state(1 - eps, 1, 'sm_symetrique_ideal')
        dp_dt = (plus['pression_reduite'] - minus['pression_reduite']) / (2 * eps)
        self.assertAlmostEqual(dp_dt / a['entropie_reduite'], 1, places=8)
        self.assertAlmostEqual(a['entropie_reduite'], a['rho_reduite'] + a['pression_reduite'])

    def test_wall_equation_and_integrated_energy(self):
        wall = wall_profile(1, 1, 3)
        self.assertAlmostEqual(wall['epaisseur_caracteristique_reduite'], math.sqrt(2))
        self.assertAlmostEqual(wall['tension_reduite'], 2 * math.sqrt(2) / 3)
        self.assertLess(wall['erreur_relative_integration'], 1e-11)
        self.assertLess(wall['residu_equation_normalisee'], 1e-14)
        self.assertEqual(wall['profil'][400]['phi_reduit'], 0)
        self.assertAlmostEqual(wall['energie_pour_aire_reduite'], 3 * wall['tension_reduite'])

    def test_wall_rescaling_and_numeric_convergence(self):
        a = wall_profile(1, 1, 1, half_width=6, intervals=200)
        b = wall_profile(4, 2, 1, half_width=6, intervals=400)
        self.assertAlmostEqual(b['tension_reduite'] / a['tension_reduite'], 16)
        self.assertAlmostEqual(b['epaisseur_caracteristique_reduite'] / a['epaisseur_caracteristique_reduite'], .25)
        # Même troncature normalisée, résolution doublée : intégrales concordantes.
        self.assertLess(abs(a['tension_integree_reduite'] / a['tension_reduite'] -
                            b['tension_integree_reduite'] / b['tension_reduite']), 1e-10)

    def test_invalid_parameters_and_configs(self):
        for call in (lambda: thermal_state(0, 1, 'qcd_uds_ideal'),
                     lambda: thermal_state(True, 1, 'qcd_uds_ideal'),
                     lambda: thermal_state(1, 1, 'inconnu'),
                     lambda: wall_profile(0, 1, 1),
                     lambda: wall_profile(1, float('nan'), 1),
                     lambda: wall_profile(1, 1, 1, intervals=201)):
            with self.assertRaises(ValueError):
                call()
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'config.json'
            original = json.loads(CONFIG.read_text())
            original['plasma']['temperatures_reduites'] = [False]
            path.write_text(json.dumps(original))
            with self.assertRaises(ValueError):
                load_config(path)


if __name__ == '__main__':
    unittest.main()
