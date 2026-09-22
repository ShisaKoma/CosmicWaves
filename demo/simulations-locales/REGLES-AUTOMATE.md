# Automate local des branes — version 5

Ouvrir **automate-3d.html**, puis **Forcer une fermeture / émergence** pour examiner une préparation contrôlée. Le bouton applique les réglages saisis et démarre les générations. **Une génération** met en pause et avance d’un pas. **Recommencer** retrouve la population aléatoire de la graine. Le zoom va de 0,5× à 10×.

Cette version relie le jeu de règles locales au critère géométrique utilisé dans les ondes. Elle demeure un automate 3D à constituants discrets ; ce n’est pas une simulation de gravité quantique.

## Changements de référence

- **Positions** : entier de 2 à 32, défaut 10 ; identifiants de couleur et non dimensions spatiales.
- **Émergence** : défaut `geometry`, une cavité réellement fermée dans la grille. Les conditions historiques `local-complete`, `loop-count` et `palette` restent disponibles.
- **Vie et collisions** : naissances/disparitions et collisions soustractives désactivées par défaut, afin de pouvoir suivre une redistribution conservatrice. Elles restent activables. Les assemblages points → demi-cordes → cordes → boucles continuent.
- **Attraction** : les domaines géométriques n’exigent aucune correspondance RGB. Les paramètres de recette chromatique concernent les modes historiques.
- **Captures, domaines et horloges** : registres distincts des anciennes configurations X par site.

Les JSON complets v2/v3/v4 sont migrés en conservant leur ancien mode et leurs valeurs. La [version 4 et ses règles détaillées](audit-alignement/version4/REGLES-AUTOMATE.md) sont archivées avec leur moteur et leur HTML. Le JSON fourni avec la v5 contient tous les nouveaux défauts.

## Définition d’une fermeture

Chaque cellule contenant au moins un constituant est une portion occupée de la grille, interprétée comme un fragment de surface. Les identifiants des constituants donnent les couleurs de cette portion. Le détecteur partagé avec les ondes recherche les composantes **vides** qui ne peuvent rejoindre le bord par aucun des 26 voisins, y compris diagonaux. Ce voisinage de fermeture reste 26 même si celui des règles de vie vaut 6.

La fermeture exige des frontières `closed` ; le mode géométrique refuse une grille périodique `wrap`. Un volume minimal filtre les petites cavités. Toutes les couleurs doivent être présentes sur chaque frontière, ou sur leur union si `collective` est activé. Le domaine local étudié est l’ensemble de la boîte ; des ensembles parents indépendants ne sont pas identifiés.

Le score D est celui de [GEOMETRIE-MULTIDOMAINE.md](GEOMETRIE-MULTIDOMAINE.md) : maximum du défaut de symétrie centrale des voxels et du défaut de correspondance entre positions/volumes opposés. Il ne mesure ni toutes les symétries possibles ni une énergie.

| Paramètre `branes` | Défaut | Rôle |
|---|---:|---|
| `collective` | true | Couleurs réunies sur l’union des frontières |
| `centralBranes` | 1 | 0 à 3 cloisons dans la préparation forcée |
| `asymmetry` | 0 | Décalage A des cloisons préparées, entre 0 et 1 |
| `emergenceTolerance` | 0,8 | Admission si D ≤ E |
| `holdSteps` | 3 | Fermeture admise pendant autant de générations avant naissance |
| `minRegionVoxels` | 4 | Volume minimal de chaque cavité |
| `stabilityTolerance` | 0,2 | Critère D ≤ S, avec S ≤ E |
| `stabilitySteps` | 12 | Nombre consécutif d’observations après naissance satisfaisant S |
| `captureFraction` | 0,5 | Part capturable par site et couleur, entre 0 et 0,5 |
| `minimumRadius` | 0,35 | Rayon illustratif initial, en cellules |
| `shrinkRate` | 0,2 | Rappel du rayon par génération |

Les trois durées/volumes entiers sont compris entre 1 et 100. Le rayon est entre 0,01 et 2, le rappel entre 0,001 et 1. Les paramètres non exposés directement restent modifiables dans le JSON.

Une région garde son identité si le recouvrement avec une région précédente est d’au moins la moitié de la plus petite région et si cette correspondance est unique dans les deux sens. Une scission/fusion ambiguë ouvre de nouvelles identités. Une modification du mode ou des paramètres `branes` termine les épisodes actifs. Aucune stabilité n’est prolongée artificiellement au-delà de cette modification.

L’horloge intérieure vaut zéro à la naissance et avance ensuite d’une unité par génération. Le compteur global est un ordre algorithmique ; il n’affirme pas l’existence d’un temps physique avant le domaine. La grille préexiste au calcul : l’espace-temps n’émerge donc pas au sens relativiste.

## Capture et bilan

Un domaine nouvellement né devient une source utilisable au pas suivant. Il capture **une seule fois**, au plus tôt au pas suivant sa naissance, si la fermeture est encore admise et si l’attraction est active (`gravity.enabled`, intensité et multiplicateur strictement positifs).

Les donneurs sont les cellules occupées touchant ses voxels intérieurs par les 26 voisins. Pour chaque site et couleur :

`budget initial = floor(nombre de constituants × captureFraction)`

Le transfert réel respecte ce budget et la même limite appliquée au contenu actuellement présent. À 50 %, une quantité paire est partagée exactement ; pour une quantité impaire, le point indivisible supplémentaire reste sur la surface. Retirer un point d’une structure la défait en points libres, comme dans le moteur historique.

Si plusieurs domaines partagent une frontière, ils se répartissent **un budget commun** par site/couleur, dans un ordre déterministe ; chaque domaine ne prélève pas à nouveau la moitié. Les budgets restent attachés aux sites jusqu’au redémarrage. Une reformation ou un nouveau forçage ne recharge pas un budget consommé, même si du contenu neuf arrive. C’est une convention conservatrice de cette version, pas un transport matériel avec provenance continue.

Le bilan total additionne :

`constituants sur la grille + réserves captées de tous les domaines + réserve de préparation`

Les réserves d’un domaine rompu sont conservées. Les naissances/disparitions, annulations et plafonnements éventuels sont comptés séparément ; l’écart inexpliqué doit rester nul. Il s’agit de constituants, pas d’un bilan énergétique.

La masse prescrite d’une source géométrique vaut `volume en cellules + constituants captés × poids du point`. La loi de déplacement conserve la forme historique : intensité × racine de la masse × multiplicateur / (distance² + adoucissement²), plafonnée à une probabilité de 1 ; le foyer admissible le plus fort est choisi. Le prélèvement de frontière est un transfert discret distinct de ce déplacement.

## Forçage et rupture

**Forcer une fermeture / émergence** prépare une coque cubique sur la grille avec des portions ancrées et 0 à 3 plans intérieurs. À A = 0, une préparation vide de taille suffisante donne 1, 2, 4 ou 8 cavités. Les seuils de volume, couleurs, E et durée s’appliquent encore. Une petite grille ou des réglages restrictifs peuvent empêcher l’admission.

Le décalage est arrondi en cellules entières : `round(A × max(1, rayon − 2))`, avec signes +/−/+ suivant les axes. De petits changements de A peuvent donc ne rien changer. Les cloisons sont cubiques, et non des surfaces continues ondulantes. Les choix numériques de A entre ce modèle et les ondes ne sont pas directement équivalents.

Le forçage ajoute au besoin deux constituants de la couleur assignée à chaque portion. Il déplace le contenu intérieur préexistant dans une **réserve de préparation**, conservée et exportée. Les ajouts, déplacements, sites et réglages figurent dans `interventions`. Toutes les naissances ultérieures à un forçage sont signalées comme issues d’une expérience avec intervention ; elles ne sont pas comptées comme spontanées.

**Ouvrir une brèche** retire une portion préparée vers la réserve de préparation. Le pas suivant recalcule les fermetures et leurs sources. La perte d’une cavité peut changer la symétrie de l’ensemble et disqualifier d’autres régions suivant E. Le condensat illustratif se contracte ; aucun retour au brouillard n’est imposé.

Les portions préparées sont ancrées : elles ne se déplacent ni par diffusion ni par liaison locale. Les règles de vie, si activées, peuvent néanmoins les supprimer. Leur ancrage permet une référence durable mais **ne démontre pas une stabilité mécanique**. La déformation de grille, la tension des branes et leur rupture mécanique ne sont pas calculées.

## Expansion et affichage

Le petit rayon du domaine suit un rappel exponentiel vers `minimumRadius + 0,12 × racine cubique(contenu capté)` tant que le domaine reste admis, puis vers zéro après rupture. C’est une enveloppe illustrative ; la frontière exacte est la cavité détectée et peut être non sphérique.

**Illustrer l’expansion** choisit le premier domaine actif, suspend le moteur et anime pendant dix secondes une enveloppe multicolore croissante. **Retour au calcul** retrouve le même état numérique, en pause. La séquence et sa génération de départ sont exportées dans `illustrativeSequences` ; elle ne modifie ni les constituants, ni les compteurs, ni les durées calculées.

Aucune thermodynamique primordiale, création de quarks/gluons, propagation lumineuse, métrique relativiste ou nouvelle dimension spatiale n’est calculée. Il n’y a pas de loi imposant « davantage de domaines = moins de stabilité ».

## Reproduction et vérifications

```sh
python3 sources/build-automate.py
node sources/check-structures.cjs
node sources/check-local-branes.cjs
node sources/check-interface.cjs
```

37 scénarios historiques, 14 scénarios géométriques et 9 contrôles d’interface isolée. La fermeture forcée, la capture et l’expansion ont aussi été manipulées dans le navigateur local. Ces contrôles vérifient le programme ; ils ne valident pas une théorie cosmologique.

Le moteur est réparti entre `structures-engine.js`, `local-branes.js` et le détecteur commun `waves-geometry.js`. Les sources d’interface sont `automate-app.js` et `automate.html`. Le HTML généré contient tout le code et reste autonome.

L’export d’expérience v5 contient règles, historique, interventions, épisodes X historiques, domaines, réservoirs, budgets de capture, score et état courant. Ce fichier documentaire ne sert pas de sauvegarde à réimporter ; le JSON des règles, lui, est importable. Les domaines encore actifs n’ont pas de durée de vie finale connue.
