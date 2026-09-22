# Simulateur

Cette extension réutilise les scripts `seuil-entropie/calcul_seuil.py`,
`seuil-entropie/comparer_germes.py` et `plasma-bulle/calcul_bulle.py`.
Elle ajoute les calculs définis dans les notes plus récentes. Les fichiers
historiques et leurs instantanés de reproduction ne sont pas modifiés.

## Exécuter

Depuis la racine du projet :

```sh
python3 simulateur.py
python3 simulateur.py --config mon_scenario.json --output output/mon_scenario
python3 simulateur.py --plot
python3 -m unittest discover -s output/simulateur -p 'test_*.py' -v
```

Le calcul, le rapport HTML et les tests utilisent seulement Python 3 et sa
bibliothèque standard. `--plot` demande Matplotlib et produit une figure
scientifique PNG et SVG intégrée au rapport. Dans cet espace de travail, la
copie de Matplotlib déjà présente peut être utilisée ainsi :

```sh
PYTHONPATH=tmp/plasma-python MPLCONFIGDIR=tmp/matplotlib python3 simulateur.py --plot
```

Le rapport est un document local à ouvrir dans un navigateur. Les paramètres
se modifient dans le JSON, puis le calcul se relance ; il ne s’agit pas d’une
interface qui recalcule les trajectoires dans le navigateur.

## Paramètres

Copier `configuration.json` pour créer un scénario complet. Les clés inconnues,
les valeurs non finies et les domaines physiques invalides sont rejetés.
Chaque exécution conserve sa configuration effective.

- **Germes** : durée, pas, perturbation initiale et paramètres propres à chaque
  germe. `temperature` désigne k_B T. `modes` est un entier constant par germe.
  Les neuf cas d’origine sont aussi exécutés avec la durée, le pas et q initial
  choisis ; leurs vérifications historiques utilisent séparément le protocole
  original. Réduire le pas si un contrôle de convergence échoue.
- **Domaines A/B** : `lambda4`, `v` et les valeurs signées de `h/hc`. À zéro,
  les minima sont équivalents ; à ±1, le point dégénéré n’est plus un minimum.
  La barrière affichée est celle du minimum métastable (négatif pour h positif,
  positif pour h négatif). Au-delà du seuil, elle est absente, représentée par
  `null`, et non par une barrière négative.
- **Couplage réciproque** : η et une perturbation commune explicite. Le modèle
  emploie un couplage local instantané ; il ne simule pas le médiateur causal
  de la proposition A/B. À η ≥ 1/2, la préparation est proche de l’origine,
  puisque la branche opposée non nulle n’existe plus.
- **Bulle** : reproduction des sept poussées, cinq apports, quatre préparations
  et trois tensions du corpus. Les paramètres du calcul historique restent
  ceux de `calcul_bulle.py`. Le rappel local et le temps de relaxation sont
  ajoutés pour les seuls minima stricts.
- **Jeans** : G, densité, vitesse du son, nombre d’onde, amplitude et vitesse
  initiales. Le défaut G=1/(4π) normalise 4πGρ à 1 ; ce n’est pas la valeur
  mesurée de la constante gravitationnelle. La trajectoire s’arrête au premier
  |D| atteignant `limite_lineaire` (au plus 0,1), même entre deux échantillons.
  `rapport_Jeans=null` indique un dénominateur de pression nul, pas une valeur
  physique manquante remplaçable par zéro.
- **Expansion** : modes propres croissant et décroissant sur un fond plat de
  matière sans pression, à partir de t0>0. La durée est mesurée depuis t0.
  Ils partagent D0 et ont les vitesses initiales requises par leurs modes.
- **Fermeture** : longueurs, rigidité et énergie de liaison pour comparer segment
  et cercle. Les taux constants `k_OC` et `k_CO` sont des choix illustratifs
  indépendants, pas des résultats tirés de ΔE. Aucune température ni entropie
  de filament ne sont définies permettant d’en déduire un bilan détaillé.
- **Capture** : loi uniforme explicitement illustrative sur [0,r_max]. Elle
  mesure le bassin de germes déjà préparés. Le polynôme radial est utilisé
  formellement sur cet intervalle ; sa validité matérielle reste à établir.
- **Nucléation** : `null` par défaut, faute de taux calculé. Pour examiner la
  formule conditionnelle de Poisson, remplacer par exemple ce champ par
  `{"Gamma": 0.02, "volume": 1.0, "duree": 10.0}`. Ces nombres sont alors des
  entrées imposées, dans des unités compatibles, et ne décrivent pas une
  fréquence d’apparition d’univers prédite par l’hypothèse.

## Nouveautés et limites

| Élément du corpus | Intégration |
|---|---|
| Modes internes, accumulation et entropie | Calculs existants réutilisés |
| Seuils hétérogènes | Paramètres locaux et trajectoires comparées |
| Double puits A/B | Extrema, barrière et disparition du minimum, pour les deux signes |
| Couplage réciproque de la synthèse | Trajectoires, valeurs propres, seuil à l’ordre quatre |
| Bulle à réservoir fini | Branches, coexistence énergétique, bassins, accumulation et tension |
| Attracteur radial | κ local et temps réduit 1/κ |
| Amplification gravitationnelle | Jeans statique : exponentielle possible, cas marginal, oscillations |
| Influence de l’expansion du fond | Modes t^(2/3) et t^(-1) |
| Filament ouvert/fermé | ΔE et cinétique conditionnelle à taux imposés |
| Probabilités | Capture conditionnelle ; Poisson seulement si Γ est fourni |
| Composition du plasma, cordes, dimensions | Hypothèses recensées, équations manquantes indiquées |
| Médiateur causal, observation, nucléation gravitationnelle | Présents au suivi ; non simulés faute de dynamique définie |
| Saturation informationnelle et commentaires externes | Conservés comme discussions, non ajoutés aux lois |

Le rapport inclut les sources de chaque thème. Les variables restent séparées :
q de configuration, densité effective du précurseur, phase φ, rayon r et
contraste gravitationnel D ne sont pas interchangeables. Les modules ne sont
pas reliés par un couplage inventé. Le scénario nuage → agrégation → plasma →
seuil → bulle → persistance est conservé comme hypothèse à examiner.

## Sorties et vérification

- `rapport.html` : tableaux comparatifs, statut de chaque hypothèse et liens sources.
- `resultats.json` : paramètres, résultats scalaires, couverture et limites.
- `trajectoires.csv` : séries complètes avec noms explicites des variables.
- `configuration_executee.json` : paramètres effectivement exécutés.
- `verification.json` : erreurs, tolérances et contrôles historiques/nouveaux.
- `sources_manifest.json` : empreintes SHA-256 des notes et programmes utilisés.
- `comparaison.png` et `.svg` : figures facultatives avec `--plot`.

Les contrôles comprennent les 30 vérifications historiques, les valeurs de
barrière publiées, la symétrie et les résidus des extrema, l’ordre quatre au
seuil réciproque, la dissipation, la convergence au pas divisé par deux, les
équations différentielles de gravitation et les probabilités conditionnelles.
Les tests supplémentaires couvrent notamment les modes gravitationnels nuls
et purement décroissants, le seuil marginal, un premier passage entre deux
échantillons, les taux nuls et les paramètres invalides.
