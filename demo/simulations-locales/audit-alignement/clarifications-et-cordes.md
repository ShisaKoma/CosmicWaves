# Clarifications de l'hypothèse et interactions entre cordes

Note , après l'audit. Elle précise l'intention  sans modifier rétrospectivement les résultats calculés ni les règles du moteur.

## 1. Causalité précisée

La gravitation est envisagée comme induite pendant la mutation du nuage et doit participer à la formation du premier agrégat. L'agrégation de toutes les boucles est proposée comme condition de formation et comme mécanisme de stabilité.

**Réponse ultérieure  aux questions de clarification.** Il s'agit de toutes les boucles locales. Comme dans un jeu de la vie, leur combinaison doit permettre l'émergence d'une condition collective ou d'une configuration X ; la gravitation de cette formation commence alors à s'appliquer. L'information évoquée est celle que distribuent les boucles.

La chaîne retenue est donc : **évolution locale des boucles et de l'information qu'elles portent → configuration X → activation de sa gravitation → influence sur les assemblages voisins**. Des rétroactions sont possibles, mais ne sont pas encore définies par une équation. Cette chaîne exprime une hypothèse de travail ; elle ne décrit pas encore un résultat de gravitation émergente.

Cela corrige notre interprétation intermédiaire, qui plaçait la gravité avant tout assemblage local. Une organisation préalable non gravitationnelle est maintenant compatible avec l'intention. Le principe du moteur « configuration reconnue → source attractive » va dans ce sens. L'écart à préciser est le prédicat de reconnaissance : rien ne démontre que la couverture chromatique actuelle équivaut à X, ni que X doit être la sphère finale. La gravitation peut participer à l'agrégation ultérieure sans amorcer les premières combinaisons.

## 2. Quels écarts deviennent des défauts fonctionnels ?

| Point | Clarification | Conséquence |
|---|---|---|
| Gravité | Elle s'active lorsque la combinaison locale fait émerger X | Principe du déclenchement compatible ; correspondance entre X et le critère actuel à définir |
| Intensité nulle | Les combinaisons préalables peuvent exister avant la gravitation de X | Leur existence n'est pas, à elle seule, un bug ; un déplacement dû au canal gravitationnel à intensité nulle en serait un |
| Formation | Elle dépend de l'assemblage complet des boucles | Un seuil combinatoire est un choix possible ; un seuil thermodynamique n'est pas obligatoire pour définir cet automate |
| Stabilité | Elle est attribuée à cet assemblage | Hypothèse de mécanisme à tester sous perturbation ; le booléen persistant ne constitue pas cette démonstration |
| Rayon | Des fonctions antérieures étaient présentes | Fonctions retrouvées, non intégrées au moteur de cordes |
| Matière/plasma | Le bilan et l'identification restent ouverts | À conserver comme chantier, sans assimiler les comptes de couleurs à une composition physique |

La proposition intermédiaire consistant à supprimer toutes les liaisons à gravité nulle n'est donc pas retenue comme correction : elle pourrait empêcher le précurseur de la gravitation d'apparaître. Il reste utile de distinguer rencontre, superposition, liaison et fusion. Des naissances peuvent aussi copier des structures selon le mode d'héritage choisi ; leur sens devra être explicité.

La configuration X et l'intensité attractive sont deux observables différentes. Une configuration peut satisfaire le critère de source tout en n'exerçant aucune attraction si le coefficient est mis à zéro. Cela explique les étiquettes de foyers à intensité nulle ; l'affichage devrait distinguer configuration admissible et attraction effective. Le devenir d'un objet déjà formé après extinction de sa gravité reste à définir, sans imposer ici une destruction.

## 3. « Toutes les boucles » n'est pas encore défini par le code

Actuellement, `describe()` vérifie au moins `minimumLoops` boucles et la couverture de `requiredPositions` identifiants de couleur parmi leurs constituants (`structures-engine.js`, lignes 59–65). Il ne vérifie pas la capture de toutes les boucles d'un nuage, ni une boucle distincte par type, ni un réseau de liaisons entre elles.

L'auteur a choisi **toutes les boucles locales**, avec la possibilité qu'une combinaison X émerge. Ce n'est pas l'exigence de réunir toutes les boucles du nuage entier ni celle de représenter simplement chaque couleur. Il reste à définir la région locale, les relations entre boucles et le motif ou la condition qui constitue X ; ces détails ne sont pas remplacés arbitrairement par un seuil numérique.

Notation proposée pour séparer les éléments du futur calcul : C_i(t) désigne la configuration des boucles dans le voisinage du site i ; X_i(t)=1 si un prédicat P_X(C_i(t)) est satisfait, et 0 sinon. L'amplitude de la contribution attractive peut alors dépendre de X_i et d'un coefficient réglable. Cette notation ne choisit ni P_X, ni une loi de gravitation physique. Elle rend explicite la séparation entre émergence de la configuration et action de l'interaction.

La complétude peut définir un **événement de formation**. La stabilité ajoute une question dynamique : après déplacement, déformation ou rupture d'une liaison, l'assemblage reste-t-il lié, se répare-t-il ou se disperse-t-il ? Il n'est pas nécessaire d'imposer notre ancien modèle pression–surface–réservoir comme seul mécanisme possible. Une stabilité par liaisons ou contraintes topologiques demande cependant une loi de liaison, de déliaison et de déformation ; le moteur ne calcule actuellement ni entrelacement topologique ni tension réelle des filaments.

## 4. Fonctions de rayon retrouvées

Dans `sources/cycle-3d.html` :

- lignes 185–186 : rayon de l'amas puis rayon compacté, avec le facteur racine cubique de la fraction volumique ;
- lignes 216–219 : interpolation des positions vers le condensat en 2,4 secondes ;
- lignes 221–223 : augmentation du rayon des particules sortantes suivant leur vitesse ;
- lignes 232–234 : passage à la transformation lorsque toutes les particules sélectionnées sont captées, puis à l'expansion.

Ce cycle contient donc bien une compaction et une expansion. Son noyau conservé est immobilisé par règle, et son expansion est prescrite par une vitesse. Ces fonctions ne constituent pas à elles seules le retour vers un rayon stable.

Le calcul `output/plasma-bulle/calcul_bulle.py`, fonction `integrate()` à partir de la ligne 56, intègre séparément une relaxation `dr/dτ = -df/dr`, avec un minimum attractif dans certains régimes. Ce calcul porte sur une autre énergie phénoménologique.

Les trois éléments — cycle animé, relaxation radiale et assemblage de cordes — existent dans des moteurs distincts. L'absence de rayon dans l'automate est un manque d'intégration au regard de l'objectif maintenant précisé. Aucun historique de versions n'a été établi permettant de dater une régression ou d'affirmer qu'une fonction identique a été cassée.

## 5. Travaux pertinents à intégrer à la discussion bibliographique

Recherche ciblée de sources primaires ; les résumés des travaux ci-dessous ont été vérifiés. Aucune de leurs lois détaillées n'est encore transcrite dans le simulateur. Cordes fondamentales, cordes D et défauts de champ ne sont pas des identifications interchangeables de nos filaments colorés.

1. **Jackson, Jones et Polchinski, _Collisions of Cosmic F- and D-strings_**, prépublication 2004, publication JHEP 2005. [arXiv:hep-th/0405229](https://arxiv.org/abs/hep-th/0405229). Étudie les collisions de différentes cordes et leurs probabilités dans des modèles dépendant notamment de la compactification. Pertinence : remplacer à terme une probabilité universelle de liaison par un mécanisme et des paramètres définis. Ne justifie pas l'actuelle liaison fondée sur les couleurs RGB.

2. **Copeland, Kibble et Steer, _Collisions of strings with Y junctions_**, 2006. [arXiv:hep-th/0601153](https://arxiv.org/abs/hep-th/0601153). Étudie la rencontre de cordes de Nambu–Goto et les jonctions reliant trois segments. La formation est soumise à des contraintes cinématiques ; une vitesse relative très élevée peut empêcher l'échange étudié. Pertinence : distinguer contact et liaison et représenter une géométrie de jonctions. Une proximité sur la grille ne suffit pas à reproduire ce résultat.

3. **Rajantie, Sakellariadou et Stoica, _Numerical experiments with p F- and q D-strings: the formation of (p,q) bound states_**, 2007. [arXiv:0706.3662](https://arxiv.org/abs/0706.3662). Simule un modèle de champs dont le potentiel permet des états liés entre deux types de cordes. Les auteurs comparent les évolutions avec et sans interactions à longue portée et trouvent des durées de vie différentes des états liés. Pertinence : exemple de liaison produite par une interaction explicite, dont la persistance est ensuite étudiée. Le potentiel est choisi pour représenter ces interactions, pas dérivé de notre automate.

4. **Battye, Cotterill et Pearson, _A detailed study of the stability of vortons_**, prépublication 2021, publication JHEP 2022. [arXiv:2112.08066](https://arxiv.org/abs/2112.08066), [article](https://link.springer.com/article/10.1007/JHEP04%282022%29005). Construit et fait évoluer des boucles de cordes soutenues par le moment cinétique associé à des charges et courants piégés. Des modes stables et instables sont analysés. Pertinence : exemple concret de stabilité étudiée au-delà du simple fait qu'une corde est fermée. Un vorton est une boucle dans un modèle particulier ; ce n'est pas une bulle sphérique produite par l'agrégation de toutes nos boucles.

5. **Danos, Frey et Mazumdar, _Interaction Rates in String Gas Cosmology_**, 2004. [arXiv:hep-th/0409162](https://arxiv.org/abs/hep-th/0409162). Calcule des taux d'interaction, notamment d'annihilation de cordes enroulées, et discute les limites de l'équilibre thermique dans le scénario étudié. Pertinence : un gaz de cordes et ses taux exigent un régime physique défini, pas seulement une fréquence de tirage aléatoire.

Ces références donnent des mécanismes à comparer. Les travaux examinés ne démontrent pas notre implication « toutes les boucles réunies → sphère stable → gravité induite ». L'existence de publications sur les liaisons n'établit pas non plus qu'elles doivent s'annuler si l'on supprime la gravité : plusieurs des interactions étudiées sont des mécanismes distincts. Imposer cette annulation serait un choix propre à notre hypothèse, à annoncer comme tel.

## 6. Probabilité et présence de l'information

L'auteur précise qu'il parle de **l'information que distribuent les boucles**. La lecture précédente, limitée à une configuration complète déjà définie, était trop restrictive. Pour la simulation, on peut proposer de décrire cette information par les états portés par les boucles et leurs relations spatiales ou de liaison ; la liste exacte des états et le mécanisme de distribution restent à définir. Ce n'est pas encore une grandeur en bits, une entropie thermodynamique ou une nouvelle interaction physique calculée.

Il faut distinguer la présence de ces états dans le nuage, leur transport et leur combinaison locale susceptible de former X. Une même composition globale peut être répartie de différentes manières et ne pas réaliser les mêmes motifs locaux. Le moteur représente surtout des compositions par couleur ; il ne décrit pas encore tout réseau de relations que X pourrait exiger.

La remarque probabiliste ci-dessous reste valable si l'on étudie ensuite la fréquence d'un motif X précisément défini ; elle n'est pas une définition de l'information distribuée.

Pour N possibilités indépendantes, chacune avec une probabilité p de réaliser la configuration, on a

\[
P(\text{au moins une réalisation})=1-(1-p)^N.
\]

Pour 0<p<1 et N fini, cette probabilité augmente avec N mais reste inférieure à 1. Pour p=0, multiplier les possibilités ne rend pas la configuration accessible. L'indépendance n'est pas établie entre cellules voisines ou générations successives de l'automate. N ne peut donc pas être remplacé arbitrairement par le nombre de générations.

L'analogie avec un jeu de la vie ne garantit pas que X finira par apparaître : les règles et l'état initial peuvent conduire à un état figé ou à un cycle sans X. L'accessibilité du motif et sa fréquence sont des résultats à mesurer, pas des conditions de réussite à imposer au code.

Il faut aussi distinguer : les constituants sont présents quelque part dans le nuage ; ils sont réunis localement ; ils sont effectivement liés ; l'assemblage persiste. Le premier événement n'implique pas les trois suivants. Aucun taux Γ ni aucune équivalence entre probabilité croissante et existence observée n'est ajouté par cette note.
