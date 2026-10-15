# Parois de champs et soupe : première référence calculable

Choix   : représenter les branes par des parois de champs et inclure une soupe de quarks, antiquarks, gluons et autres espèces nécessaires. Les parois sont envisagées comme des structures collectives ; leur paramètre d'ordre et leurs interactions avec les constituants restent à identifier.

Ce premier module calcule **un profil de paroi statique et un bain thermique idéal séparément**. Il fournit des grandeurs et des contrôles pour les futurs couplages. Il ne calcule pas encore l'alignement, l'agrégation, les réactions ni la formation d'une bulle.

**Extension ajoutée ensuite :** le [mode portail de Higgs](../portail-higgs/README.md), lancé avec `python3 simulateur.py --portail-higgs`, résout un premier couplage Φ–Higgs, les profils et la stabilité initiale, avec des contributions locales aux masses. Le présent mode reste la référence découplée ; son bain idéal n'est pas automatiquement recalculé avec ces masses. Le transport, les réactions et le chauffage demandent encore un calcul cinétique.

## Exécuter

Depuis la racine du projet, avec Python 3 et sa bibliothèque standard :

```sh
python3 simulateur.py --parois-plasma
python3 simulateur.py --parois-plasma --config output/parois-plasma/configuration.json --output output/mon-plasma
python3 -m unittest discover -s output/simulateur -p 'test_*.py' -v
```

Ouvrir le [rapport HTML](resultats/rapport.html). Le [JSON des résultats](resultats/resultats.json) conserve les hypothèses, unités, états thermiques et mécanismes absents. Le [catalogue CSV](resultats/especes.csv) contient tous les états recensés, tandis que les contributions thermiques du JSON indiquent les espèces effectivement incluses dans le régime choisi. Le [profil CSV](resultats/profil_paroi.csv) donne champ et densités d'énergie.

## Paroi scalaire : choix phénoménologique proposé

Pour un champ neutre Φ à cinétique canonique, dans un espace-temps plat en 3+1 dimensions, choisir comme première référence :

\[
V(\Phi)=\frac{\lambda}{4}(\Phi^2-v^2)^2,
\qquad
\Phi(z)=v\tanh(z/\ell),
\qquad
\ell=\frac{\sqrt{2}}{\sqrt{\lambda}\,v}.
\]

La coordonnée z est normale à une paroi plane. Le terme de gradient et le potentiel donnent :

\[
\rho_{\rm paroi}=\frac12(\partial_z\Phi)^2+V(\Phi),
\qquad
\sigma=\int dz\,\rho_{\rm paroi}
=\frac{2\sqrt{2\lambda}}{3}v^3.
\]

L'énergie d'une portion plane d'aire A est σA. ℓ est une **épaisseur caractéristique**, pas la largeur d'une bande de voxels. Les petites fluctuations dans les minima ont une masse m_Φ=√(2λ)v. Le profil satisfait Φ″=λΦ(Φ²−v²) ; son énergie intégrée numériquement est comparée à σ.

Cette réalisation scalaire simple est une proposition de calcul. Le choix général « parois de champs » est adopté ; λ, v et ce potentiel ne sont pas des mesures de la soupe. Φ n'est identifié ni au Higgs ni à un condensat QCD. Si Φ représente un champ collectif composite, sa cinétique et son potentiel devront être justifiés dans le milieu ; cette première formule n'effectue pas cette dérivation. Les propriétés de solitons et parois sont discutées par [David Tong](https://www.damtp.cam.ac.uk/user/tong/talks/caqcd.pdf).

## Espèces et charges

Le catalogue comprend les six saveurs de quarks et leurs antiquarks, les leptons chargés et leurs antiparticules, trois neutrinos actifs et leurs antiparticules, ainsi que les degrés de liberté de jauge et du Higgs nécessaires à la référence idéale du Modèle standard.

Les quarks sont séparés selon la chiralité de leur champ pour suivre les charges électrofaibles. La convention est **Q/e=T₃+Y**. Les colonnes B et L désignent les nombres baryonique et leptonique. Ces valeurs ne signifient pas que toutes les réactions futures conserveront B et L séparément.

- Les charges électriques des quarks sont +2/3 ou −1/3 ; celles des antiquarks sont opposées.
- La couleur est une représentation de SU(3), pas une petite charge électrique. Les quarks sont dans 3, les antiquarks dans 3bar, les gluons dans 8. Leurs degrés internes sont comptés sans simuler un champ de couleur local.
- Les gluons sont électriquement neutres et portent les degrés de liberté de l'interaction forte.
- Les couleurs des surfaces dans les démonstrateurs 3D identifient des objets ; elles ne représentent pas ces charges QCD.

Dans la phase électrofaible symétrique, la base de jauge contient W±, W₃ et B_Y, avec deux polarisations par boson de jauge et quatre degrés scalaires du doublet de Higgs. **Ne pas ajouter un photon et un Z indépendants à cette base** : ils sont les combinaisons pertinentes dans la phase brisée. Cette référence ne suit pas la transition entre les deux bases. [Champs du Modèle standard, CERN](https://home.cern/science/physics/standard-model/).

## Équation d'état : limite idéale, pas encore QCD interactive

Tous les états inclus sont traités sans masse, à la même température et à potentiel chimique nul. Le calcul donne :

\[
g_* = \sum_b g_b+\frac78\sum_f g_f,
\quad
\rho=\frac{\pi^2}{30}g_*T^4,
\quad
p=\frac\rho3,
\quad
s=\frac{\rho+p}{T}.
\]

Les densités moyennes de nombre sont g ζ(3)T³/π² pour les bosons et 3/4 de cette expression pour les fermions. À μ=0, les charges nettes moyennes de la référence s'annulent. Une asymétrie ne peut pas apparaître dans ce calcul d'équilibre sans source ni histoire dynamique. [Thermodynamique relativiste, David Tong](https://www.damtp.cam.ac.uk/user/tong/cosmo/cosmohtml/S2.html).

Deux régimes de référence sont disponibles dans `configuration.json` :

| Régime | Contenu | Résultat de comptage |
|---|---|---:|
| `sm_symetrique_ideal` | Tous les degrés du SM minimal dans la limite idéale symétrique | 28 bosoniques + 90 fermioniques ; g*=106,75 |
| `qcd_uds_ideal` | Quarks/antiquarks u,d,s et gluons uniquement | 16 bosoniques + 36 fermioniques ; g*=47,5 |

Le régime QCD seul est un contrôle restreint ; il ne remplace pas la soupe complète choisie. Le régime SM idéal est une référence de haute température, sans masses, corrections d'interaction ni découplage. La température ne sélectionne pas automatiquement les espèces. Les six saveurs ne doivent pas être traitées comme relativistes à toute température physique.

Pour une histoire réelle traversant le régime QCD, il faudra ajouter les masses et une équation d'état adaptée, notamment des données de QCD sur réseau près de la transition. Une équation d'état ne fournit pas à elle seule les taux de réaction ou l'hadronisation. [Bazavov, Petreczky et Weber, équation d'état QCD](https://arxiv.org/abs/1710.05024).

## Unités et paramètres

En unités naturelles ħ=c=k_B=1, une échelle E₀ commune reste à fixer. La configuration utilise des rapports : T=θE₀, v=v_rE₀, z=z_r/E₀, aire=A_r/E₀² et volume=V_r/E₀³. Le rapport calcule σ/E₀³, ρ/E₀⁴, p/E₀⁴, s/E₀³ et E/E₀.

Les valeurs λ=1 et v_r=1 sont exploratoires. Les températures réduites 0,5, 1 et 2 ne sont ni des GeV ni des températures de nucléation annoncées. Sans fixer E₀ et le domaine de validité, elles ne constituent pas une calibration physique du projet.

## Ce qui pourra se former et ce qui exige ses propres champs

Les quarks et antiquarks peuvent contribuer aux hadrons lorsque les interactions et les conditions le permettent. Proton, neutron, noyaux et atomes nécessitent successivement confinement/hadronisation, réactions nucléaires et liaison électronique dans des régimes différents. Les leptons, photons et autres champs du SM ne sont pas composés de quarks : leurs populations évoluent par leurs propres réactions.

L'enchaînement « le reste s'obtiendra » est donc conservé comme objectif de calcul, sans garantir chaque produit. Le module ne remplace pas des quarks par un proton selon une simple règle de couleur ou de proximité ; il faut un modèle d'interaction et des bilans.

Prochaines étapes : identifier Φ, calibrer le portail choisi et justifier son potentiel thermique ; suivre l'énergie transférée ; ajouter distributions massives, réactions inverses, transport et refroidissement ; calculer le foyer gravitationnel avant la rupture ; déterminer si cette rupture produit une frontière et si elle persiste. Les notes [convergence](../bibliographie/convergence_chauffage_mecanismes.md), [composition](../bibliographie/composition_branes_soupe_appuis_experimentaux.md) et [transport](../bibliographie/portail_higgs_parois_transport.md) précisent ces dépendances.
