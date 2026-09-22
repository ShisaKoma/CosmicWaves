# Surfaces ondulantes — version 2

**Extension géométrique :** branes centrales, dissymétrie, domaines multiples, seuils d’émergence et stabilité sur une fenêtre finie. Voir [le guide et le protocole](GEOMETRIE-MULTIDOMAINE.md). Le mode collectif est actif par défaut ; les descriptions du critère individuel ci-dessous restent celles de la branche précédente.

Ouvrir **ondes-3d.html** dans un navigateur. Le HTML est autonome, sans installation ni réseau. Le champ numérique **Positions / surfaces** accepte un entier de **2 à 32**, avec des raccourcis 10, 11, 26 et 32. Ces positions identifient les couleurs et surfaces ; elles ne sont pas des axes spatiaux supplémentaires. Chaque surface a une couleur distincte et un numéro ; le filtre d'affichage permet de l'isoler visuellement sans modifier la dynamique.

## Choix de l'auteur et traduction retenue

La fermeture créerait un espace intérieur ; cet espace permettrait une attraction qui agrège les surfaces. L'auteur propose un domaine initial aussi petit que possible, une répartition égale entre surfaces, un partage local 50/50, une déformation puis un rétrécissement après cassure. La sphère centrale représente son objet d'étude appelé « sphère du Big Bang ». Le temps intérieur pourrait commencer après sa naissance.

La v2 implémente des **conventions exploratoires** pour examiner cette séquence :

- Un domaine apparaît après qualification géométrique persistante. Il reçoit un identifiant et une horloge initialisée à zéro.
- Son centre est choisi parmi les voxels qualifiés, au plus près de la moyenne des points de surface les plus proches, avec le même poids pour chaque surface.
- Son rayon initial `minimumRadius` vaut 0,05 par défaut. Il s'agit d'une petite échelle choisie et réglable, pas d'une longueur fondamentale ni de la solution d'un problème d'optimisation géométrique. La moyenne à poids égaux ne garantit pas des distances égales à toutes les surfaces.
- L'attraction déforme les hauteurs des surfaces et permet une capture égale sur chacune des portions voisines. Au maximum 50 % du contenu de chaque élément local est transférable par défaut ; l'autre moitié reste sur la surface.
- Une perte de la fermeture suivie ou une rupture manuelle des liaisons coupe l'attraction du domaine. Sa sphère rétrécit. Le contenu capté reste compté comme résidu.

La forme sphérique du domaine est donc prescrite pour cette représentation, alors que la région fermée détectée peut être irrégulière. Le rayon ne mesure pas la forme réelle de sa frontière. La v1 et son guide sont conservés dans [audit-alignement/ondes-version1](audit-alignement/ondes-version1/ONDES.md).

## Utiliser et comparer

**Appliquer et recommencer** emploie les réglages saisis et redémarre en pause. **Essai de fermeture préparée** dispose les surfaces autour du centre, avec une faible amplitude (0,02), une épaisseur de 0,08 et une grille de détection de 24³. Cette préparation est affichée comme telle : elle facilite une fermeture et ne sert pas à estimer sa fréquence spontanée. La graine et le nombre de surfaces saisis sont conservés. Pour revenir au semis aléatoire, choisir `initialLayout: "random"` dans le JSON et remettre l'amplitude souhaitée.

La sphère centrale est repérée par D1, D2, etc. L'inspecteur indique son pas de naissance, son horloge, son rayon et sa capture par surface. **Rompre les liaisons** enregistre une intervention sans avancer le calcul. Un pas suivant fait commencer la contraction. L'affichage des voxels qualifiés est optionnel pour ne pas masquer le domaine central.

À intensité nulle, la qualification et la naissance restent observables mais aucune attraction ni capture n'agit. Les surfaces continuent leur dynamique d'onde. L'option **Croisement seul** est un témoin qui remplace la fermeture par la présence simultanée de toutes les couleurs ; un domaine obtenu dans ce mode ne satisfait donc pas le postulat de fermeture.

L'éditeur JSON donne accès aux paramètres avancés, dont `captureFraction`, `captureRadius`, `minimumRadius`, `shrinkRate` et `domainEnabled`. Le texte de l'interface décrit le défaut 50/50 ; modifier `captureFraction` modifie ce partage. Les anciens paramètres v1 sont migrés en conservant le nombre de surfaces et en désactivant le nouveau cycle des domaines.

## Surfaces et équation d'onde

Chaque surface i est un graphe 2D orienté dans un espace de calcul 3D :

    rᵢ(u,v) = u eᵢ + v fᵢ + [bᵢ + hᵢ(u,v)] nᵢ.
    ∂²hᵢ/∂s² = c² Δ₂hᵢ − γ ∂hᵢ/∂s + aᵢ.

s est le paramètre d'évolution numérique. Les coordonnées (u,v) parcourent un carré de côté 3,2. Les bases sont fixes, le déplacement est normal et les hauteurs/vitesses ont des conditions périodiques. Les surfaces ne se replient pas librement et ne se déchirent pas mécaniquement. La rupture ajoutée en v2 concerne leurs liaisons avec le domaine.

L'intégration utilise les différences centrales et velocity Verlet, avec dissipation exponentielle en deux demi-pas. La condition c Δs/(3,2/N) ≤ 0,5 borne le pas pour la partie onde ; elle ne garantit pas toute la précision du couplage. La graine détermine orientations, phases et décalages du départ aléatoire. Le départ préparé utilise des normales réparties sur une sphère et un décalage de 0,55 ; sa fermeture favorable est construite.

## Fermeture et suivi des domaines

Le cube de détection [-1,1]³ est discrétisé en M³ voxels. Une surface occupe un voxel centré en p si la projection reste dans son carré et si :

    |p · nᵢ − bᵢ − hᵢ(p · eᵢ, p · fᵢ)| ≤ ε.

L'interpolation de h est bilinéaire. L'écart est mesuré selon la normale de référence, pas selon la distance minimale exacte à la surface courbe.

Une région libre est fermée si aucun chemin à **26 voisins**, diagonales comprises, ne rejoint le bord de la boîte. Toutes les couleurs doivent être présentes sur sa frontière occupée. Les masques utilisent désormais 32 bits non signés : la surface 32 possède son propre bit et n'est confondue ni avec la première ni avec une valeur négative.

Les voxels doivent rester candidats pendant `holdSteps` pas consécutifs. Les voxels qualifiés sont regroupés à 6 voisins en sources. Leur suivi entre pas utilise le plus grand recouvrement de voxels, avec correspondance un-à-un. Une scission ou une fusion peut donc terminer ou créer des identifiants : le suivi n'établit pas une identité physique d'objet. Un domaine rompu qui recouvre encore sa région reste rompu ; il ne se réactive pas automatiquement.

La fermeture demeure une propriété de bandes épaisses discrétisées. Sa convergence géométrique n'est pas démontrée. Les essais v1 montraient une forte sensibilité à M = 12, 16, 20 et 24 ; l'ajout d'un cycle de domaines ne résout pas cette limite.

## Capture locale à parts égales

Chaque nœud de surface porte initialement une unité de **contenu abstrait**, indépendante de l'énergie d'onde. Le patch de chaque surface comprend les K nœuds les plus proches du centre candidat, avec :

    K = min(N², max(1, arrondi[π captureRadius² / (3,2/N)²])).

Le même K est utilisé pour toutes les surfaces. Il définit une taille approximative dans le maillage de référence, pas une aire physique déformée égale. Les patches et la position du domaine sont fixés à sa naissance.

Pour f = `captureFraction`, aucun nœud ne peut descendre sous 1 − f. La cible par surface est la plus petite réserve disponible parmi les patches. À chaque pas, toutes les surfaces cèdent la même quantité :

    ΔQ = min(cible restante, réserves disponibles de chaque patch)
         × [1 − exp(−G Δs)].

Sur chaque patch, cette quantité se répartit proportionnellement au contenu encore transférable. Le plancher s'applique globalement, même si plusieurs domaines se partagent des nœuds. La cible est approchée progressivement, sans transfert instantané de 50 % à la naissance. La capture commence au pas suivant la naissance, uniquement si l'attraction est active.

Le bilan vérifié est : contenu restant sur les surfaces + contenu capté de tous les domaines, résidus inclus = contenu initial. Il ne s'agit ni d'une masse calibrée ni d'un bilan énergétique. La diminution du contenu atténue l'affichage du patch ; le solveur d'onde reste actif sur son maillage complet.

## Déformation, rayon et rupture

Pour un domaine lié, la force adoucie reste projetée sur les normales :

    aᵢ(r) = G Σα Qα [(Rα − r) · nᵢ] / (|Rα − r|² + a²)^(3/2).
    Qα = Vα,naissance × (1 + pα)
    rayonα = minimumRadius × (1 + pα)

pα est la fraction de la cible déjà captée. La charge initiale provient du volume qualifié, puis augmente avec la capture. Les sources du début de pas sont figées pendant son intégration. Ces formules sont des couplages choisis, pas une dérivation de la gravitation à partir d'une métrique.

Après rupture, Qα cesse d'agir et la capture s'arrête. À chaque pas :

    rayonα ← rayonα × exp(−shrinkRate × Δs).

Sous 1 % du rayon minimal, le rayon affiché devient nul et le domaine est classé résidu. Son contenu reste conservé ; aucun retour automatique aux surfaces ni évaporation énergétique n'est simulé. La contraction porte sur la sphère du domaine, pas sur une métrique spatiale ou sur l'ensemble des surfaces.

L'énergie affichée reste celle des ondes seules : Σ δ²/2 [v² + c² ((Dᵤh)² + (Dᵥh)²)]. Elle exclut l'énergie des transferts, des sources et de la contraction. Il n'existe pas encore de bilan énergétique total.

## Horloge intérieure et portée physique

Avant la première naissance, l'horloge intérieure est absente. Pour chaque domaine, τ = 0 à sa naissance ; elle avance ensuite de Δs par pas jusqu'au classement en résidu. Ce temps est une convention d'âge, pas un temps propre calculé par une métrique. Le compteur principal affiche le maximum des horloges enregistrées ; l'inspecteur et l'export donnent chaque horloge séparément.

L'auteur propose que le temps soit un attribut d'après Big Bang sans causalité préalable. Le moteur ne peut pas démontrer cette proposition : l'équation d'onde présuppose encore un ordre d'évolution, des voisins et une propagation avant la fermeture. Appeler ce paramètre s plutôt que t ne supprime pas cette structure. La distinction est affichée pour éviter d'identifier directement les pas numériques à un temps physique préexistant.

Une création réelle d'espace-temps demanderait une loi de géométrie intérieure, des horloges et signaux définis par cette géométrie, et une interaction réciproque avec l'énergie des surfaces. La relativité générale fournit un cadre pour le couplage géométrie/énergie, sans dériver notre seuil : [Carroll](https://arxiv.org/abs/gr-qc/9712019). La construction de métriques effectives pour des perturbations est un point de comparaison : [Barceló, Liberati et Visser](https://arxiv.org/abs/gr-qc/0104001). Aucun de ces travaux ne valide les conventions v2.

## Export et vérifications

L'export `wave-surfaces-v2` contient configuration, historique, hauteurs, vitesses, contenu restant, domaines, patches, captures par surface, horloges et événements de naissance/rupture/résidu. Le champ `config` peut être recopié dans l'éditeur pour reproduire l'expérience depuis son départ ; l'export complet n'est pas un fichier de reprise instantanée.

```sh
python3 sources/build-waves.py
node sources/check-waves.cjs
node sources/compare-waves.cjs
```

**26 scénarios numériques** couvrent notamment les quatre palettes, le bit 32, les fermetures ouvertes/fermées, la convergence du solveur d'onde sans couplage, le début différé de l'attraction et de la capture, l'horloge, l'égalité des contributions, les domaines concurrents, le plancher 50 %, la rupture, la contraction, le résidu, les exports et la migration v1.

Le comparateur v2 enregistre huit trajectoires de 60 pas, une aléatoire et une préparée pour chaque palette, avec empreinte du moteur, configurations et bilans, dans **comparaison-ondes-v2.json**. Les anciennes dix trajectoires restent dans **comparaison-ondes.json** et dans l'archive v1 ; elles ne constituent pas des résultats du moteur actuel.

L'interface a été contrôlée dans le navigateur : sélection 32, présence des 32 identifiants, naissance dans un témoin préparé, horloge initiale, capture égale, rupture, arrêt de l'attraction, contraction et bilan du contenu. Ces contrôles valident le comportement programmé, pas sa pertinence cosmologique.

Résultats v2, graine 728931, 60 pas :

| Surfaces | Première naissance, départ aléatoire | Première naissance, départ préparé |
| --- | ---: | ---: |
| 10 | 16 | 3 |
| 11 | 16 | 3 |
| 26 | aucune | 3 |
| 32 | aucune | 3 |

L'écart maximal du bilan de contenu sur ces huit trajectoires est 1,46 × 10⁻¹¹ unité, compatible avec l'arrondi numérique. L'absence de naissance est conservée dans les résultats. La préparation modifie aussi l'amplitude et la résolution du détecteur : ce tableau compare deux configurations complètes, sans isoler l'effet de la seule disposition.

## Hypothèse à comparer : contacts inégaux et domaines déformés

L'auteur propose que des contacts inégaux entre surfaces puissent conduire à plusieurs domaines locaux, de formes différentes, éventuellement moins durables qu'un domaine unique. Le terme « univers parallèles » exprime ici l'interprétation proposée ; le moteur ne calcule que des domaines dans un espace de calcul commun, sans établir leur autonomie causale.

Trois questions sont à séparer : une inégalité de contact déforme-t-elle un domaine ? Produit-elle plusieurs régions fermées distinctes ? Modifie-t-elle leur durée de persistance ? Aucune de ces conséquences ne doit être imposée à partir des deux autres. Un domaine unique déformé, plusieurs domaines durables et l'absence de fermeture sont aussi des résultats à conserver. Une forme déformée ne serait plus une sphère au sens géométrique strict.

**Définir le contact.** Une mesure candidate est la part de frontière occupée par chaque couleur autour d'une région fermée. Normaliser ces mesures en fractions pᵢ dont la somme vaut 1 permet de comparer leur dispersion au cas pᵢ = 1/C. Cette mesure dépendra de la résolution et de l'épaisseur, et ne devra être confondue ni avec les distances aux ancrages, ni avec l'intensité d'interaction, ni avec la part de contenu captée. Des contacts répartis également ne garantissent pas à eux seuls une forme sphérique.

**Définir la forme.** Mesurer l'étendue de la région qualifiée selon ses axes principaux, à partir des coordonnées de ses voxels, fournit un indicateur de déformation distinct du rayon illustratif. Une sphère dessinée ne constitue pas une mesure de sphéricité. Une future géométrie intérieure dynamique demanderait encore une loi supplémentaire.

**Protocole proposé.** Comparer, sur plusieurs graines et un même intervalle numérique, une famille de contacts proches de l'équilibre et des perturbations graduées de ces contacts. Conserver le nombre de surfaces, les règles, la résolution, le contenu initial et les autres paramètres ; relever aussi l'énergie d'onde initiale pour signaler les différences involontaires. Mesurer nombre de composantes fermées, forme, durée des épisodes, ruptures et contenu capté. Les domaines encore liés à la fin ont une durée incomplète, pas une durée de vie égale à celle de l'essai. Les interventions manuelles sont exclues de la comparaison des ruptures spontanées, et les scissions/fusions sont identifiées séparément des pertes de fermeture.

La proposition « plusieurs domaines déformés durent moins longtemps qu'un domaine unique » est le résultat recherché, pas une règle à coder. Programmer une rupture plus rapide dès que l'asymétrie augmente ne permettrait pas de tester cette proposition.

**État lors de cette note initiale.** Les diagnostics manquaient alors. L’extension décrite dans [GEOMETRIE-MULTIDOMAINE.md](GEOMETRIE-MULTIDOMAINE.md) ajoute ensuite les mesures de forme, de symétrie centrale, de persistance et la comparaison sur plusieurs graines. Elle conserve la capture égale ; elle ne mesure pas directement une force de contact.

## Séquence forcée : sphère, agrégation et expansion

Après le premier pas, le bouton **Forcer la sphère → Big Bang** apparaît. Il suspend le monde d'ondes à son état courant et lance une séquence illustrative de douze secondes : deux secondes de fermeture sphérique prescrite, trois secondes de contraction vers un agrégat, puis sept secondes d'expansion isotrope prescrite. Les couleurs sont conservées. La caméra recule pendant l'expansion.

La séquence prélève visuellement le contenu encore transférable des portions locales, dans la limite du partage configuré ; elle ne retire rien du monde source. Son partage local est comptabilisé séparément. **Pause**, **Un pas d'animation**, **Rejouer** et **Retour aux ondes** permettent de l'examiner. Le retour retrouve le calcul suspendu. **Recommencer** réinitialise l'expérience et efface les séquences en mémoire.

L'export inclut `illustrativeSequences` et un événement `forced-illustration`, distinct des naissances détectées. Aucune fermeture parfaite ou expansion de cette animation ne constitue un résultat spontané du solveur. Le module est vérifié par six contrôles (`node sources/check-waves-illustration.cjs`) : non-modification du monde source, phases et rayons, partage local, palettes, export et déformation limitée aux patches. Le chargement initial de la page a été observé ; la vérification interactive complète a été interrompue par une limite d'utilisation de l'outil de navigateur.

## Champ numérique des positions

L'auteur précise que sa demande de « dimensions supplémentaires » désigne ici l'ancien champ des positions de couleur. Le menu à quatre nombres est donc remplacé par une entrée numérique de 2 à 32. Les raccourcis renseignent le champ sans relancer le calcul ; **Appliquer et recommencer** valide et utilise le nombre saisi. L'essai préparé utilise également ce nombre. Aucune dimension spatiale supplémentaire n'est ajoutée au moteur.
