# Accumulation, stabilité et entropie : premier modèle calculable

Analyse du 14 septembre 2026. Modèle hypothétique classique, isotherme, sans gravitation.

Complément de recherche du même jour : [dimensions, information et fermeture](notes_dimensions_fermeture.md). Cette note conserve les nouvelles hypothèses de l'auteur et organise la comparaison des degrés de liberté internes et des dimensions spatiales. Les résultats numériques ci-dessous concernent toujours le modèle initial à N fixe.

**Résultat principal.** Une accumulation peut rendre instable une configuration initialement stable si son couplage aux degrés de liberté du système affaiblit suffisamment le rappel vers cette configuration. L'entropie peut avancer ou retarder ce changement, selon les états internes qu'elle favorise. Aucune saturation d'une capacité informationnelle n'est nécessaire dans cet exemple.

Ce résultat démontre une possibilité au sein d'une classe de lois choisies. Il n'identifie pas les lois d'un germe cosmologique réel. Le modèle ne contient ni cordes fondamentales, ni horizons, ni création d'espace-temps, ni production de quarks et de gluons.

## 1. Objectif et niveau de description

La question étudiée est : quelles lois permettent à un germe de conserver un état local stable, puis de perdre cette stabilité sous l'effet d'une accumulation, et comment l'entropie intervient-elle ?

Le mot « germe » désigne ici uniquement une configuration interne représentée par une variable q. Une région spatiale possède aussi une taille, une interface et des contraintes géométriques : ces aspects ne sont pas calculés. Cette limitation prolonge la distinction entre stabilité locale et persistance d'un domaine dans la note de travail [Dynamique et coexistence des domaines cosmologiques](../../Approfondissement_dynamique_des_domaines.pdf).

La méthode consiste à définir une énergie microscopique simple, à intégrer des coordonnées internes, puis à déterminer les minima de l'énergie libre résultante. La construction d'une énergie libre à variable macroscopique fixée est une méthode standard de physique statistique ; son application au système hypothétique présent est notre choix de modélisation. [Tong, §1.1.1 et §1.3](https://www.damtp.cam.ac.uk/user/tong/sft/sfthtml/S1.html)

## 2. Hypothèses physiques explicites

- q est un paramètre de configuration sans dimension. q = 0 désigne le régime initial, et non une absence de matière.
- n est un paramètre de charge accumulée, sans dimension. Ce n'est pas encore une énergie totale ni un nombre de particules physiques défini.
- Le germe possède N coordonnées internes classiques y_i. N reste fixe lorsque n varie.
- Un environnement maintient une température T > 0. Les y_i s'équilibrent rapidement par rapport à q et au changement de n.
- La relaxation de q est dissipative. L'environnement reçoit de la chaleur et le contrôle de n peut effectuer du travail.
- L'énergie ne dépend pas explicitement de T. Les coordonnées possèdent une mesure de référence fixe ; les différences d'entropie calculées ne dépendent pas de cette référence.

Un bain thermique et cette séparation des temps sont des hypothèses fortes. Pour un germe isolé ou fortement autogravitant, il faudrait reconsidérer l'ensemble statistique et les contraintes : un problème à énergie fixée n'est pas nécessairement équivalent à un problème à température fixée. [Chavanis, 2019/2020](https://arxiv.org/abs/1908.10806)

## 3. Une énergie microscopique et son entropie calculée

Choisissons :

\[
U(q,\mathbf y;n)=\frac{k-gn}{2}q^2+\frac b4q^4
+\frac{c_0e^{\alpha q^2}}2\sum_{i=1}^{N}y_i^2.
\]

On impose b > 0, c_0 > 0, g > 0 et une mobilité M > 0. Si les y_i sont aussi sans dimension, k, g, b et c_0 ont les unités d'une énergie ; alpha est sans dimension. Le quartique garantit que l'intégrale canonique reste finie pour chaque n fini. Les raideurs internes restent positives, quel que soit le signe d'alpha.

Deux choix sont à l'origine de l'effet recherché : le terme -gn q²/2 affaiblit le rappel lorsque n augmente ; le facteur exp(alpha q²) fait dépendre les états accessibles aux modes internes de la configuration q. Aucun de ces couplages n'est déduit d'une théorie cosmologique.

À q fixé, l'intégrale gaussienne des coordonnées internes donne :

\[
Z_y(q,T)=\left(\frac{2\pi k_BT}{c_0\ell^2}\right)^{N/2}
e^{-N\alpha q^2/2},
\]

où ell définit la mesure de référence dy_i/ell. L'énergie libre conditionnelle devient exactement :

\[
F(q;n,T)=F_0(T)+\frac{A(n,T)}2q^2+\frac b4q^4,
\qquad A(n,T)=k-gn+N\alpha k_BT.
\]

La différence d'entropie des modes internes vaut :

\[
\Delta S_y(q)=S_y(q,T)-S_y(0,T)=-\frac N2\alpha k_Bq^2.
\]

Elle est obtenue par -∂[F(q)-F(0)]/∂T, à q et n fixés. Ce n'est pas l'entropie totale du germe incluant la distribution de q, ni une quantité de bits introduite arbitrairement. L'énergie conditionnelle moyenne des modes y est Nk_BT/2, indépendante de q : leur contribution au changement de courbure est donc ici entropique.

| Signe d'alpha | Effet d'un déplacement depuis q = 0 | Contribution à la stabilité initiale |
|---|---|---|
| alpha > 0 | Modes internes plus raides, moins d'entropie conditionnelle | Rappel renforcé |
| alpha = 0 | Entropie interne indépendante de q | Aucun déplacement du seuil par ces modes |
| alpha < 0 | Modes internes moins raides, plus d'entropie conditionnelle | Rappel affaibli |

Le cas alpha = 0 possède toujours une entropie et des fluctuations thermiques ; seule la contribution des modes internes à la dépendance en q disparaît.

## 4. Stabilité et seuil

La dérive dissipative choisie est :

\[
\dot q=-M\partial_qF=-M(Aq+bq^3).
\]

| A | Régime de q = 0 | Autres minima |
|---|---|---|
| A > 0 | Stable, rappel linéaire de taux MA | Aucun |
| A = 0 | Stable non linéairement, rappel cubique | Aucun minimum distinct |
| A < 0 | Instable | q = ±sqrt(-A/b), de courbure -2A > 0 |

Pour g > 0, le changement de signe se produit à :

\[
\boxed{n_c(T)=\frac{k+N\alpha k_BT}{g}}.
\]

Un régime initial avec un rappel linéaire strictement positif à n = 0 exige k + N alpha k_BT > 0. À égalité, le minimum quartique reste stable non linéairement. Une valeur calculée n_c < 0 signifie que le régime supposé initial est déjà instable pour n ≥ 0 : elle ne décrit pas un germe qui attend un seuil positif.

Au seuil exact, F-F_0 = bq⁴/4 possède encore un minimum strict. La nullité de la courbure ne suffit donc pas à conclure à une instabilité. Dans notre dérive, la relaxation critique a une solution algébrique :

\[
q(t)=\frac{q(0)}{\sqrt{1+2Mbq(0)^2t}}.
\]

Pour A > 0 et de petites perturbations, le temps de relaxation est approximativement 1/(MA). Son augmentation à l'approche du seuil est un ralentissement du rappel ; ce n'est pas une augmentation automatique de la résistance aux fluctuations.

La sensibilité thermique est précise : dn_c/dT = N alpha k_B/g. Pour alpha > 0, une hausse de T repousse ce seuil ; pour alpha < 0, elle le rapproche.

**Contre-exemples.** Si g = 0, l'accumulation ne déplace pas la stabilité dans ce modèle. Si le couplage est +gn q²/2 avec g > 0, l'accumulation renforce le rappel. L'accumulation seule n'impose donc aucune perte de stabilité ; le signe et la forme de ses interactions sont déterminants.

## 5. Le seuil est-il accessible ?

Ajoutons la loi phénoménologique ouverte :

\[
\dot n=J-\lambda n,\qquad
n(t)=\frac J\lambda+\left(n_0-\frac J\lambda\right)e^{-\lambda t},
\]

avec J ≥ 0, lambda > 0 et n_0 < n_c. Ce choix représente des apports et des pertes ; il ne ferme pas un bilan cosmologique de matière-énergie.

- J/lambda < n_c : le seuil est inaccessible.
- J/lambda = n_c : le seuil est approché asymptotiquement, sans franchissement à temps fini.
- J/lambda > n_c : le temps d'atteinte est fini :

\[
t_c=\frac1\lambda\ln\left(\frac{J/\lambda-n_0}{J/\lambda-n_c}\right).
\]

Exemple en unités réduites : k = g = b = c_0 = M = 1, N = 10, k_BT = 0,1, n_0 = 0, J = 0,3, lambda = 0,2. L'accumulation plafonne à 1,5.

| alpha | Contribution entropique | n_c | Temps d'atteinte t_c |
|---:|---|---:|---:|
| -0,4 | Favorise le déplacement | 0,6 | 2,554128 |
| 0 | Indépendante de q | 1,0 | 5,493061 |
| +0,4 | Favorise q = 0 | 1,4 | 13,540251 |

Les unités d'accumulation et de temps sont arbitraires. Ces valeurs caractérisent cet exemple, sans calibration astrophysique. Si l'apport diminue à J = 0,2, l'accumulation plafonne à 1 : le cas alpha = -0,4 franchit encore son seuil ; le cas alpha = 0 l'approche asymptotiquement ; le cas alpha = +0,4 ne l'atteint pas.

Les trajectoires déterministes exportées partent d'une petite perturbation q_0 = 0,05. La valeur q = 0 exacte reste solution même au-delà du seuil ; il faut une perturbation pour révéler son instabilité. La vitesse d'accumulation et la taille de cette perturbation influencent le délai de départ. t_c n'est donc pas un instant de transition achevée.

## 6. Fluctuations et taille finie

À paramètres fixés, la distribution canonique est :

\[
p(q)=\frac{e^{-F(q)/(k_BT)}}{\int dq\,e^{-F(q)/(k_BT)}}.
\]

Elle possède un mode pour A ≥ 0 et deux modes pour A < 0. Sa moyenne signée reste nulle par symétrie. Pour détecter le changement, on examine les modes, la distribution complète, |q| et la moyenne de q².

Le script calcule cette distribution par quadrature, séparément de la dérive déterministe. À n = 1,2, la moyenne q² vaut environ 0,501932, 0,279165 et 0,168072 pour alpha = -0,4, 0 et +0,4 respectivement. Ces valeurs sont des fluctuations d'équilibre du modèle, pas des probabilités de création d'univers.

Au seuil, la variance est finie et possède un résultat exact :

\[
\langle q^2\rangle=\sqrt{\frac{4k_BT}{b}}
\frac{\Gamma(3/4)}{\Gamma(1/4)}.
\]

Dans ce système fini à T > 0, les intégrales thermodynamiques restent régulières. La bifurcation de la dérive et le changement du nombre de modes ne constituent pas une singularité thermodynamique macroscopique démontrée. Le potentiel décrit une bifurcation continue ; une transition discontinue, une barrière de nucléation ou une explosion demanderaient un autre mécanisme.

Une extension dynamique thermique cohérente, sous les hypothèses d'un bain markovien et d'une mobilité constante, serait :

\[
dq=-M\partial_qF\,dt+\sqrt{2Mk_BT}\,dW_t.
\]

Le bruit de cette équation n'est pas exécuté dans le script livré. Les trajectoires sans bruit ne sont pas présentées comme des trajectoires thermiques ni comme une moyenne exacte de l'équation stochastique non linéaire. Une probabilité de sortie nécessiterait une région de persistance, une échéance et un modèle de fluctuations explicitement choisis.

## 7. Bilan énergétique et limites de l'accumulation

À n et T fixés, la dérive vérifie dF/dt = -M(∂F/∂q)² ≤ 0. Cette diminution d'énergie libre est compatible avec des échanges de chaleur avec l'environnement. L'entropie conditionnelle des seuls modes internes n'a pas à croître durant chaque évolution.

Lorsque n varie, pour l'énergie libre relative employée dans le calcul :

\[
\frac{dF}{dt}=-M(\partial_qF)^2-\frac g2q^2\dot n.
\]

La deuxième contribution est celle du contrôle extérieur. Une énergie de référence E_0(n), indépendante de q, pourrait être ajoutée : elle modifierait le travail de chargement et le bilan total, sans changer le seuil de configuration. Nous n'avons pas déterminé E_0(n), les potentiels chimiques ou les flux de chaleur du mécanisme d'alimentation. Le modèle doit donc être interprété comme un problème de stabilité sous contrôle, et non comme un système cosmologique autonome fermé.

Si T change aussi pendant l'accumulation, il faut suivre A(t) = k - gn(t) + N alpha k_BT(t). Une accumulation qui chauffe suffisamment pourrait, pour alpha > 0, compenser l'affaiblissement mécanique. Le seuil constant calculé ici est conditionnel à l'hypothèse isotherme.

## 8. Information et bornes d'entropie

L'information intervient par les configurations accessibles, via une intégration microscopique. Aucune capacité maximale d'information n'est imposée ni atteinte dans ce modèle.

Une borne holographique ne peut pas être ajoutée simplement sous la forme « S atteint sa limite, donc q change ou l'espace s'étend ». Les bornes covariantes font intervenir des surfaces et des hypersurfaces lumineuses précisément définies ; leur application demande une géométrie et des hypothèses physiques absentes ici. [Bousso, Flanagan et Marolf](https://arxiv.org/abs/hep-th/0305149)

Il reste possible qu'un futur modèle relie géométrie, entropie et stabilité. Le présent résultat identifie un mécanisme plus limité : une contribution entropique modifie la courbure d'une énergie libre.

## 9. Vérifications et reproduction

Exécuter depuis n'importe quel dossier, avec Python 3 :

```sh
python3 /output/seuil-entropie/calcul_seuil.py
```

Le programme n'utilise que la bibliothèque standard. Il génère [resultats.md](resultats.md) et [resultats.json](resultats.json), contenant les paramètres, les seuils, les temps d'atteinte, les moments thermiques, les contrôles et trois trajectoires déterministes. Aucun tirage aléatoire n'intervient.

Les contrôles effectués vérifient :

1. L'intégration numérique des modes internes contre l'énergie libre analytique.
2. L'entropie contre une dérivée thermique calculée à partir de cette intégration.
3. Le signe de la courbure de part et d'autre du seuil.
4. Les trajectoires RK4 contre des solutions exactes, y compris au seuil quartique.
5. La convergence lorsque le pas de temps est divisé par deux.
6. La dissipation de l'énergie libre à paramètres fixes.
7. Les fluctuations critiques contre la formule exacte en fonctions Gamma.
8. La convergence de la quadrature en élargissant le domaine et en affinant le maillage.
9. La nullité de la moyenne signée imposée par la symétrie.
10. Le temps d'atteinte contre la solution exacte de l'accumulation et les cas d'inaccessibilité.

Tous sont passés. Les chiffres détaillés et les tolérances figurent dans resultats.md. Ces vérifications portent sur les calculs et la cohérence du modèle, sans valider ses hypothèses cosmologiques.

## 10. Résultat acquis et questions physiques restantes

Dans cette classe de modèles, les lois suffisantes sont : une énergie bornée avec un état initial stable ; un couplage de l'accumulation qui diminue sa courbure ; des échanges permettant au paramètre accumulé d'atteindre le seuil ; une dynamique sensible aux perturbations. L'entropie intervient par la dépendance de la multiplicité des états internes à la configuration.

La prochaine discrimination physique porte sur le signe et la taille des couplages : que représente q, qu'est-ce qui s'accumule, pourquoi ce contenu modifie-t-il les modes internes, et quelle contrainte thermique ou énergétique s'applique ? Ces données doivent être dérivées d'un modèle microscopique choisi ou contraintes expérimentalement. L'entropie seule n'en fixe pas la réponse.

Une extrapolation cosmologique demanderait encore les champs et interactions appropriés, les gradients, la taille et l'interface du germe, une géométrie gravitationnelle cohérente et le devenir de la région après transition. Aucune équation de cette note n'établit la naissance d'un univers ou la production de particules du modèle standard.

## 11. Extension proposée : objets ouverts et fermeture

L'auteur propose de préciser la nature de l'accumulation par des objets de type corde, leurs excitations ou leurs possibilités internes, et souhaite comparer cette piste à une modification des dimensions spatiales. Sous certaines conditions, la modification géométrique pourrait favoriser la fermeture d'un objet initialement ouvert ; l'effet de cette fermeture sur les interactions et sur la persistance d'un germe serait ensuite à déterminer.

Le modèle présent ne simule pas cette fermeture. Une variable continue q et ses minima ne représentent pas automatiquement deux topologies. L'extension devra distinguer la préférence thermodynamique pour un état fermé, la perte de stabilité locale de l'état ouvert et la transition effectivement réalisée. Elle devra également séparer dimensions spatiales, dimension de l'espace des configurations et nombre de modes internes.

Les [notes complémentaires](notes_dimensions_fermeture.md) consignent ces postulats, les liens avec les descriptions ouvertes/fermées et la compactification, la place de l'analogie neuronale et le programme de calcul. Aucun nouveau seuil numérique de fermeture n'est annoncé à ce stade.

## Sources et attribution

- David Tong, *Statistical Field Theory*, chapitre 1, notamment §1.1.1 et §1.3 : [énergie libre effective](https://www.damtp.cam.ac.uk/user/tong/sft/sfthtml/S1.html). Source méthodologique ; ne propose pas notre germe cosmologique.
- Pierre-Henri Chavanis, *Statistical mechanics of self-gravitating systems in general relativity: I. The quantum Fermi gas*, 2019/2020 : [prépublication](https://arxiv.org/abs/1908.10806). Contraintes statistiques et gravitation ; aucun seuil numérique transféré à notre modèle.
- Raphael Bousso, Éanna É. Flanagan et Donald Marolf, *Simple sufficient conditions for the generalized covariant entropy bound*, 2003 : [prépublication](https://arxiv.org/abs/hep-th/0305149). Conditions géométriques des bornes d'entropie.

Le couplage microscopique, les paramètres numériques et les calculs de cette note sont une construction exploratoire pour la présente analyse. Leur choix n'est pas attribué à ces publications et aucune nouveauté dans la littérature n'est revendiquée.
