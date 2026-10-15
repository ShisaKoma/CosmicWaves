# Surfaces ondulantes : fermeture, agrégat et attraction

Ouvrir **ondes-3d.html** dans un navigateur. Le fichier est autonome, sans installation ni réseau. Cette variante est distincte de l'automate de cordes v4, qui reste accessible par la navigation.

## Hypothèse mise en calcul

Proposition de remplacer le brouillard par plusieurs surfaces ondulantes colorées : leur combinaison locale doit fermer une géométrie avant de déclencher l'agrégat et l'attraction. La sphère est une possibilité, pas une exigence.

La traduction choisie ici exige que **toutes les couleurs contribuent à la frontière d'un même volume fermé**. Elle n'exige pas que toutes les surfaces passent par un point unique, ni qu'un voxel porte toutes les couleurs en même temps. Ce dernier indicateur est compté séparément et correspond au mode « Croisement seul ». La géométrie peut être irrégulière ; aucun test de sphéricité n'est appliqué.

Un agrégat est ici une région qualifiée sur la grille, pas une particule ou une nouvelle phase de matière. Les surfaces continuent d'exister après sa détection. Leur attraction peut modifier les croisements suivants. Le programme ne raccorde pas encore ces régions aux points et boucles de l'autre automate, et ne lance pas automatiquement son ancien cycle d'expansion.

## Clarification de l'hypothèse : la fermeture créerait l'espace

L'auteur précise que la fermeture ne doit pas simplement délimiter un volume déjà existant : elle **créerait un domaine spatial**, dont la gravitation permettrait ensuite au condensat d'agréger les surfaces ou des portions de celles-ci. Le couplage entre ce contenu et la géométrie devrait faire émerger un espace-temps. C'est l'objectif proposé, pas un résultat obtenu.

La réalisation actuelle ne couvre pas cette étape : elle présuppose les distances euclidiennes, une grille 3D, un temps et des normales de surfaces avant toute fermeture. Elle détecte une cavité dans cet espace et active une force prescrite. Elle ne possède ni métrique dynamique, ni capture/transfert des surfaces vers un condensat doté d'une énergie propre. Déformer h sous attraction n'est pas encore une agrégation conservatrice de contenu.

Pour une prochaine branche du modèle, les relations à construire sont :

1. **Configuration fermée → géométrie intérieure.** Définir ce qui mesure les distances, les volumes et les possibilités de propagation à l'intérieur, à partir de la configuration des surfaces. Un masque « espace présent » serait seulement un indicateur conventionnel tant que cette règle manque.
2. **Contenu ↔ géométrie.** Attribuer une énergie et des contraintes mécaniques aux surfaces, puis une loi par laquelle elles modifient la géométrie et sont en retour déplacées par elle. L'existence d'un volume fermé ne détermine pas à elle seule l'intensité ou le caractère attractif d'un effet gravitationnel.
3. **Agrégation et causalité.** Définir quelle portion est capturée, les échanges d'énergie entre surfaces et condensat, les signaux et les horloges internes. L'indice des pas du calcul n'est pas une dérivation du temps physique.

Deux lectures doivent rester distinctes : un espace-temps intérieur effectif émerge dans un milieu parent déjà doté d'une dynamique ; ou l'espace et le temps eux-mêmes émergent d'objets sans distances ni durée physiques préalables. La seconde demande de remplacer les surfaces dessinées dans une boîte par une description préalable en relations ou configurations. Aucun choix entre ces deux lectures n'est attribué à l'auteur à ce stade.

**Repères théoriques.** La relativité générale relie la géométrie de l'espace-temps à l'énergie-impulsion, sans postuler qu'une enveloppe fermée crée cette géométrie : [Carroll, cours de relativité générale](https://arxiv.org/abs/gr-qc/9712019). Des travaux sur la gravité analogue construisent une métrique effective pour la propagation de perturbations à partir d'une dynamique de champs ; cela fournit une méthode de comparaison, sans valider notre mécanisme de fermeture : [Barceló, Liberati et Visser, 2001](https://arxiv.org/abs/gr-qc/0104001).

La prochaine cible calculable proposée est donc la reconstruction d'une géométrie intérieure à partir de la propagation des perturbations, puis son évolution avec les échanges de contenu. Les équations nécessaires restent à définir. Les résultats numériques présentés plus bas concernent uniquement le moteur existant.

## Objets et unités

Chaque surface i possède deux coordonnées internes (u,v), une base orthonormale fixe (eᵢ,fᵢ,nᵢ), un décalage bᵢ et un déplacement normal hᵢ :

    rᵢ(u,v,t) = u eᵢ + v fᵢ + [bᵢ + hᵢ(u,v,t)] nᵢ.

Le domaine de référence est un carré de côté L = 3,2. Chaque surface est un graphe à un déplacement normal ; elle ne peut pas se replier librement sur elle-même. Les conditions sont périodiques sur h dans les coordonnées u,v. Le carré visible ne constitue pas un objet physique infini ou une surface fermée. Les couleurs (2 à 8) identifient des surfaces, sans représenter des bosons, des charges ou des dimensions spatiales supplémentaires.

L'espace ambiant est fixé à trois dimensions. Longueurs, temps, énergie et intensité attractive sont en unités arbitraires. La graine initialise les orientations, phases et décalages ; aucune fluctuation aléatoire supplémentaire n'est injectée ensuite.

## Évolution

    ∂²hᵢ/∂t² = c² Δ₂hᵢ − γ ∂hᵢ/∂t + aᵢ.

Le Laplacien est discrétisé par différences centrales sur une grille périodique N × N, de pas δ = L/N. L'intégration utilise velocity Verlet, avec deux demi-pas de dissipation exponentielle. La validation impose c Δt/δ ≤ 0,5. Cette condition contrôle la partie onde ; elle ne garantit pas la précision du couplage attractif pour tous les paramètres.

L'état initial superpose deux sinusoïdes selon u et v. La vitesse initiale correspond à leur propagation avec la vitesse c dans la formule continue. Les tests de convergence temporelle comparent l'intégration à la solution exacte du système spatial discrétisé, avec sa propre fréquence.

L'énergie diagnostique est :

    E_ondes = Σᵢ,grille δ²/2 [vᵢ² + c² ((Dᵤhᵢ)² + (Dᵥhᵢ)²)].

Elle exclut l'énergie du couplage et de l'apparition/disparition des sources. Ce modèle ne conserve pas une énergie totale définie. La charge des sources n'est pas prélevée dans E_ondes.

## Détection de fermeture

Le détecteur inspecte le cube [-1,1]³ sur une grille M³. Pour chaque centre p de voxel, une surface contribue si p se projette dans son carré et si :

    |p · nᵢ − bᵢ − hᵢ(p · eᵢ, p · fᵢ)| ≤ ε.

h est interpolé bilinéairement. ε est une demi-épaisseur effective, mesurée selon la normale du plan de référence ; ce n'est pas la distance minimale exacte à la surface courbe.

1. Un voxel touché par au moins une surface est marqué occupé, avec la liste de ses couleurs.
2. Les composantes libres sont parcourues en autorisant 26 voisins, donc également les passages diagonaux.
3. Toute composante touchant le bord de la boîte est extérieure. La boîte ne sert jamais de paroi artificielle.
4. Une composante intérieure devient candidate si toutes les couleurs apparaissent sur les voxels occupés de son voisinage à 26 voisins.
5. Un voxel candidat doit rester candidat pendant `holdSteps` pas consécutifs pour être qualifié. L'état initial ne compte pas comme un pas.
6. Les voxels qualifiés sont regroupés à 6 voisins pour former les agrégats attractifs. Ce choix plus restrictif peut diviser une même région candidate en plusieurs foyers. Les compteurs distinguent donc régions fermées et agrégats.

La durée est mesurée à des sites fixes, sans suivi d'identité d'un objet mobile. Les couleurs peuvent se répartir sur différents morceaux de frontière ; leur présence n'établit pas que chacune est indispensable à la fermeture. Un test de retrait individuel serait nécessaire pour cette condition plus forte.

En mode **Croisement seul**, les voxels candidats sont simplement ceux qui portent toutes les couleurs simultanément. La persistance et la suite du calcul sont identiques ; aucun volume fermé n'est alors exigé.

## Attraction après le seuil

Chaque agrégat α reçoit un centre Rα (moyenne des centres des voxels qualifiés) et une charge conventionnelle Qα = nombre de voxels × (2/M)³. Il exerce sur les surfaces :

    aᵢ(r) = G Σα Qα [(Rα − r) · nᵢ] / (|Rα − r|² + s²)^(3/2).

s adoucit le centre de l'attraction. Les sources sont figées pendant un pas ; les sources nouvellement détectées agissent au pas suivant. À G = 0 ou avec l'attraction désactivée, la détection reste active sans agir sur les ondes. Une perte de la qualification supprime la source pour le pas suivant.

Cette force instantanée et projetée est une règle effective choisie. Elle ne résout pas un champ médiateur causal, la gravitation relativiste, l'effondrement cosmologique ou la conversion d'énergie en matière. Aucune température ni entropie thermodynamique n'est calculée.

## Utilisation et reproductibilité

Les réglages visibles ou le JSON complet recommencent l'expérience en pause. Pour comparer, conserver la graine, les paramètres et la durée simulée. Une caméra différente ne change aucun calcul. L'export contient configuration, historique, champs et vitesses finaux, âges de qualification et sources. C'est un relevé documentaire ; seul son champ `config` peut être recopié dans l'éditeur de paramètres, pas le fichier entier.

Deux résolutions sont indépendantes : `resolution` pour les ondes et `detectorResolution` pour le seuil. Changer Δt demande de changer `holdSteps` si l'on veut garder la même durée de persistance. Changer ε modifie la définition de l'objet détecté, et pas seulement la précision numérique.

Commandes depuis ce dossier :

```sh
python3 sources/build-waves.py
node sources/check-waves.cjs
node sources/compare-waves.cjs
```

Le comparateur enregistre dix trajectoires de 100 pas (t = 2), leurs configurations et l'empreinte SHA-256 du moteur dans **comparaison-ondes.json**. Il conserve les essais sans émergence.

## Vérifications 

**15 scénarios numériques réussis** : reproductibilité, attraction nulle, couleur absente, persistance, activation différée, enveloppe fermée/ouverte, fuite diagonale, frontière du domaine, simple croisement, six surfaces planes dans le détecteur complet, validation CFL, convergence temporelle, énergie sans couplage et dissipation, charge et export.

Pour le mode de Fourier discrétisé sans attraction ni dissipation, à t = 1, l'erreur quadratique moyenne sur h passe de 1,20454 × 10⁻⁵ à 3,01113 × 10⁻⁶ lorsque Δt passe de 0,02 à 0,01. Cela vérifie la convergence temporelle du solveur d'onde dans ce cas, pas celle du seuil géométrique.

Avec les paramètres par défaut, sur 100 pas :

| Graine | Premier agrégat, fermeture | Premier agrégat, croisement seul |
| --- | ---: | ---: |
| 728931 | aucun | 8 |
| 2 | 7 | 50 |
| 3 | aucun | 3 |

Pour la graine 2, faire varier uniquement M donne :

| M | Premier agrégat fermé |
| --- | ---: |
| 12 | aucun |
| 16 | 98 |
| 20 | 7 |
| 24 | 12 |

**La convergence du critère de fermeture n'est donc pas établie.** Les petites cavités et les passages fins sont sensibles à l'épaisseur et à l'échantillonnage. Ces détections ne prouvent pas que les surfaces continues ferment réellement un volume. Pour avancer, il faut raffiner le détecteur, comparer des durées/volumes plutôt qu'un seul premier passage et envisager une intersection géométrique explicite des maillages. Aucun de ces taux ne constitue une probabilité cosmologique.

Un témoin sans attraction pour la graine 2 reproduit le premier passage au pas 7 et le maximum de 4 agrégats sur cette fenêtre. Ce résumé seul ne démontre donc pas un effet amplificateur de l'attraction.

L'interface a été manipulée dans le navigateur local : pas individuel, changement de graine, fermeture, critère alternatif, intensité zéro, rejet d'une graine invalide et absence d'erreur JavaScript lors de ces actions. Le rendu 3D a été inspecté visuellement.
