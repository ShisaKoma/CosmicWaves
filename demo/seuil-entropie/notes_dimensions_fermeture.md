# Notes de recherche : dimensions, information et fermeture

. Complément à [l'analyse de stabilité et d'entropie](analyse.md).

Ajout  : [examen du commentaire sur Garnier-Malet, la précession et la contraction](commentaire_garnier_malet.md). Cette référence externe est évaluée séparément ; ses affirmations ne sont pas intégrées aux postulats ou aux résultats du modèle.

**Statut.** Cette note conserve les propositions  de l'expérience de pensée et organise leur examen. Elle ajoute des hypothèses et un programme de calcul ; elle n'ajoute pas de résultat numérique aux simulations existantes. L'auteur souhaite comparer les degrés de liberté internes et les dimensions spatiales sans sélectionner prématurément l'une de ces interprétations.

## 1. Proposition à conserver

Le milieu primordial serait un « brouillard » d'objets de type corde, initialement ouverts. Une accumulation de constituants, d'excitations ou de possibilités internes pourrait modifier leur géométrie. Sous certaines conditions, un objet ouvert pourrait se fermer. Ce changement pourrait modifier les interactions avec le milieu et favoriser la formation ou la persistance d'un germe.

L'autre interprétation envisagée attribue un rôle aux dimensions spatiales elles-mêmes : leur géométrie, leur accessibilité ou éventuellement leur nombre pourrait évoluer. Le nombre de paramètres décrivant une configuration serait alors à relier, dans un sens à préciser, à une notion de dimension.

Le transport au sein du brouillard reste indéterminé. L'analogie proposée avec l'électricité dans un circuit neuronal sert à envisager une propagation, des pertes, un déclenchement et une rétroaction. Elle ne définit pas encore une interaction microscopique.

**Attribution.** Le brouillard, l'accumulation, la fermeture comme étape du seuil et son lien avec l'émergence appartiennent aux postulats . Les formalisations ci-dessous sont des outils proposés pour les examiner. Les sources citées fournissent des mécanismes et des méthodes, sans confirmer l'ensemble de ce scénario.

## 2. Vocabulaire et variables à séparer

| Notion | Sens retenu pour l'examen | Confusion à éviter |
|---|---|---|
| Dimension intrinsèque de l'objet | Nombre de coordonnées locales nécessaires pour parcourir l'objet | Un intervalle et une boucle sont tous deux intrinsèquement unidimensionnels |
| Dimension spatiale D | Nombre de directions spatiales indépendantes dans une description géométrique | D n'est pas le nombre de paramètres internes d'une corde |
| Dimension d'un espace de configurations | Nombre de paramètres indépendants décrivant localement les configurations, après contraintes et redondances | Cet espace mathématique n'est pas automatiquement l'espace physique |
| Modes internes accessibles | Possibilités de vibration ou de configuration pertinentes à l'énergie considérée | Exciter un mode existant ne crée pas nécessairement un nouveau degré de liberté fondamental |
| Capacité en états | Nombre d'états physiquement distinguables dans un cadre et sous des contraintes définis | Une augmentation de capacité n'est pas en elle-même une surcharge |
| Entropie | Quantité dépendant de la distribution des états et de la description retenue | Le simple décompte des paramètres ne détermine pas l'entropie effective |
| Accumulation n | Variable de contrôle dont le support physique reste à identifier | n n'est pas encore une énergie, une charge, un nombre de cordes ou une dimension |

Pour m variables binaires indépendantes, le nombre de configurations est 2^m et l'entropie maximale est m bits. Pour d états équiprobables distinguables, elle est log_2(d) bits. Une distribution non uniforme peut avoir une entropie inférieure. Ces exemples ne constituent pas des bornes universelles pour une corde.

L'expression « trop d'information » est conservée comme intuition de recherche. Sa traduction physique exige de préciser une contrainte : énergie disponible, spectre accessible, corrélations, limite géométrique, ou stabilité d'un état. Aucune saturation informationnelle n'a été démontrée dans le modèle existant.

## 3. Deux branches de recherche

### A. Évolution des possibilités internes

Une accumulation de constituants pourrait augmenter le nombre de variables internes. Un apport d'énergie pourrait aussi rendre accessibles davantage d'états d'un ensemble de variables déjà présentes. Ces deux mécanismes doivent être distingués lors du comptage des états.

Le calcul viserait à déterminer comment l'accumulation modifie le spectre des états ouverts et fermés, leur énergie et leur entropie. Dans le premier modèle numérique, N désigne un nombre **fixe** de coordonnées harmoniques internes. Il ne représente pas des dimensions spatiales. Le faire varier, ou rendre davantage de modes accessibles, exigerait une extension du modèle, notamment de ses échanges d'énergie et de son comptage d'états.

Résultat possible : les nouveaux états favorisent la fermeture. Contre-résultat également recevable : ils favorisent l'état ouvert, ne changent pas la différence entre les deux, ou permettent la dispersion avant toute fermeture.

### B. Évolution de la géométrie spatiale

Deux sous-hypothèses doivent rester distinctes :

1. Des dimensions déjà présentes mais compactes changent de taille ou deviennent accessibles à une échelle donnée. On pourrait suivre leurs rayons R_i(t) et les états qu'ils rendent accessibles.
2. Une nouvelle dimension spatiale apparaît réellement. Il faudrait alors définir une théorie donnant un sens à ce changement et établir sa cohérence ; cela ne se réduit pas à ajouter une coordonnée dans une simulation.

La première sous-hypothèse dispose de mécanismes étudiés en théorie des cordes : les rayons de compactification modifient les masses des modes de quantité de mouvement et d'enroulement. Dans certains modèles précis, des rayons particuliers rendent de nouveaux états sans masse et augmentent la symétrie de jauge. Cela fournit un exemple de lien entre géométrie et contenu physique ; une symétrie accrue n'implique pas à elle seule un couplage plus fort. [Tong, chapitre 8, §8.1–8.3](https://davidtong.org/pdfs/teaching/string-theory/string8.pdf)

Si « ajouter une dimension à la corde » désigne plutôt un changement de sa dimension intrinsèque, on étudierait un autre type d'objet étendu, par exemple une membrane. Cette troisième lecture ne doit pas être confondue avec les deux branches retenues.

## 4. Fermeture : géométrie et topologie

Courber un objet ouvert et rapprocher ses extrémités change sa forme. Identifier ou joindre ses extrémités de manière physique change sa topologie et ses conditions aux limites. Le rapprochement seul ne réalise pas cette identification.

Les théories de cordes possédant un secteur ouvert incluent des interactions avec le secteur fermé. Leur description impose des conditions aux extrémités et des interactions cohérentes. La possibilité théorique de tels processus donne un objet d'étude pertinent, mais ne démontre pas la règle « nombre suffisant de dimensions → fermeture ». [Tong, chapitre 3, notamment §3.1](https://davidtong.org/pdfs/teaching/string-theory/string3.pdf)

Un futur modèle devra définir au moins :

- Les configurations ouvertes O et fermées C, avec des contenus et contraintes comparables.
- Le mouvement et les propriétés physiques des extrémités.
- L'interaction qui autorise leur jonction, avec les lois de conservation applicables.
- La possibilité de réouverture, de fragmentation ou de dissipation.
- La durée pendant laquelle la configuration fermée persiste.

Une boucle n'est pas, à elle seule, une frontière qui enferme un volume tridimensionnel. Le lien entre fermeture de l'objet et confinement d'un germe doit donc être construit séparément.

## 5. Trois événements à ne pas fusionner

| Événement | Critère à rechercher | Ce qu'il ne détermine pas à lui seul |
|---|---|---|
| La fermeture devient thermodynamiquement favorable | F_C - F_O change de signe dans l'ensemble statistique choisi | La disparition d'une barrière ou le délai de fermeture |
| L'état ouvert perd sa stabilité locale | Le rappel devient instable, après examen des perturbations et des termes non linéaires | L'état final atteint ou sa persistance |
| La fermeture se produit effectivement | Une trajectoire ou un taux de transition donne une jonction dans le temps disponible | La formation d'un domaine cosmologique |

Le seuil précédent n_c concernait la stabilité locale d'une variable continue q. Son franchissement n'effectue aucun changement de topologie dans le code. Les coordonnées q positives et négatives ne sont pas des étiquettes « ouverte » et « fermée ».

Dans un cadre isotherme justifié, on peut comparer les fonctions de partition restreintes aux deux configurations :

\[
Z_O=\sum_{i\in O}e^{-E_i/(k_BT)},\qquad
Z_C=\sum_{i\in C}e^{-E_i/(k_BT)},
\]

\[
\Delta F=-k_BT\ln\frac{Z_C}{Z_O}
=\Delta\langle E\rangle-T\Delta S.
\]

Les sommes comprennent les poids et dégénérescences pertinents. Elles doivent utiliser le même cadre physique, une normalisation cohérente et les mêmes contraintes conservées. Si la transformation échange des particules avec un réservoir, les potentiels chimiques doivent être inclus dans le potentiel thermodynamique approprié. Pour un système isolé ou gravitationnel hors équilibre, cette comparaison canonique peut devoir être remplacée.

À contraintes et température fixées, Delta F < 0 favorise C à l'équilibre. Une barrière peut cependant maintenir O longtemps. La fermeture peut aussi réduire l'entropie en imposant une contrainte géométrique : le signe de Delta S reste à calculer.

Si un modèle à seulement deux configurations communicantes atteint l'équilibre, P_C/P_O = exp[-Delta F/(k_BT)]. Ce rapport ne fournit pas le taux auquel cet équilibre est atteint. Il ne représente pas une probabilité de naissance d'univers.

## 6. Interactions et « champ favorable »

La proposition « la fermeture entraîne des interactions plus fortes » reste un postulat distinct. Trois quantités pourraient correspondre à cette intuition : un couplage plus grand, des rencontres plus fréquentes, ou une durée de contact plus longue. Elles ne sont pas équivalentes.

En théorie perturbative des cordes, le couplage g_s est lié à la valeur de fond du dilaton. La fermeture d'une corde ne fixe pas, à elle seule, cette valeur. [Tong, chapitre 7, passage sur le dilaton et le couplage](https://www.damtp.cam.ac.uk/user/tong/string/string7.pdf)

Les secteurs ouverts possèdent déjà des descriptions en champs. Il faudra donc identifier les champs ou excitations modifiés par la transition et calculer leur effet, plutôt que supposer que la fermeture fait apparaître tout champ pour la première fois. [Tong, chapitre 3, §3.1.2](https://davidtong.org/pdfs/teaching/string-theory/string3.pdf)

« Favorable à l'émergence » pourra être précisé progressivement : maintien d'une configuration, confinement d'une région, accès à une géométrie en expansion, puis production de matière et de rayonnement. Aucun de ces résultats n'est automatiquement déduit des précédents.

## 7. Place de l'analogie neuronale

L'analogie propose une structure de modèle : transport entre objets, accumulation locale, pertes, réponse à seuil et rétroaction sur les voisins. Elle ne suppose aucune cognition du brouillard.

Le support transporté reste à préciser : énergie, excitation d'un champ, charge conservée ou corrélations. Une variation des corrélations n'est pas automatiquement un flux d'énergie, et l'information ne doit pas être ajoutée comme une substance physique supplémentaire sans définition opérationnelle.

Un modèle en réseau pourrait servir d'étape exploratoire, à condition de définir les interactions locales, les délais de propagation et les bilans. La fermeture d'une boucle dans ce réseau ne serait pas automatiquement la fermeture topologique d'une corde fondamentale.

## 8. Programme de comparaison

| Calcul à construire | Branche interne | Branche géométrique |
|---|---|---|
| Définir l'accumulation | Nombre de constituants, énergie ou occupation des modes | Apports qui influencent les variables géométriques |
| Compter les états | Spectres ouverts et fermés en fonction de l'accumulation | Spectres en fonction des rayons ou d'autres paramètres géométriques |
| Comparer les configurations | Delta F, entropies et stabilité locale | Mêmes quantités avec la géométrie couplée |
| Étudier la fermeture | Dynamique des extrémités, barrière et temps de transition | Rencontre et jonction dans la géométrie choisie |
| Mesurer les interactions | Couplages et taux avant/après | Couplages, propagation et taux avant/après |
| Tester la persistance | Durée de vie et voies de disparition de la boucle | Durée de vie avec rétroaction géométrique |

Les deux branches peuvent se rejoindre : une géométrie différente peut changer les modes accessibles. Il faudra éviter de compter ce même effet une fois comme changement géométrique et une seconde fois comme information supplémentaire indépendante.

Un résultat défavorable à l'une des étapes est instructif : entropie favorisant l'état ouvert, extrémités incapables de se joindre, transition trop lente, boucle instable ou interactions inchangées. Le calcul ne devra pas imposer la réussite de la chaîne par définition.

**Prochaine question de recherche.** Pour des configurations ouvertes et fermées explicitement définies, comment l'accumulation modifie-t-elle leur différence d'énergie, leur différence d'entropie et la barrière de fermeture ?

## 9. État des acquis

- **Calculé :** dans le premier modèle isotherme, une contribution entropique issue de modes internes peut déplacer un seuil de stabilité dans les deux sens.
- **Proposé :** objets initialement ouverts, accumulation de constituants ou de possibilités, modification géométrique, fermeture et effet favorable à l'émergence.
- **À comparer :** possibilités internes supplémentaires et évolution des dimensions spatiales, en distinguant dimension existante accessible et dimension réellement nouvelle.
- **À construire :** spectres ouverts/fermés, interaction de jonction, dynamique de fermeture, évolution des couplages et devenir du germe.
- **Non établi :** saturation informationnelle déclenchant une fermeture, augmentation automatique des interactions, naissance d'un univers ou production des particules primordiales.

Ces notes prolongent le document de recherche sans transformer les analogies en résultats. Les calculs déjà effectués restent consultables dans [les résultats numériques](resultats.md) et [le programme](calcul_seuil.py).

## 10. Ce qui manque pour un modèle physique calculable

**Diagnostic.** Nous disposons d'une hypothèse sur les étapes, d'un exemple mathématique de stabilité et d'un programme de comparaison. Il manque une définition physique commune des objets et des lois qui relient ces étapes. Les paramètres n, q et N du calcul initial ne sont pas encore identifiés à des quantités mesurables d'un germe cosmologique.

| Élément à fixer | Définition nécessaire | Calcul rendu possible |
|---|---|---|
| Nature de l'objet | Corde fondamentale dans une théorie choisie, ou filament effectif ; tension, états internes, propriétés des extrémités | Spectre, énergie et formes admissibles |
| Accumulation | Constituants, énergie ou charges reçus ; mécanisme et source des apports ; pertes | Bilan physique et évolution de l'état |
| Dynamique | Hamiltonien ou action, ou lois effectives justifiées ; interactions et processus de jonction/réouverture autorisés | Stabilité, barrières, taux et temps de transition |
| Cadre statistique | États accessibles, probabilités, régime quantique ou classique, environnement et contraintes thermiques | Entropie et fluctuations sans les imposer arbitrairement |
| Géométrie | Espace ambiant, conditions aux limites, dimensions compactes éventuelles et leur évolution | Rencontre des objets, propagation et effets géométriques |
| Conditions initiales et échelles | Énergie, tailles, densités, occupations, couplages et temps ; valeurs ou plages argumentées | Prédictions conditionnelles avec unités et sensibilités |

Le choix « corde fondamentale » engage un formalisme particulier : une simple courbe élastique discrétisée ne suffit pas à reproduire ses contraintes et interactions quantiques. Des constructions de théorie des champs de cordes ouvertes et fermées existent, avec des interactions explicitement définies ; il faudrait choisir un cadre et un régime où notre question peut y être posée. [Zwiebach, *Oriented Open-Closed String Theory Revisited*](https://arxiv.org/abs/hep-th/9705241)

Le choix « filament effectif » permettrait d'étudier des mécanismes de fermeture avec une énergie et des interactions simplifiées. Ce serait un modèle exploratoire d'objets filiformes, dont l'interprétation en termes de cordes fondamentales resterait à établir.

### Le verrou dynamique : les taux de transition

Dans une approximation markovienne à deux états, la probabilité P_C de configuration fermée pourrait obéir à :

\[
\frac{dP_C}{dt}=k_{O\to C}(1-P_C)-k_{C\to O}P_C.
\]

Ces taux ont les unités d'un temps inverse. Le modèle suppose que O et C épuisent les configurations considérées ; une fragmentation ou une disparition imposerait des états supplémentaires.

Si un équilibre thermique avec bilan détaillé est justifié, le rapport des taux est lié à la différence d'énergie libre : k_{O→C}/k_{C→O} = exp[-Delta F/(k_BT)]. Ce rapport ne fixe pas les valeurs absolues : deux systèmes peuvent avoir la même préférence d'équilibre et des temps de fermeture très différents. Il faut donc dériver les taux des interactions et des fluctuations, ou les contraindre par des données. Ce schéma est proposé, pas encore exécuté.

### Deux niveaux de réalisation

1. **Modèle local de fermeture et de persistance.** Fixer les objets, leur énergie, les échanges, la géométrie et les interactions. Calculer les probabilités et délais de fermeture, les réouvertures et les durées de survie. Comparer la branche interne et la branche géométrique. Ce niveau peut être étudié avant de disposer d'une cosmologie complète.
2. **Modèle de germe cosmologique.** Ajouter une source d'énergie-impulsion et une dynamique gravitationnelle cohérentes, traiter la taille et l'interface de la région, puis calculer expansion ou contraction et production de particules. Faire évoluer une géométrie déjà définie ne démontre pas l'apparition de l'espace-temps lui-même. La création réelle de dimensions exige une construction théorique supplémentaire.

Une fois les lois fixées, des plages de paramètres permettent des prédictions conditionnelles. Pour prétendre décrire la nature, il faut ensuite une conséquence observable qui discrimine ce modèle d'autres explications et des données pour la tester. Les scénarios de cosmologie des gaz de cordes illustrent cette démarche de prédictions tout en conservant des problèmes ouverts ; ils ne valident pas notre chaîne de mécanismes. [Brandenberger, *String Gas Cosmology: Progress and Problems*](https://arxiv.org/abs/1105.3247)

**Priorité de travail.** Définir un modèle local ouvert/fermé qui calcule la fermeture et la réouverture, avec des bilans explicites. La décision structurante est la nature des objets : corde fondamentale dans un cadre théorique choisi, ou objet effectif servant à tester le mécanisme. Les signatures cosmologiques viendront après la construction de ce lien physique.

## 11. Construire sans observation directe

**Précision méthodologique.** Définir un objet hypothétique pour calculer et identifier l'objet réel sont deux démarches distinctes. L'absence d'observation directe du brouillard n'empêche pas de construire un modèle conditionnel. Elle empêche, à elle seule, de sélectionner sa description comme celle de la nature. Les contraintes issues des observations déjà disponibles restent pertinentes ; si aucune conséquence observable ne distingue les modèles, le calcul ne permet pas de les départager empiriquement.

Deux voies sont possibles : dériver les objets et interactions d'une théorie choisie, ou construire une description effective dont les hypothèses, symétries, échelles et coefficients sont explicites. Une description effective contrôlée demande notamment de justifier son domaine de validité et l'omission des termes non retenus ; toute formule simplifiée n'est pas automatiquement une théorie effective systématique. [Burgess, *Introduction to Effective Field Theory*](https://arxiv.org/abs/hep-th/0701053)

### Exemple analytique illustratif, non adopté comme description du germe

Considérons un filament classique de longueur fixée L, avec une raideur de flexion kappa > 0 et une énergie de liaison epsilon > 0 gagnée lorsque ses extrémités se joignent. Supposons une courbure spontanée nulle et une énergie de flexion (kappa/2) intégrale C(s)² ds. On compare un segment rectiligne ouvert à un cercle lisse fermé de même longueur. Les autres contributions, dont une éventuelle tension fois la longueur, sont supposées identiques ; les coûts de jonction supplémentaires sont inclus dans epsilon ou négligés explicitement.

Le cercle a une courbure C = 2 pi/L. La différence d'énergie entre ces deux configurations vaut donc :

\[
\Delta E=\frac{2\pi^2\kappa}{L}-\varepsilon.
\]

La fermeture circulaire est énergétiquement favorisée dans cette comparaison lorsque epsilon L/kappa > 2 pi². Les dimensions sont cohérentes : kappa a les unités d'une énergie fois une longueur et epsilon celles d'une énergie. Aucun chiffre mesuré n'est nécessaire pour obtenir cette relation conditionnelle. En revanche, sans connaître L, kappa et epsilon, elle ne donne pas un seuil physique pour notre hypothétique brouillard.

Ce résultat compare des énergies ; il ne fournit ni le taux de rencontre des extrémités, ni la barrière de jonction, ni le mécanisme de transfert de l'énergie libérée. À température finie, les fluctuations et la différence d'entropie doivent être ajoutées dans un cadre statistique approprié. Si une accumulation allonge le filament, une loi physique reliant cette accumulation à L serait encore nécessaire. L'exemple ne décrit pas une corde fondamentale et ne remplace aucun des modèles précédents.

### Ce que les calculs peuvent trancher à ce stade

- Détecter des contradictions, des bilans impossibles ou des instabilités incompatibles avec la persistance supposée.
- Déterminer des domaines de paramètres où une fermeture est possible, défavorable ou trop lente.
- Comparer plusieurs énergies et lois de jonction plausibles, sans ajuster chaque choix pour garantir la fermeture.
- Repérer les résultats robustes aux variations du modèle et ceux qui dépendent d'un couplage arbitraire.
- Produire une conséquence distinctive susceptible d'être confrontée à des observations indirectes.

Une contradiction exclut le modèle étudié sous ses hypothèses. Son absence ne prouve pas l'existence des objets postulés. La question de travail devient : quelles hypothèses minimales rendent le mécanisme possible, quelles hypothèses l'empêchent, et quelles conséquences permettraient de les départager ?

## 12. Seuil variable et observateur interne — 

**Proposition .** Examiner un seuil qui ne serait pas uniforme et intégrer notre situation d'observateur interne en mouvement dans la comparaison aux observations.

### Non-linéarité, géométrie et conditions locales

La non-linéarité d'une loi, la forme géométrique d'un objet et l'hétérogénéité spatiale sont des propriétés différentes. Notre premier potentiel contient déjà un terme quartique : il est non linéaire, tout en donnant un même seuil pour des paramètres identiques. Des dynamiques non linéaires peuvent amplifier des perturbations et produire des états hétérogènes ; elles n'imposent pas, à elles seules, des valeurs différentes du seuil local. Des dates de transition différentes peuvent aussi résulter de vitesses d'accumulation différentes, avec un seuil identique.

Le cercle de la section 11 était une configuration de comparaison, pas une hypothèse sur la forme générale du brouillard ou de l'Univers. Pour un filament non circulaire, l'énergie de flexion proposée reste une intégrale de la courbure locale ; le résultat numérique propre au cercle ne s'applique plus automatiquement.

Dans l'approximation de germes indépendants, chacun en équilibre thermique avec son environnement, le modèle initial donne :

\[
A_i=k_i-g_i n_i+N_i\alpha_i k_B T_i,\qquad
n_{c,i}=\frac{k_i+N_i\alpha_i k_B T_i}{g_i}.
\]

Ici i désigne un germe ; g_i et le coefficient quartique b_i sont positifs. N_i reste un nombre de modes internes, pas un nombre de dimensions spatiales. Cette écriture compare des germes aux paramètres différents ; elle ne dérive pas une loi de création de modes. À A_i = 0, le minimum quartique reste non linéairement stable ; il devient instable pour A_i < 0. La température intervient via la contribution entropique déjà dérivée. Une dépendance supplémentaire à la géométrie doit venir d'une énergie spécifiée, et ne peut pas être ajoutée comme un facteur sans justification.

Le seuil devient ainsi une frontière dans l'espace des états et des paramètres. Cette extension est analytique et conditionnelle, sans nouvelle simulation ni observation. Si les germes interagissent, leur stabilité collective exige les modes propres de la dynamique couplée : appliquer séparément chaque seuil ne suffit plus. La branche « dimensions spatiales variables » reste un chantier distinct.

### Construire la mesure prédite

Une observation dépend du système émetteur, de la propagation du signal, de la trajectoire de l'observateur et de l'instrument. Une valeur dépendante de l'observateur n'est pas nécessairement erronée. Le mouvement terrestre est déjà traité dans les mesures astronomiques : les corrections barycentriques incluent notamment rotation et orbite de la Terre, avec des termes relativistes et des incertitudes de position et de datation. [Wright et Eastman, 2014](https://arxiv.org/abs/1409.4774)

La démarche pour notre recherche serait de calculer un signal physique, de le propager jusqu'à un observateur défini, puis de simuler sa mesure. Les corrections et leurs incertitudes doivent être explicites. Être un observateur interne ne nécessite pas un observateur extérieur pour tester ces prédictions. Un changement de référentiel ne constitue pas en lui-même une modification physique de la stabilité du germe.

**Prochaine comparaison calculable.** Séparer trois causes possibles de transitions observées à des moments différents : seuils locaux différents, rythmes d'accumulation différents et effets de propagation ou d'observation. Commencer par les deux premières dans le modèle local ; la troisième demande d'abord une signature physique susceptible d'atteindre nos instruments. Aucun signal observable du germe hypothétique n'est actuellement dérivé.

## 13. Première comparaison numérique de plusieurs germes — 

La comparaison locale est maintenant exécutée dans [comparer_germes.py](comparer_germes.py). Elle croise trois apports constants J = 0,1 ; 0,2 ; 0,3 avec trois valeurs du couplage aux modes internes alpha = −0,4 ; 0 ; +0,4. Les neuf germes sont indépendants. Les autres paramètres du modèle initial sont identiques : k = g = b = mobilité = 1, N = 10, k_B T = 0,1, perte lambda = 0,2, n initial = 0 et petite perturbation q initial = 0,05. Toutes les unités sont réduites et sans calibration physique.

Le programme calcule l'accumulation par sa solution analytique et la dérive déterministe de q par RK4 jusqu'à t = 120 avec un pas de 0,01. Il enregistre le temps critique A = 0 et, séparément, le premier passage montant de |q| à 0,1 après ce temps. Ce repère d'amplitude est arbitraire ; q n'est pas encore une variable de fermeture topologique.

À apport identique J = 0,3, les temps critiques sont respectivement 2,554 ; 5,493 ; 13,540. Le repère d'amplitude n'est atteint qu'à 7,108 ; 15,774 ; 82,468. La longue attente du troisième cas résulte ici de l'amortissement avant le seuil et de la croissance lente après celui-ci. Elle dépend de la perturbation initiale et du repère choisi ; elle n'est pas une durée cosmologique prédite.

Avec alpha = 0 et un seuil n = 1 identique, J = 0,1 impose un plafond d'accumulation inférieur au seuil ; J = 0,2 l'approche asymptotiquement sans le franchir ; J = 0,3 le dépasse en temps fini. Ainsi, les différences d'apport et les différences de seuil peuvent être distinguées dans ce protocole.

Six contrôles passent, dont la comparaison des neuf trajectoires avec un pas divisé par deux (écart maximal de q inférieur à 5 × 10⁻¹¹), la convergence des temps du repère (écart inférieur à 5 × 10⁻⁶), et les cas limites de l'accumulation. Le contrôle q initial = 0 rappelle qu'une dérive déterministe exactement symétrique reste nulle même lorsqu'elle devient instable aux perturbations. Une simulation des fluctuations thermiques demanderait d'ajouter un bruit compatible avec la dissipation.

Les paramètres, résultats et limites sont détaillés dans [le compte rendu de comparaison](comparaison_germes.md). Les trajectoires sont exportées pour permettre leur réanalyse. La sélection de neuf cas ne constitue pas une distribution physique : compter ceux qui franchissent le seuil ne donne pas une probabilité d'apparition d'univers. Cette étape étudie uniquement accumulation, stabilité et contribution entropique dans la branche des modes internes ; elle ne résout pas le mécanisme de fermeture ni la branche des dimensions spatiales variables.

## 14. Deux domaines et influence médiée — 

Proposition deux domaines A et B déjà présents dans un espace-temps parent, régis par les mêmes lois, et un champ médiateur qui transmet causalement une perturbation de A vers B. Le double puits incliné V(phi;J) = lambda(phi² − v²)²/4 − J phi est étudié comme une illustration locale indépendante, sans identification à la relativité intriquée.

La [note dédiée aux domaines A/B](domaines_AB.md) vérifie le seuil |J| = 2 lambda v³/(3 racine de 3), calcule la diminution de la barrière du puits négatif lorsque J positif augmente, et définit le protocole de comparaison. Elle précise qu'un fond non nul ou une autre source d'asymétrie est nécessaire pour que B soit déjà métastable dans la situation de référence. A doit rester présent dans les deux situations ; c'est sa perturbation supplémentaire et son influence reçue que l'on compare.

Ce calcul concerne la disparition d'un minimum métastable, différente de la bifurcation symétrique simulée précédemment. Il ne calcule encore ni taux de transition, ni propagation du médiateur, ni rétroaction gravitationnelle. L'entropie et les mécanismes thermiques ou quantiques doivent être définis explicitement avant de convertir la barrière en probabilité de passage.

## 15. Nuage de particules, plasma et bulle — 

Proposition maintenant une interprétation matérielle du germe : un nuage de fermions et de bosons pourrait s'agréger, former un plasma, atteindre une densité de rupture et générer une bulle stable. Cette évolution est conservée dans [le journal des hypothèses](../journal_hypotheses.md). Elle ne remplace pas rétroactivement le modèle à modes harmoniques par une théorie du plasma.

Une [nouvelle étude calculable](../plasma-bulle/nuage_plasma_bulle.md) distingue la concentration du milieu q, la phase locale et le rayon R d'une bulle. La première notion de stabilité examinée est celle d'un rayon fini stable sous perturbations radiales, sans gravitation. La persistance d'un domaine en expansion reste à comparer.

Le calcul confirme que surface et poussée constante ne fournissent qu'un rayon critique instable. Un terme supplémentaire de rétroaction finie, K V_b²/(2 V_r), peut donner un minimum de bulle. Son origine proposée est l'épuisement d'une quantité conservée dans un milieu de susceptibilité finie ; les phases et cette quantité ne sont pas encore identifiées au plasma envisagé.

La forme réduite f(r) = r² − (8/9)δr³ + r⁶/9 possède une paire de points stationnaires pour δ > 1. Le minimum de bulle devient favorable face à r = 0 pour δ > 3^(3/4)/2 ≈ 1,139754. La barrière de formation reste positive à poussée finie. Les [résultats numériques](../plasma-bulle/resultats_bulle.md) incluent les bassins d'attraction, l'accessibilité par accumulation et quatorze contrôles réussis.

Ce résultat donne une condition de persistance d'une bulle supposée formée. La formation du plasma, l'origine de son interface, la nucléation et l'évolution cosmologique ne sont pas calculées. Le q utilisé pour l'accumulation dans cette extension décrit une densité effective normalisée, pas la coordonnée symétrique du premier modèle. La nature de la phase intérieure et extérieure demeure une question prioritaire.
