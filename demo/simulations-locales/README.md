# Simulations locales

Ouvrez `index.html` par un double-clic ou avec la commande « Ouvrir un fichier » de votre navigateur. Aucun serveur, aucune installation et aucune connexion Internet ne sont nécessaires.

Pour ouvrir la **nouvelle simulation de cordes en 3D**, utilisez `automate-3d.html`. Le cycle 3D précédent reste disponible dans `cycle-3d.html`.

- **ondes-3d.html** : version 2, 10/11/26/32 surfaces, domaine central, capture locale 50/50, rupture et horloge intérieure conventionnelle. [Équations, résultats et limites](ONDES.md).
- **GEOMETRIE-MULTIDOMAINE.md** : règles de dissymétrie, branes centrales et stabilité observée ; protocole de comparaison.
- **etude-geometrie.json** : balayage de 30 essais avec historiques et seuils observés.
- **comparaison-ondes-v2.json** : huit trajectoires, départs aléatoires et témoins préparés pour les quatre palettes.
- **comparaison-ondes.json** : dix anciennes trajectoires de la v1, conservées avec son moteur dans `audit-alignement/ondes-version1/`.
- **automate-3d.html** : automate local 3D : fermeture des branes, domaines et capture 50/50 ; 2–32 couleurs et anciens assemblages disponibles.
- **REGLES-AUTOMATE.md** : description complète des règles, formules, limites du modèle et paramètres.
- **regles-automate.json** : réglages initiaux importables dans l'automate.

- **index.html** : nouveau cycle **agréger → transformer → expanser**, avec une palette de 26 ou 32 couleurs.
- **cycle-3d.html** : même cycle dans un volume, avec 6 000 particules, une caméra orientable et un attracteur réglable sur trois axes.
- **gravitation-simple.html** : modèle précédent, avec agrégation réversible autour d’un attracteur et réglage de sa portée.
- **convergence-chromatique.html** : transformation progressive de toutes les couleurs vers une couleur hexadécimale, sans déplacement vers un noyau.

Les pages proposent des liens pour passer d’un modèle à l’autre. Chaque fichier HTML contient son propre code et son apparence : il peut être copié et ouvert séparément. Gardez les fichiers ensemble pour conserver les liens de navigation et de documentation.

## Automate local des branes — version 5

La fermeture géométrique remplace la quantité de boucles comme critère par défaut. Positions 2–32 (défaut 10), seuils E/S, durée de fermeture et fenêtre de stabilité sont configurables. Le même détecteur géométrique que dans les ondes sert à reconnaître les cavités et leur symétrie.

**Forcer une fermeture / émergence** prépare une coque avec 0 à 3 cloisons centrales. Les injections sont tracées ; l’intérieur déplacé reste dans une réserve. La capture de frontière partage son contenu 50/50, avec arrondi conservateur pour les points indivisibles. **Ouvrir une brèche** permet d’observer la perte de fermeture. **Illustrer l’expansion** suspend le moteur et joue une animation distincte.

La stabilité est un diagnostic géométrique sur une fenêtre ; les portions préparées sont ancrées et leur déformation mécanique n’est pas calculée. L’espace reste une grille préexistante en 3D. [Règles, formules, bilan et limites](REGLES-AUTOMATE.md).

Les modes et JSON historiques v2/v3/v4 restent disponibles. La v4 est archivée dans `audit-alignement/version4/`. Reconstruction : `python3 sources/build-automate.py`. Vérification : `check-structures.cjs` (37), `check-local-branes.cjs` (14), `check-interface.cjs` (9). Vérification interactive locale du forçage, de la capture et de l’expansion effectuée.

`node sources/compare-seeds.cjs regles-automate.json 728931,2,3 40` compare les générations sans intervention forcée. Les résultats doivent conserver les trajectoires sans domaine. Il n’en résulte pas une probabilité cosmologique.

## Version 3D

- Glissez à la souris ou avec un doigt pour faire tourner la vue. La molette permet de zoomer. Les curseurs sous **Vue 3D** donnent aussi accès à ces réglages au clavier ou sur écran tactile.
- Déplacez l’attracteur avec les curseurs **X, Y et Z**, avant ou pendant l’agrégation. La rotation de la caméra ne déplace pas l’attracteur et ne modifie pas les trajectoires.
- Le nuage initial est sphérique. L’attraction, la transformation et l’expansion utilisent les trois coordonnées ; les particules peuvent s’éloigner dans toutes les directions.
- La compacité règle le **volume** du condensat, avec un défaut de 30 % du volume de l’amas. La part restant au centre et les vitesses par couleur restent réglables comme en 2D.
- La caméra reste utilisable en pause et s’éloigne automatiquement pour suivre l’expansion. Aucun chargement de bibliothèque ou de ressource externe n’est nécessaire.

La version 3D a été vérifiée avec le réseau désactivé : cycle complet, conservation des 6 000 particules, volume du condensat, rotation indépendante de la dynamique, zoom, déplacement en Z, palettes 26/32, pause et vitesses individuelles.

## Nouveau cycle

1. Choisissez **26 ou 32 couleurs**, une couleur hexadécimale d’agrégation et la gravitation. La couleur saisie fait partie de la palette. Cliquez ou glissez dans le bruit pour placer l’attracteur ; les curseurs de position permettent aussi de le déplacer au clavier.
2. Cliquez sur **Lancer le cycle**. Seules les particules de la zone d’influence sont captées. Le compteur mesure la progression sur cette sélection, pas sur l’ensemble du bruit. Une zone vide ne déclenche aucune transformation.
3. Lorsque **toutes les particules sélectionnées** sont agrégées, le modèle passe automatiquement à une transformation de 2,4 secondes. L’amas se compacte et chaque élément prend une autre couleur de la palette.
4. L’expansion commence automatiquement. Par défaut, **25 %** des particules sélectionnées restent au centre et les autres se déplacent vers l’extérieur, à des vitesses différentes. Les particules hors zone restent dans le bruit initial.

La gravitation et la position restent modifiables pendant l’agrégation. La zone est ensuite figée pour le cycle. **Revenir au bruit** permet de préparer un nouveau cycle ; **Pause** suspend toutes les phases.

### Condensat et vitesses

- **Part conservée au centre** : de 0 à 90 % des particules sélectionnées. À zéro, toutes les particules sélectionnées partent en expansion.
- **Surface du condensat** : de 5 à 80 % de la surface de l’amas agrégé. Le modèle est en 2D : la compacité concerne donc une surface. Le réglage par défaut est 30 %.
- **Vitesse d’expansion** : coefficient logarithmique allant de 0,001× à environ 4×, réglable pendant l’expansion. Le défaut est 0,20×.
- **Écart des vitesses individuelles** : règle les différences entre éléments d’une même couleur. Même à zéro, les coefficients par couleur peuvent être différents.
- **Vitesses par couleur** : sélectionnez une couleur, puis ajustez son coefficient de 0× à 2×. À zéro, les éléments de cette couleur s’immobilisent à leur position actuelle ; ils repartent lorsque le coefficient augmente.

La palette reste limitée à 26 ou 32 couleurs pour les éléments ; le rendu « Brouillard » les adoucit. Les particules sont conservées pendant tout le cycle, et la vue s’élargit automatiquement pour garder l’expansion visible. Ces règles décrivent une simulation visuelle paramétrable, sans unités physiques calibrées.

Les calculs restent dans le navigateur. Les réglages reviennent à leurs valeurs initiales au rechargement. Si la réduction des animations est activée dans le système, le nouveau cycle présente directement le condensat transformé, en pause ; **Reprendre** lance ensuite le mouvement.

Vérification : ouverture locale avec réseau désactivé, cycle automatique, palettes 26/32, conservation des 9 216 particules, vitesse très lente, arrêt par couleur, commandes de pause, navigation et affichage mobile.
