# Ondes v2 : dissymétrie, branes centrales et domaines multiples

## Ce qui est mis en calcul

L'hypothèse de l'auteur relie une dissymétrie raisonnable, la présence de branes centrales et l'émergence de plusieurs domaines, dont la stabilité pourrait nécessiter des conditions plus restrictives. Cette extension ajoute des règles géométriques, un diagnostic de persistance et un balayage de paramètres. « Multidomaine » signifie plusieurs régions fermées de la grille ; leur identification à un multivers physique reste une interprétation à construire.

Les fréquences ne sont pas fixées à l'avance. Aucun taux de rupture supplémentaire n'est appliqué lorsque le nombre de domaines augmente. On doit pouvoir observer un ensemble symétrique durable, un ensemble fragile, une seule région, ou aucune émergence.

## Préparer les branes centrales

Le bouton **Préparer les branes centrales** conserve le nombre de positions saisi et prépare des surfaces extérieures et 0 à 3 surfaces centrales. Il requiert au moins six surfaces extérieures. Les premières faces extérieures sont orientées suivant ±X, ±Y, ±Z ; les suivantes ajoutent des paires diagonales, avec éventuellement une face coïncidente pour un nombre impair. Les couleurs restent distinctes, même pour des orientations identiques. Les branes centrales correspondent aux plans X = 0, puis Y = 0 et Z = 0, avant perturbation.

Le paramètre initial A, entre 0 et 1, décale les surfaces et perturbe leurs phases. A = 0 prépare une symétrie centrale de référence. Il ne mesure pas directement la dissymétrie de la région résultante : celle-ci est calculée séparément. Les décalages suivent A × b × 3, avec b dans [-0,12 ; 0,12]. Les ondes extérieures ont un profil pair cos(ku) cos(kv), avec une phase commune plus une perturbation proportionnelle à A. L'amplitude des branes centrales est multipliée par A. Changer A modifie donc une famille de conditions initiales, et pas seulement une distance de contact.

Sur le témoin sans onde (amplitude nulle), la détection vérifie 1, 2, 4 et 8 régions pour respectivement 0, 1, 2 et 3 branes centrales. C'est un test de construction, pas une fréquence d'émergence spontanée.

## Fermeture locale ou collective

Le détecteur conserve la définition de fermeture de la v2 : une région libre ne peut rejoindre le bord de la boîte [-1,1]³, même par les 26 voisinages diagonaux. Un volume minimal, en voxels, élimine les petites cavités avant qualification.

- **Critère individuel** : chaque région doit avoir toutes les couleurs sur sa frontière.
- **Critère collectif** : les régions fermées de la boîte réunissent toutes les couleurs sur l'union de leurs frontières. Chacune peut n'en toucher qu'une partie. C'est nécessaire pour étudier des partitions par une brane centrale.

La boîte de détection définit ici l'ensemble local étudié. Il n'existe pas encore de recherche automatique de plusieurs ensembles parents éloignés ni de test de leur indépendance causale.

En mode géométrique, une source correspond à une **région fermée réelle à 26 voisins**, et non à un fragment du masque de persistance. Les voxels persistants déterminent si cette région peut activer une source. Le suivi utilise le recouvrement des régions entre pas ; les scissions/fusions peuvent changer les identifiants. Le mode ancien reste disponible lorsque le diagnostic géométrique est désactivé.

## Mesurer la dissymétrie

Pour l'ensemble des régions admissibles, calculer son centre géométrique C en pondérant les centres de voxels également.

1. **Défaut de symétrie centrale** : fraction des voxels dont le point opposé 2C − x, ramené au voxel le plus proche, manque dans l'ensemble.
2. **Défaut de correspondance des régions** : pour chaque région i, chercher la région j qui correspond le mieux à son opposée. Comparer leur position et leur volume :

       dᵢⱼ = max(min(1, ||2C − cᵢ − cⱼ|| / R), |Vᵢ − Vⱼ| / (Vᵢ + Vⱼ))
       défaut de correspondance = maxᵢ minⱼ dᵢⱼ

   R est la moitié de la plus grande largeur de l'ensemble. Une région centrée peut se correspondre à elle-même. Cette comparaison par meilleur voisin ne constitue pas un appariement global bijectif.

Le score D est le maximum des deux défauts, compris entre 0 et 1. Les résidus inférieurs à 10⁻¹² sont ramenés à zéro. D = 0 désigne la symétrie centrale discrète de ce diagnostic, pas toute forme possible de symétrie.

Deux petits domaines opposés et deux grands domaines opposés peuvent donc avoir D = 0. Le contraste global entre plus petit et plus grand volume est exporté séparément ; il ne suffit pas à conclure à une dissymétrie. À l'inverse, une symétrie de rotation qui n'est pas une symétrie centrale peut être mal notée par ce diagnostic. Les contacts ne sont pas assimilés à des forces mesurées.

Les ellipsoïdes affichés utilisent la covariance des voxels de chaque région, avec la variance interne d'un voxel ajoutée. Ils résument des formes allongées ou aplaties ; ils ne sont ni la frontière exacte ni une solution d'équilibre. Leur dessin n'intervient pas dans le calcul des forces.

## Deux seuils différents

Les valeurs initiales sont des **choix de modèle**, modifiables :

| Paramètre | Défaut | Rôle |
| --- | ---: | --- |
| Dissymétrie maximale à l'émergence E | 0,8 | Accepter la géométrie si D ≤ E |
| Dissymétrie maximale de stabilité S | 0,2 | Classer la persistance sous ce seuil |
| Fenêtre de stabilité W | 12 pas | Exiger W observations consécutives |
| Volume minimal | 4 voxels | Rejeter les plus petites cavités |
| Persistance préalable | 3 pas | Qualification avant naissance |

S doit être inférieur ou égal à E. Les critères de couleur et de fermeture restent obligatoires ; une grande tolérance ne ferme pas une région ouverte.

Un domaine est **en observation** tant que sa fenêtre est incomplète, **sous seuil sur la fenêtre** après W observations conformes, **fragile** lorsque D > S, et **rompu** lorsqu'il perd sa qualification ou subit une intervention. « Fragile » ne signifie pas une rupture certaine. La perte du label stable ne casse pas artificiellement ses liaisons.

Une étude du multidomaine exige au moins deux **mêmes identifiants** présents durant toute la fenêtre, avec D ≤ S à chaque observation. Le témoin unique exige exactement un domaine pendant la fenêtre. Ces diagnostics ne prouvent ni stabilité asymptotique ni résistance à toute perturbation.

Pour une trajectoire donnée, le balayage calcule aussi :

    S_requis = minimum, parmi les fenêtres admissibles,
               du maximum de D rencontré dans la fenêtre.

Il s'agit de la plus petite tolérance qui aurait classé au moins un épisode observé comme stable, avec les mêmes naissances et la même dynamique. Le test vérifie que changer S seul ne change pas les trajectoires. S_requis ne décrit pas un seuil physique universel ; il ne peut rien dire si aucun groupe d'identifiants ne persiste assez longtemps.

## Fréquences et limites de l'étude

**Comparer les géométries** lance cinq valeurs de A (0, 0,25, 0,5, 0,75, 1), sans brane centrale puis avec le nombre choisi. Le nombre de surfaces, les autres réglages et la durée sont conservés. Ajouter une brane centrale à nombre de surfaces fixé remplace une surface extérieure : on compare deux constructions, pas uniquement un paramètre isolé d'un même objet. L'énergie d'onde initiale est enregistrée, car elle peut varier.

Les graines sont dispersées de façon reproductible par xorshift32 à partir de la graine saisie. Chaque cas utilise la même liste. L'interface accepte 1 à 12 graines et 10 à 300 pas. Les petits échantillons ne justifient aucune extrapolation à une probabilité physique.

Les colonnes distinguent :

- émergence d'au moins un domaine / nombre total d'essais ;
- présence d'au moins deux domaines simultanés / essais ;
- épisode stable unique / essais ayant un épisode à domaine unique ;
- épisode stable multidomaine / essais ayant un épisode multidomaine ;
- intervalle des S_requis rencontrés, lorsqu'une fenêtre est complète.

Un même essai peut contenir successivement un épisode unique puis un épisode multidomaine ; les deux colonnes ne forment pas une partition. « Sans épisode stable observé » ne signifie pas « définitivement instable ». Les domaines encore liés à la fin sont exportés avec leur âge ; leur durée de vie est incomplète. Les essais sans émergence restent dans les dénominateurs. Une annulation conserve un export explicitement partiel.

L'étude fonctionne sur des mondes séparés. Les interventions manuelles et l'animation forcée « Big Bang » du monde affiché n'y entrent pas.

## Reproduction et validation

```sh
python3 sources/build-waves.py
node sources/check-waves.cjs
node sources/check-waves-geometry.cjs
node sources/check-waves-illustration.cjs
node sources/check-waves-ui.cjs
node sources/study-geometry.cjs
```

Le dernier script produit **etude-geometrie.json** : 30 essais, 10 surfaces, 0 ou 2 branes centrales, 5 dissymétries, 3 graines, 40 pas, amplitude 0,03, grilles d'ondes et de détection de 16, E = 0,8, S = 0,2, W = 10. L'export contient les historiques, événements, identifiants, bilans, paramètres et empreintes SHA-256 des trois modules de calcul. Ce choix de grilles diffère du défaut de l'interface : il faut importer la configuration exportée pour reproduire exactement ces essais.

Les contrôles numériques couvrent les partitions symétriques, leur décentrage, les couleurs manquantes, les seuils, le volume minimal, la persistance des mêmes identifiants, le témoin unique, l'absence de faux multidomaine par fragmentation du masque, les paramètres invalides, la compatibilité avec l'ancienne v2 et les dénominateurs. Le contrôleur d'interface est testé dans un DOM isolé pour les réglages, l'animation forcée, l'annulation et le tableau de l'étude ; cela ne remplace pas une vérification visuelle dans le navigateur.

Les équations et sorties antérieures sont conservées dans **audit-alignement/ondes-version2/**. Un JSON v2 sans champ `geometry` est importé avec les diagnostics nouveaux désactivés pour préserver son comportement. Les anciennes comparaisons v2 ne sont pas présentées comme des résultats de cette extension.

## Premier balayage enregistré

Trois graines (728931, 521051280, 1594073374), 40 pas par essai. E = 0,8 ; S = 0,2 ; W = 10.

| Branes centrales | A initial | Émergence | Multidomaine | Stable unique / essais avec épisode unique | Stable multi / essais avec épisode multi | S requis observé (multi) |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 0 | 0 | 3/3 | 0/3 | 3/3 | — | fenêtre absente |
| 0 | 0.25 | 2/3 | 2/3 | 1/2 | 0/2 | fenêtre absente |
| 0 | 0.5 | 0/3 | 0/3 | — | — | fenêtre absente |
| 0 | 0.75 | 2/3 | 2/3 | — | 0/2 | 0.600 à 0.600 |
| 0 | 1 | 2/3 | 2/3 | 0/2 | 0/2 | 0.663 à 0.790 |
| 2 | 0 | 3/3 | 3/3 | — | 3/3 | 0.000 à 0.000 |
| 2 | 0.25 | 3/3 | 3/3 | — | 0/3 | 0.266 à 0.766 |
| 2 | 0.5 | 2/3 | 2/3 | — | 0/2 | 0.759 à 0.799 |
| 2 | 0.75 | 3/3 | 3/3 | — | 0/3 | 0.682 à 0.782 |
| 2 | 1 | 2/3 | 2/3 | — | 0/2 | 0.462 à 0.561 |

La référence symétrique satisfait le critère dans les trois essais, aussi bien pour le domaine unique que pour les domaines séparés par deux branes centrales. À A = 0,25, les trois essais à deux branes ont un épisode multidomaine, mais aucun ne satisfait S = 0,2 sur dix observations consécutives. Les tolérances requises observées sont comprises entre 0,266 et 0,766.

L'émergence ne croît pas de façon monotone avec A : on observe aussi des absences puis des réapparitions selon la graine. Ces données n'établissent donc pas la loi générale proposée. La sensibilité au maillage et à l'épaisseur reste à examiner avant de traiter les frontières observées comme des seuils robustes.
