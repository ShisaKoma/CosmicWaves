"""Cas limites non couverts par les scénarios par défaut."""
import math
import unittest

from modeles import (tilted_well, reciprocal, jeans, jeans_value, matter_growth,
                     closure_energy, closed_probability, capture_uniform, poisson_probability)


class ExtensionsTest(unittest.TestCase):
    def test_double_well_threshold_is_not_a_minimum(self):
        for ratio in (-1., 1.):
            result = tilted_well(ratio)
            self.assertEqual(len(result['extrema']), 2)
            self.assertEqual(result['barriere_metastable'], 0)
            self.assertIn('dégénéré', result['statut'])
        self.assertIsNone(tilted_well(1.01)['barriere_metastable'])

    def test_dimensional_scaling(self):
        reduced = tilted_well(.4)
        scaled = tilted_well(.4, 3, 2)
        self.assertAlmostEqual(scaled['h_critique'], reduced['h_critique']*24)
        self.assertAlmostEqual(scaled['barriere_metastable'], reduced['barriere_metastable']*48)

    def test_reciprocal_exact_threshold(self):
        threshold = reciprocal(1/3, duration=.1)
        self.assertIn('non minimale', threshold['statut'])
        self.assertEqual(threshold['valeurs_propres_opposees'][0], 0)
        self.assertIsNone(reciprocal(.5, duration=.1)['q_oppose'])

    def test_no_perturbation_does_not_create_common_mode(self):
        result = reciprocal(.4, perturbation=0, duration=1)
        self.assertLess(max(abs(x+y) for _, x, y, _ in result['trajectory']), 1e-14)

    def test_jeans_exactly_marginal_and_no_perturbation(self):
        g = 1/(4*math.pi)
        marginal = jeans(g, 1, 1, 1, velocity=.02, duration=10)
        self.assertEqual(marginal['s2'], 0)
        self.assertAlmostEqual(marginal['temps_limite'], 4.95)
        zero = jeans(g, 1, 1, .5, d0=0, duration=1000)
        self.assertTrue(all(d == 0 for _, d, _ in zero['trajectory']))

    def test_jeans_pure_decay_is_not_growth(self):
        result = jeans(1/(4*math.pi), 1, 0, 1, d0=.001, velocity=-.001, duration=1000)
        self.assertEqual(result['coefficient_croissant'], 0)
        self.assertIsNone(result['temps_limite'])
        self.assertLess(result['trajectory'][-1][1], .001)

    def test_jeans_negative_growth_and_long_horizon(self):
        result = jeans(1/(4*math.pi), 1, 0, 1, d0=-.001, duration=1000)
        self.assertAlmostEqual(result['temps_limite'], math.acosh(100))
        self.assertAlmostEqual(result['trajectory'][-1][1], -.1)

    def test_fast_oscillation_cannot_skip_first_crossing(self):
        result = jeans(0, 1, 1, 100, d0=0, velocity=20, duration=1, step=1)
        self.assertAlmostEqual(result['temps_limite'], math.asin(.5)/100)
        self.assertAlmostEqual(result['trajectory'][-1][1], .1)

    def test_jeans_zero_pressure_has_no_finite_ratio(self):
        self.assertIsNone(jeans(1, 1, 0, 0, duration=.1)['rapport_Jeans'])

    def test_jeans_initial_conditions(self):
        for s2 in (-2., 0., 3.):
            d, speed = jeans_value(0, s2, -.02, .07)
            self.assertAlmostEqual(d, -.02)
            self.assertAlmostEqual(speed, .07)

    def test_expansion_initial_conditions_and_modes(self):
        d, velocity = matter_growth(2, 2, .01, .02)
        self.assertAlmostEqual(d, .01)
        self.assertAlmostEqual(velocity, .02)
        self.assertAlmostEqual(matter_growth(8, 1, .01, .02/3)[0], .04)
        self.assertAlmostEqual(matter_growth(8, 1, .01, -.01)[0], .00125)

    def test_closure_energy_is_not_a_rate(self):
        self.assertAlmostEqual(closure_energy(2*math.pi**2, 1, 1), 0)
        self.assertGreater(closure_energy(5, 1, 1), 0)
        self.assertLess(closure_energy(30, 1, 1), 0)
        self.assertEqual(closed_probability(100, 0, 0, .3), .3)
        self.assertAlmostEqual(closed_probability(1000, .3, .1), .75)
        self.assertAlmostEqual(closed_probability(10, 0, .2, 1), math.exp(-2))

    def test_probability_limits(self):
        self.assertEqual(capture_uniform(None, 2), 0)
        self.assertEqual(capture_uniform(3, 2), 0)
        self.assertEqual(poisson_probability(0, 3, 10), 0)
        self.assertEqual(poisson_probability(1000, 3, 10), 1)
        self.assertGreater(poisson_probability(1e-20, 1, 1), 0)

    def test_invalid_inputs(self):
        for call in (lambda: tilted_well(float('nan')),
                     lambda: tilted_well(0, quartic=0),
                     lambda: reciprocal(-.1),
                     lambda: jeans(1, -1, 1, 1),
                     lambda: jeans(1, 1, 1, 1, limit=1),
                     lambda: jeans(1, 1, 1, 1, d0=.1),
                     lambda: matter_growth(0, 1, .01, 0),
                     lambda: closure_energy(0, 1, 1),
                     lambda: closed_probability(1, .1, -.1),
                     lambda: closed_probability(1, .1, .1, 2),
                     lambda: capture_uniform(.5, 0),
                     lambda: poisson_probability(-1, 1, 1)):
            with self.subTest(call=call), self.assertRaises(ValueError):
                call()


if __name__ == '__main__':
    unittest.main()
