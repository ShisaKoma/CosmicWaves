# Résultats calculés

Modèle hypothétique, unités réduites.

| alpha | n critique | temps critique | courbure à n=1,2 | moyenne q² à n=1,2 |
|---:|---:|---:|---:|---:|
| -0.4 | 0.600 | 2.554128 | -0.600 | 0.501932 |
| +0.0 | 1.000 | 5.493061 | -0.200 | 0.279165 |
| +0.4 | 1.400 | 13.540251 | +0.200 | 0.168072 |

Tous les contrôles suivants sont passés :

- integration_des_modes_internes : erreur 1.67e-16, tolérance 1e-10.
- entropie_par_derivee_thermique_independante : erreur 1.19e-11, tolérance 1e-08.
- courbure_au_seuil : erreur 1.11e-16, tolérance 1e-12.
- relaxation_RK4_contre_solution_exacte : erreur 3.69e-14, tolérance 1e-08.
- convergence_pas_divise_par_deux : erreur 3.66e-15, tolérance 1e-08.
- energie_libre_decroissante_parametres_fixes : erreur 0, tolérance 1e-12.
- fluctuations_au_seuil_contre_solution_exacte : erreur 2.78e-17, tolérance 1e-09.
- convergence_quadrature : erreur 2.78e-17, tolérance 1e-09.
- symetrie_moyenne_signee : erreur 0, tolérance 1e-12.
- temps_atteinte_accumulation : erreur 0, tolérance 1e-12.

Les rampes calculent seulement la dérive sans bruit. Les moments proviennent séparément de la distribution canonique à paramètres fixes.
Le temps critique est un changement de courbure, pas un temps de naissance d'univers.
