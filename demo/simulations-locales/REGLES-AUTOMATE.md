# Automate chromatique 3D — règles, version 4

Ouvrir `automate-3d.html` directement dans un navigateur, sans installation ni réseau. La page commence en pause. **Une génération** permet d'observer chaque transition ; **Démarrer** fait évoluer la population. Glisser pour tourner, utiliser la molette pour zoomer, cliquer sur une cellule pour consulter sa composition. Les curseurs d'orientation offrent une alternative au glissement.

## Le modèle retenu

Une grille cubique contient des points associés à **10, 11, 26 ou 32 positions de palette**. Une position est un identifiant de couleur, pas une direction spatiale. Les cellules ont séparément 6 ou 26 voisins selon le réglage. Deux positions peuvent être réglées sur le même code couleur tout en restant deux identifiants distincts.

La population initiale contient uniquement des points dans le volume cubique de la grille. Par défaut, la génération initiale inclut des paires de points voisins de même couleur, sans liaison préexistante. Une région sphérique reste sélectionnable. Le rendu affiche désormais les constituants des condensats ; l'enveloppe sphérique est une option illustrative. Cela ne constitue pas encore une simulation de formes mécaniques libres.

1. Deux points proches de même couleur peuvent se rejoindre et former une **demi-corde**.
2. Deux demi-cordes, éventuellement de couleurs différentes, forment une **corde**.
3. Deux cordes forment une **boucle**.
4. La condition **X** est satisfaite, par défaut, quand au moins quatre boucles sont réunies dans une cellule et qu’aucune boucle ne reste chez ses voisins immédiats. La condition est recalculée à chaque génération.
5. Une configuration X rend la cellule admissible comme source ; son attraction est active seulement si elle est activée et d’intensité non nulle. Elle agit sur le pas suivant. Les assemblages locaux restent possibles sans gravité.

Un composant ne monte que d'un niveau par génération. Les seuils, probabilités et poids se modifient. Les points libres et les cordes ouvertes ne comptent pas comme boucles et ne bloquent pas le regroupement local. La couverture de la palette reste une variante historique explicite. Plusieurs configurations X peuvent émerger indépendamment. L'option de rupture et l'intervention manuelle permettent de tester leur devenir, sans boucle de retour au brouillard imposée.

Ce modèle représente l'enchevêtrement par la réunion locale des boucles. Il ne calcule pas les nœuds topologiques, la tension ni la collision mécanique de filaments continus. L'ondulation et l'enveloppe sphérique sont des représentations visuelles ; la dynamique utilise les trois coordonnées de la grille. Les nombres de positions sont un choix du modèle, sans identification à une théorie physique.

## Pourquoi proposer 10 et 11 ?

Les supercordes sont formulées en 10 dimensions d'espace-temps ; la théorie M est associée à 11 dimensions, avec la supergravité à 11 dimensions comme limite de basse énergie. Voir [M. J. Duff, *M-Theory (the Theory Formerly Known as Strings)*, 1996](https://arxiv.org/abs/hep-th/9608117).

Dans cet automate, `positions` compte des états de couleur, et non des dimensions d'espace-temps. Les choix 10, 11, 26 et 32 sont des tailles de palette à comparer avec les mêmes règles locales. Changer ce nombre ne transforme pas le modèle en simulation de supercordes ou de théorie M. Le calcul spatial reste en 3D ; la valeur initiale reste 32.

Le nombre de couleurs dans la palette, les limites de la recette chromatique et la couverture de condensation suivent le choix. Lors d'une réduction, les dernières couleurs et les exigences de recette hors plage sont retirées. Lors d'une augmentation, des couleurs sont ajoutées ; les couleurs conservées gardent leur valeur. Si la condensation exigeait toutes les positions, elle exige toutes les nouvelles positions. Un seuil partiel est conservé, ou ramené au nouveau maximum.

## Modifier et conserver les règles

- **Règles courantes** et la palette : modifier puis cliquer sur **Appliquer les réglages**. La population actuelle est conservée et ses propriétés recalculées.
- Changer **le nombre de positions** recommence la population. La couverture requise pour une sphère suit ce changement lorsqu'elle demandait toutes les positions.
- **Toutes les règles — JSON modifiable** donne accès à chaque paramètre du moteur. Appliquer ce JSON ou importer un fichier recommence en pause avec la graine indiquée.
- **Exporter les règles appliquées** sauvegarde les paramètres validés, sans les modifications encore non appliquées. Le fichier `regles-automate.json` fournit la configuration initiale.
- Les configurations invalides sont refusées sans remplacer les règles actives. Le fichier doit être complet, de version 4 (ou version 2/3 complète migrée automatiquement), sans champ inconnu, et peser au plus 200 Ko. Aucune expression du JSON n'est exécutée.
- Le rechargement rétablit les valeurs initiales. L'export conserve les règles, pas l'état courant de la population.

Les coefficients et seuils sont réglables par JSON. Pour changer les algorithmes eux-mêmes, modifier `sources/structures-engine.js`, puis reconstruire avec `python3 sources/build-automate.py`. Le fichier HTML obtenu reste autonome ; Python sert uniquement à sa fabrication.

## Couleurs et soustraction

Le choix initial est la **moyenne pondérée**, conformément au réglage retenu. Pour chaque composant, la couleur est la moyenne des valeurs RGB de ses points constitutifs. Pour une cellule :

`couleur = arrondi(somme(poids du composant × couleur du composant) / somme des poids)`

Les poids par défaut sont 0,25 pour un point, 0,5 pour une demi-corde, 1 pour une corde, 2 pour une boucle. Avec les seuils 2 → 2 → 2, chaque point conserve ainsi le même poids relatif lors des assemblages. Changer les poids ou les seuils peut changer la couleur apparente et la masse après assemblage. Le mélange porte directement sur les canaux RGB encodés, sans conversion en lumière linéaire ni mélange de pigments.

Les alternatives `modulo` et `clamp` additionnent les canaux RGB des points, respectivement modulo 256 ou plafonnés à 255. Elles n'utilisent pas les poids pour la couleur ; la masse reste la somme des poids.

Lors d'une collision soustractive, les contributions des **mêmes identifiants de position** s'annulent par paires. Exemple : A contient 3 points de position 1 et B en contient 2 ; leur rencontre soustractive laisse 1 point de cette position. Les positions non communes restent. Une structure dont on retire un point se défait en points libres ; les autres structures subsistent. Les quantités ne deviennent jamais négatives. Deux positions de même RGB peuvent former une demi-corde mais restent distinctes pour cette annulation et pour la couverture d'une sphère.

## Gravité et couleur cible

Cinq déclencheurs sont disponibles : `configuration` (X actuel, défaut), `sphere` (condensat avec sa mémoire éventuelle), `color`, `both` (X et couleur), `either` (X ou couleur). La couleur cible n'est alors pas imposée au condensat : celui-ci garde son mélange.

La recette chromatique exige simultanément : assez de positions distinctes, toutes les positions explicitement requises et une couleur assez proche de la cible.

`écart RGB = distance euclidienne entre couleurs / (255 × √3)`

Le résultat va de 0 à 1. La même mesure compare la couleur d'une cellule à celle d'un foyer pour décider de l'attraction. Le terme « spectre » désigne ici cette proximité RGB, sans calcul de longueurs d'onde.

Pour chaque cellule mobile, on recherche le foyer admissible le plus fort dans la portée définie :

`force = intensité × √masse_source × multiplicateur / (distance_spatiale² + adoucissement²)`

`probabilité de déplacement = min(1, force)`

Le multiplicateur vaut 1 pour un foyer chromatique et `condensation.gravityMultiplier` pour une sphère. En cas de déplacement, chaque coordonnée avance de −1, 0 ou +1 vers le foyer, avec des diagonales possibles. La masse est la somme des poids des composants du foyer. À force égale, l'origine d'indice le plus petit gagne. On ne somme pas les forces de plusieurs foyers. Les foyers et les condensats sont ancrés ; l'attraction concerne les autres cellules. Une liaison locale réservée est prioritaire sur l'attraction. En l'absence de déplacement gravitationnel, la diffusion peut encore agir.

## Naissance, survie et ordre d'une génération

L'automate s'inspire du jeu de la vie avec des règles modifiables en 3D. Il n'utilise pas par défaut la règle classique 2D B3/S23. Une cellule compte pour un voisin, quel que soit son nombre de composants.

Par défaut, une cellule vide naît avec 3 ou 4 voisins ; toute cellule occupée survit. Cette survie étendue laisse aux assemblages le temps de se former. Une naissance crée un point choisi parmi les couleurs d'un voisin aléatoire. Les autres modes copient le premier voisin, réunissent les positions ou additionnent leurs points. Une naissance à zéro voisin choisit une couleur aléatoire de palette.

Chaque génération exécute :

1. Lecture de l'état précédent pour les voisins et les foyers.
2. Survie et naissance ; une cellule disparue ne renaît pas au même pas.
3. Réservation des liaisons entre voisins. Deux cellules se lient si elles possèdent des points libres de même RGB, ou si chacune possède déjà une structure. Une seule liaison par cellule et par génération ; deux foyers/condensats ne se lient pas. La destination reste immobile.
4. Émission facultative par les condensats préexistants : transfert d'un point vers un voisin.
5. Déplacements : liaison réservée ; sinon sortie d'émission ; sinon attraction ; sinon diffusion.
6. Résolution des arrivées par origine d'indice croissant, puis des émissions. La soustraction peut s'appliquer selon la règle choisie. Des directions sont dites opposées si leur produit scalaire est négatif. L'arrivée déjà fusionnée perd sa direction pour les collisions suivantes de ce pas.
7. Assemblage d'un seul niveau, puis ruptures facultatives en points libres.
8. Recalcul du mélange, de X, des condensats et des foyers ; leur attraction agit à partir du pas suivant.
9. Évolution du rayon d’enveloppe, contrôle du bilan de constituants et suivi des épisodes X, des apparitions/disparitions ainsi que des déplacements gravitationnels.

L'indice d'origine est `x + taille × (y + taille × z)`. Cet ordre déterministe peut introduire un biais spatial ; la graine permet de reproduire une expérience, pas de supprimer ce biais.

Les additions et assemblages conservent les points, sauf dépassement du plafond par position. Naissances, disparitions, annulations et plafonnements changent leur quantité. La conservation totale n'est donc pas une règle de cet automate.

## Émission et rythme

L'émission est facultative et désactivée au départ. Un condensat transfère au plus un point ou un composant entier par génération vers un voisin aléatoire, selon `emission.mode`. La réserve optionnelle garde au moins un point de chaque position : en mode structure, seuls les composants dont le transfert respecte cette réserve sont admissibles. Si un point est extrait d'une structure, celle-ci se défait ; un composant entier conserve son stade et sa composition. Le composant émis poursuit sa direction pendant `freeSteps` générations, puis redevient soumis aux règles ordinaires ; une collision ou sa nouvelle classification comme condensat peut interrompre ce trajet. Il n'y a pas d'identification bosonique. La persistance du condensat et sa protection contre les disparitions sont désactivées par défaut. Ces deux options sont visibles. Le déclencheur `configuration` dépend de X actuel, même si la mémoire est activée ; seul le déclencheur `sphere` peut utiliser un condensat mémorisé.

Il s'agit ici d'une émission discrète, différente de l'expansion continue du modèle précédent, qui reste accessible dans `cycle-3d.html`. Réduire **Générations / seconde** ralentit la dynamique complète. Le rythme demandé est un maximum : le calcul peut être plus lent sur une grande population. La page en arrière-plan suspend l'évolution.

## Référence complète des paramètres

Les valeurs ci-dessous sont celles du fichier fourni en 32 positions. Les probabilités vont de 0 à 1.

| Champ JSON | Défaut | Valeurs et effet |
|---|---|---|
| `version` | 4 | Les anciens JSON v2/v3 complets sont migrés |
| `positions` | 32 | 10, 11, 26 ou 32 identifiants de palette |
| `target` | `#8B5CF6` | Code `#RRGGBB` de la recette chromatique |
| `seed` | 728931 | Entier 1 à 4294967295, graine reproductible |
| `ticksPerSecond` | 3 | 0,1 à 12 générations par seconde au maximum |
| `grid.size` | 18 | Entier 8 à 24, nombre de cellules par axe |
| `grid.boundary` | `closed` | `closed` : sortie bloquée ; `wrap` : bords périodiques |
| `grid.neighborhood` | 26 | 6 faces ou 26 voisins, pour vie, liaison, diffusion et émission |
| `initial.density` | 0,14 | 0 à 0,5, probabilité de semis par cellule admissible ; les paires augmentent la population |
| `initial.shape` | `cube` | Volume de la grille, ou `sphere` de rayon 0,46 × taille |
| `initial.pairedPoints` | true | Ajouter un voisin de même couleur quand la place est libre ; le voisin peut dépasser le contour initial |
| `palette` | 32 couleurs | Tableau de `positions` objets contenant chacun uniquement `color: "#RRGGBB"` |
| `weights.point` | 0,25 | 0,01 à 100, poids d'un point |
| `weights.demi-corde` | 0,5 | 0,01 à 100, poids d'une demi-corde |
| `weights.corde` | 1 | 0,01 à 100, poids d'une corde |
| `weights.boucle` | 2 | 0,01 à 100, poids d'une boucle |
| `life.enabled` | true | Activer naissance et disparition |
| `life.birth` | [3,4] | Liste d'entiers uniques entre 0 et le nombre de voisins |
| `life.survival` | [0,…,26] | Même domaine ; tous survivent par défaut |
| `life.inheritance` | `point` | `point`, `parent`, `union`, `addition` |
| `life.protectCondensates` | false | Exempter les condensats de la règle de disparition |
| `structures.pointsPerHalf` | 2 | Entier 2 à 4, points de même couleur pour une demi-corde |
| `structures.halvesPerString` | 2 | Entier 2 à 4, demi-cordes pour une corde |
| `structures.stringsPerLoop` | 2 | Entier 2 à 4, cordes pour une boucle |
| `structures.halfProbability` | 1 | Probabilité de formation d'une demi-corde pour un groupe complet |
| `structures.stringProbability` | 1 | Probabilité de formation d'une corde |
| `structures.loopProbability` | 0,8 | Probabilité de formation d'une boucle |
| `structures.bondProbability` | 0,75 | Probabilité d'essayer une liaison avec un voisin admissible |
| `colors.addition` | `average` | `average`, `modulo`, `clamp` |
| `colors.amplitudeLimit` | 64 | Entier 1 à 1000, plafond de points par position après fusion ou héritage additionné |
| `collisions.subtraction` | `opposed` | `never`, `opposed`, `any` |
| `collisions.probability` | 0,25 | Probabilité de soustraction si la condition est remplie |
| `gravity.enabled` | true | Activer les foyers et l'attraction |
| `gravity.trigger` | `configuration` | `configuration`, `sphere`, `color`, `both`, `either` |
| `gravity.tolerance` | 0,09 | Écart RGB maximal à la cible pour la recette |
| `gravity.minimumPositions` | 1 | Entier 1 à `positions`, diversité minimale de la recette |
| `gravity.requiredPositions` | [] | Identifiants 1 à `positions`, sans doublons, indispensables à la recette |
| `gravity.strength` | 3 | 0 à 30, intensité de l'attraction |
| `gravity.radius` | 6 | 1 à `grid.size`, portée spatiale |
| `gravity.softening` | 1 | 0,1 à 10, adoucissement de la force près du foyer |
| `gravity.spectralTolerance` | 0,45 | Écart RGB maximal entre cellule et foyer admissible |
| `emergence.mode` | `local-complete` | `local-complete`, `loop-count`, `palette` |
| `radial.enabled` | true | Évolution de l’enveloppe, sans effet mécanique sur la grille |
| `radial.rate` | 0,2 | 0,001 à 1, rappel par génération |
| `radial.unitRadius` | 0,18 | 0,01 à 1, rayon de référence en cellules |
| `motion.diffusion` | 0,12 | Probabilité d'un pas aléatoire si aucun pas gravitationnel n'a lieu |
| `condensation.requiredPositions` | 32 | Entier 1 à `positions`, diversité requise seulement dans le mode `palette` |
| `condensation.minimumLoops` | 4 | Entier 1 à 100, boucles minimales pour X |
| `condensation.persistent` | false | Garder l'état condensé tant que la cellule contient des points |
| `condensation.gravityMultiplier` | 2 | 0 à 20, facteur de force d'un condensat |
| `emission.probability` | 0 | Probabilité d'émettre un composant par condensat et par génération |
| `emission.mode` | `point` | `point` : extraction d'un point ; `structure` : transfert d'un composant entier |
| `breakup.probability` | 0 | 0 à 1, probabilité de défaire chaque structure après l'assemblage du pas |
| `emission.reserveEachPosition` | true | Ne pas émettre le dernier point d'une position |
| `emission.freeSteps` | 5 | Entier 0 à 100, pas de sortie dans la direction choisie |
| `display.waveAmplitude` | 0,2 | 0 à 1, amplitude visuelle des ondulations |
| `display.waveFrequency` | 1,2 | 0 à 5, cycles visuels par seconde d'animation |
| `display.condensateStyle` | `strands` | `strands` : constituants visibles ; `envelope` : enveloppe sphérique illustrative |

Les composants sont représentés en perspective et triés par profondeur. Jusqu'à huit composants sont dessinés par cellule ; l'inspecteur et les compteurs incluent tous les composants. La réduction des animations du système supprime les ondulations. Une rotation de caméra ne modifie pas la dynamique.

## Vérifier le moteur

Avec Node.js, exécuter `node sources/check-structures.cjs`. Ce contrôle couvre les assemblages successifs, les couleurs, les conditions de sphère en 10/11/26/32 positions, plusieurs foyers, l'attraction sélective, les annulations, l'émission, les frontières, la validation et la reproductibilité.


## Définition locale de X

Le voisinage est la cellule et ses 6 ou 26 voisins immédiats, selon `grid.neighborhood`, avec les frontières choisies. En mode `local-complete`, le minimum de boucles doit être réuni dans la cellule centrale et il ne doit rester aucune boucle dans ces cellules voisines. Des boucles éloignées n’interviennent pas. Cela modélise « toutes les boucles locales réunies ici » ; ce n’est pas un calcul d’entrelacement topologique. Le minimum quatre évite qu’une seule boucle isolée soit automatiquement reconnue. Cette valeur est une convention réglable, non une prédiction.

En mode `loop-count`, seul le minimum dans la cellule centrale s’applique. En mode `palette`, le minimum et la couverture des couleurs s’appliquent, comme dans l’ancienne recette. L’émergence de X n’est garantie dans aucun mode. X peut disparaître si une boucle arrive dans le voisinage ou si la composition centrale change.

## Rayon d’enveloppe

Pour un condensat, `R_cible = radial.unitRadius × N_boucle^(1/3)`, où N_boucle est le nombre de points constitutifs contenus dans ses boucles. Sans condensat, la cible vaut zéro. À chaque génération :

`R_suivant = R_cible + (R_actuel − R_cible) × exp(−radial.rate)`.

Le rayon commence à zéro et approche la cible, qui peut varier avec la composition. Après perte du condensat, l’enveloppe se contracte tant qu’une cellule subsiste ; si la cellule disparaît entièrement, son enveloppe disparaît aussi. En cas de fusion, les volumes d’enveloppe sont additionnés avant relaxation. Le dessin utilise ce rayon en unités de cellule et un minimum de visibilité de deux unités de dessin. Il peut dépasser une maille.

Ce rayon décrit une enveloppe à relaxation prescrite. Il ne change ni la portée des collisions, ni les liaisons, ni la force gravitationnelle. Il ne reprend pas implicitement le potentiel du modèle Python de bulle ; il ne démontre donc pas une stabilité physique. Les ondulations restent également visuelles.

## Compteurs, historique et migration

- **Configurations X** : motifs satisfaisant actuellement la condition.
- **Sources admissibles** dans l’inspecteur : cellules satisfaisant le déclencheur choisi, indépendamment de l’activation.
- **Foyers actifs** : sources avec gravité activée, intensité positive et multiplicateur non nul quand applicable. Cela indique leur capacité d’attraction ; un voisin admissible n’est pas nécessairement présent.
- **Pas gravitationnels** : décisions de déplacement prises par le canal attractif lors de la dernière génération, avant résolution des collisions.
- **Condensats** : X ou, si la mémoire est activée, états condensés conservés.
- **Apparitions cumulées** : passages de X absent à X présent par site et par génération ; les récidives sont incluses. Ce ne sont ni des identités d’objets suivies ni un taux Γ.

L’export d’expérience conserve tous les résumés par génération, l’état final des cellules, l’état du générateur aléatoire et la chronologie complète des règles appliquées. Il sert à l’analyse et n’est pas importable comme fichier de règles. La reclassification immédiate après un changement de paramètres n’est pas comptée comme émergence dynamique ; le changement est enregistré séparément. Recommencer réinitialise l’historique. Le temps est en générations, sans calibration physique.

L’export de règles reste distinct. L’import d’un ancien fichier v2 sélectionne le mode `palette`, conserve les options de mémoire/protection du fichier et désactive la nouvelle enveloppe. Les compteurs de foyers utilisent néanmoins la nouvelle définition « attraction activée ». Les anciens résultats d’audit et leur moteur sont conservés dans `audit-alignement/version2/` ; le script historique d’audit utilise cette copie.

La validation historique v3 comportait 26 scénarios. La version 4 comporte 37 scénarios du moteur et 8 contrôles d'interface hors navigateur. Elle a aussi été ouverte et manipulée dans le navigateur local : application des paramètres, pas de simulation et perturbation d'une boucle sans perte de constituants.

## Ruptures et expériences de persistance

`breakup.probability`, nul par défaut, est une probabilité choisie par structure et par génération. Après assemblage, chaque demi-corde, corde ou boucle sélectionnée est défaite en ses points constitutifs. Elle ne peut pas se réassembler dans le même pas. Ce mécanisme n'est ni un taux thermique ni un calcul de tension de corde.

Après avoir sélectionné une cellule, **Rompre une structure de la cellule inspectée** défait son composant de plus haut niveau (le premier en cas d'égalité). La génération et l'état aléatoire ne changent pas ; le contenu est conservé. L'intervention est enregistrée avec la composition avant rupture. Reprendre permet de mesurer la réorganisation, sans garantir un retour de X. La mémoire du condensat, si activée, conserve son rôle explicite.

Le suivi des épisodes X mesure une présence continue sur un site, sans suivre l'identité d'un objet qui migre ou fusionne. Chaque épisode conserve son début, sa fin éventuelle, sa cause de clôture et ses indicateurs de censure. Toute modification de règles ou intervention clôt les épisodes observés comme censurés à droite et commence une nouvelle fenêtre pour les X encore présents. Les X déjà présents au début d'une fenêtre sont censurés à gauche. Seule une perte dans la dynamique clôt un épisode par `lost`. Une durée observée n'est pas une preuve de stabilité ni un taux de nucléation.

## Bilan explicite des constituants

Chaque pas vérifie exactement : `N_après − N_avant = créés − disparus − annulés − plafonnés`. Un écart non nul interrompt le calcul. Les assemblages, ruptures, émissions et déplacements conservent les points ; les flux des autres règles sont enregistrés. La quantité créée est celle effectivement injectée par la règle de naissance, après les limitations de son mode d'héritage. Ce bilan ne définit ni une énergie conservée ni une masse physique. Des poids modifiés peuvent changer la masse attractive lors d'un assemblage.

## Comparer des graines

Le panneau **Préparer une expérience reproductible** rend la graine et la forme initiale accessibles. Une modification exige **Nouvelle population avec ces réglages**, afin de ne pas laisser croire que la population actuelle a été produite par la nouvelle graine. **Recommencer** reprend les règles actives.

Pour une comparaison sans interface, depuis ce dossier :

```sh
node sources/compare-seeds.cjs regles-automate.json 728931,2,3 40
```

Le résultat `comparaison-graines.json` conserve toutes les graines, règles, trajectoires de compteurs, épisodes et l'empreinte du moteur. Une première apparition `null` signifie qu'aucun X n'a été observé pendant cette fenêtre, pas qu'il est impossible. Le nombre d'expériences positives n'est pas une probabilité cosmologique. Un quatrième argument permet de choisir un autre fichier de sortie.

Les anciens JSON v2/v3 conservent leur région initiale, la représentation en enveloppe et l'émission par point ; la rupture reste inactive. Les archives des deux versions restent dans `audit-alignement/version2/` et `audit-alignement/version3/`. L'export d'expérience v4 ajoute les interventions, épisodes et limites du modèle ; ce n'est pas un fichier de reprise.

## Hypothèses qui restent à construire

Les dimensions spatiales émergentes, les champs bosoniques, les interactions avec les photons, la gravitation relativiste, les bilans énergétiques et la thermalisation ne sont pas simulés. Aucun effet de lentille ou de mirage n'est ajouté comme animation trompeuse. Les constituants visibles remplacent une convention sphérique ; leurs positions intra-cellulaires et leurs ondulations restent des glyphes, pas une géométrie de filaments mécaniques. Ces distinctions figurent aussi dans la page et dans les exports.
