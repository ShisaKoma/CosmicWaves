# Alignement du simulateur — version 4, 

Cette mise à jour prolonge la version 3 déjà présente. Elle applique les clarifications sur la sphère provisoire, la persistance à examiner et les résidus possibles. Elle ne prétend pas implémenter les champs bosoniques ou l'optique dont les lois restent à définir.

## Modifications réalisées

- L'ordre « assemblages locaux → condition X → attraction au pas suivant » est conservé. Les liaisons restent possibles à gravité nulle ; il n'y a alors ni foyer actif ni déplacement gravitationnel.
- Le nuage est semé par défaut dans le volume de la grille. Les constituants restent visibles lorsque X apparaît. Le rendu sphérique et le semis dans une région sphérique restent des options ; aucune mécanique de forme libre n'est revendiquée.
- Une intervention sur une cellule sélectionnée défait une structure en conservant tous ses points. Elle est enregistrée séparément et permet d'observer une réorganisation. Un taux de rupture stochastique réglable, nul par défaut, complète cette expérience.
- L'émission peut transférer un composant entier, y compris une corde ou une boucle, sans le réduire systématiquement à un point. Les règles de réserve et de sortie restent explicites. L'émission est inactive par défaut.
- Le bilan par génération distingue naissances, disparitions, annulations et plafonnements. Tout écart de constituants inexpliqué interrompt le calcul. Ce n'est pas un bilan d'énergie.
- Les épisodes de présence continue de X sont suivis par site avec début et fin éventuelle. Les changements de règles et interventions censurent les mesures, sans être comptés comme une destruction spontanée. Les objets eux-mêmes ne sont pas identifiés lors des déplacements et fusions.
- La graine et la région initiale sont accessibles dans l'interface. Leur modification exige une nouvelle population. Un outil en ligne de commande compare plusieurs graines en conservant tous les résultats.
- L'interface et les exports distinguent les mécanismes effectivement exécutés des hypothèses encore ouvertes : dimensions émergentes, bosons, photons, thermodynamique et relativité.

## Compatibilité

Les anciens fichiers de règles v2/v3 complets sont migrés. Ils conservent leurs valeurs de semis, leur rendu en enveloppe et leur émission par point ; les ruptures restent inactives. Un test compare exactement la trajectoire et l'état aléatoire du moteur v3 archivé au nouveau moteur pendant vingt générations, sur une grille de test.

Les nouvelles valeurs par défaut changent le semis de sphérique à cubique. Comparer des graines entre versions demande donc de conserver les mêmes règles, et pas seulement le même entier. Les archives v2 et v3 sont conservées ; les résultats historiques ne sont pas réinterprétés.

## Vérification

37 scénarios du moteur et 8 contrôles d'interface hors navigateur passent. Ils couvrent les fonctions existantes, la migration, la rupture et le réassemblage, l'émission entière avec et sans réserve, les flux de constituants, la censure des épisodes, la reproductibilité et l'indépendance de la dynamique au choix d'affichage.

Le simulateur a aussi été ouvert dans le navigateur local. Les pas, l'application d'une intensité nulle et d'une probabilité de rupture, le choix d'émission entière et une perturbation manuelle ont été vérifiés. Dans cette dernière expérience, une boucle de huit points est devenue huit points libres, en conservant les trois inventaires de couleur de sa cellule et sa demi-corde restante. L'interface est restée en pause et a enregistré l'intervention. Le cadrage initial du volume a été corrigé après inspection visuelle.

La comparaison des graines 728931, 2 et 3 sur quarante générations avec les nouveaux défauts a produit respectivement une première configuration X aux générations 6, 7 et 7 ; les maxima simultanés étaient 133, 122 et 120. Les bilans sont exacts à chaque pas. Il s'agit d'un contrôle de fonctionnement sur trois graines choisies, pas d'une estimation de probabilité cosmologique ni d'une conclusion de stabilité. Les trajectoires complètes de compteurs sont dans [comparaison-graines.json](../comparaison-graines.json).

## Limites restantes

X reste un prédicat combinatoire réglable. Le moteur ne calcule pas une liaison topologique, des tensions de filaments ni une stabilité thermodynamique. Les positions et ondulations des constituants dans une cellule sont illustratives. L'attraction reste une règle discrète à portée finie, sélective en couleur, sans résolution des équations gravitationnelles. Le rayon d'enveloppe reste sans rétroaction mécanique.

Les nouveaux taux de rupture et d'émission sont des paramètres exploratoires ; ils ne proviennent pas d'une action ou d'un bain thermique. L'existence de structures émises ne démontre donc pas l'hypothèse de matière noire résiduelle. Les dimensions spatiales émergentes, le médiateur causal A/B, la matière bosonique, la réfraction et l'évolution cosmologique chaude et dense demandent encore des modèles spécifiques.

## Reproduction depuis la racine

```sh
python3 output/simulations-locales/sources/build-automate.py
node output/simulations-locales/sources/check-structures.cjs
node output/simulations-locales/sources/check-interface.cjs
node output/simulations-locales/sources/compare-seeds.cjs output/simulations-locales/regles-automate.json 728931,2,3 40
```

Ouvrir ensuite `output/simulations-locales/automate-3d.html`. La page est autonome et ne dépend pas du serveur local utilisé pendant la vérification.
