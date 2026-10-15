# Du nuage à une bulle stable

Note de recherche . Prolongement de l'hypothèse  : un nuage s'agrège, forme un plasma, atteint un point de rupture et génère une bulle stable. Cette note conserve la proposition, calcule un exemple de stabilité radiale et identifie les étapes encore ouvertes.

**Résultat principal.** Une tension de surface et une poussée constante produisent un rayon critique instable. Une rétroaction qui réduit cette poussée avec le volume transformé peut créer un minimum à rayon fini. Ce résultat requiert une nouvelle hypothèse de réservoir fini ; il ne découle pas du seul mot « plasma ». La bulle peut devenir favorable tout en restant séparée de l'état sans bulle par une barrière.

## 1 Hypothèse physique et variables

Le scénario proposé suit la chaîne nuage, agrégation, plasma, rupture, bulle et persistance. Il donne une direction de recherche sur le contenu matériel du germe. Agréger de la matière ne suffit toutefois pas à spécifier son état : il faut suivre au moins sa température, ses densités conservées, ses échanges et ses interactions. Le plasma de quarks, d'antiquarks et de gluons est une référence physique concrète, mais l'ensemble des étapes de notre scénario n'en découle pas. [Présentation du CERN](https://home.cern/science/physics/heavy-ions-and-quark-gluon-plasma/).

Un scalaire unique ne décrit pas le nuage entier. Nous distinguons pour le calcul :

| Variable | Sens proposé | État du calcul |
|---|---|---|
| q | Concentration ou compression du milieu avant transformation | Loi d'accumulation phénoménologique |
| T et densités des espèces | Régime thermique et composition | Non simulés |
| φ | Phase locale et profil de l'interface | Non construits microscopiquement |
| R | Rayon d'une bulle sphérique supposée définie | Énergie et relaxation calculées |

Cette réinterprétation de q ouvre un nouveau modèle. Elle ne transforme pas rétroactivement le q symétrique du potentiel quartique précédent en densité de plasma. Un contraste de densité d'énergie q_ε = (ε−ε_ref)/ε_ref serait possible après choix d'une équation d'état. Pour l'exemple isotherme ci-dessous, on préfère un contraste q = (c−c_ref)/c_ref d'une densité effective conservée c, avec c_ref > 0, dans le milieu avant nucléation. Aucune identification numérique à une densité de quarks n'est effectuée.

La distinction est physique : à température fixée, énergie et nombre total de particules ne sont pas des contrôles indépendants arbitraires d'un plasma à l'équilibre. Le nombre de photons, de gluons ou de paires quark-antiquark n'est pas généralement conservé. Une quantité comme une charge nette peut l'être dans un régime déterminé ; son choix doit être justifié. Le calcul à c conservé reste une réalisation hypothétique de l'idée, particulièrement à réexaminer si les contrastes des charges nettes sont nuls.

## 2 Hypothèses du calcul de bulle

Nous supposons deux régimes séparés par une interface de tension σ > 0, une bulle sphérique de rayon R et un environnement homogène de volume de référence V_r. Le système est traité à température fixée, sans gravitation. L'interface est mince devant les rayons physiques pertinents. « Stable » désigne ici un minimum contre les variations radiales, dans cette famille de configurations.

La phase intérieure n'est pas encore identifiée. Le modèle peut tester une région transformée dans un milieu, sans décider si cette région est plus ou moins dense que son extérieur. Il ne s'agit pas nécessairement d'une cavité vide.

Deux limitations sont essentielles. La description de paroi mince échoue aux rayons proches de l'épaisseur de l'interface. Le point R = 0 est utilisé comme référence formelle « absence de bulle », sans résoudre sa structure microscopique. En outre, une stabilité radiale ne prouve pas une durée de vie thermique, une stabilité à la fragmentation, un confinement des particules ou une stabilité gravitationnelle.

Le plasma QCD à potentiel chimique baryonique nul et aux masses physiques des quarks présente un crossover plutôt qu'une transition de premier ordre dans les calculs sur réseau. Une interface de coexistence et une rupture ne peuvent donc pas lui être attribuées automatiquement. Notre modèle suppose une transition avec interface qui reste à identifier. [Bhattacharya et collaborateurs, 2014](https://arxiv.org/abs/1402.5175).

## 3 Pourquoi le premier rayon critique n'est pas stable

Pour une poussée Δp₀ > 0 maintenue constante, l'énergie libre de capillarité relative est

\[
\Phi_0(R)=4\pi\sigma R^2-\Delta p_0 V_b,
\qquad V_b=\frac{4\pi}{3}R^3.
\]

La poussée désigne ici une différence de potentiel thermodynamique par unité de volume, exprimée en unités de pression. Dans une description compatible des deux phases, elle peut s'interpréter comme une différence de pression motrice. Ce n'est pas la densité d'énergie elle-même.

Le rayon stationnaire non nul satisfait

\[
R_c=\frac{2\sigma}{\Delta p_0},\qquad
\Phi_0''(R_c)=-8\pi\sigma<0.
\]

Il s'agit d'un maximum. Dans une relaxation dissipative de ce potentiel, un germe sous-critique se contracte ; un germe au-dessus du rayon critique croît. Aucune taille finie ne l'attire. L'obtention d'une bulle durable à rayon fini demande une contribution supplémentaire au bilan des forces.

## 4 Une rétroaction issue d'une ressource finie

Nous proposons l'énergie libre effective

\[
\boxed{\Phi(R)=4\pi\sigma R^2-\Delta p_0V_b
+\frac{K}{2V_r}V_b^2},\qquad K>0.
\tag{1}
\]

Le coefficient K a les unités d'une pression, σ celles d'une énergie par surface et V_r celles d'un volume. Tous les termes ont les unités d'une énergie. Le terme positif signifie que la conversion d'une partie du milieu rend la conversion suivante moins favorable.

**Motivation thermodynamique du signe.** Supposons une quantité conservée dont les deux phases diffèrent d'une densité Δc. La formation d'un volume V_b transfère environ Δc V_b de cette quantité depuis un environnement de volume V_r. Sa densité change donc de δc_r ≈ −Δc V_b/V_r. Pour une densité d'énergie libre de réservoir f_r(c), une expansion autour d'un état localement stable donne

\[
V_r\left[f_r(c+\delta c_r)-f_r(c)\right]
=-\mu_r\Delta c V_b+
\frac{f_r''(c)(\Delta c)^2}{2V_r}V_b^2+\cdots.
\]

Le terme linéaire se combine avec l'avantage volumique des phases dans Δp₀ ; le terme quadratique donne K = f_r''(c)(Δc)² > 0 lorsque f_r'' > 0 et Δc ≠ 0. Cette construction exige un milieu de réponse finie, une séparation de phases et des contrastes définis. À plusieurs charges, elle se généraliserait à une matrice de susceptibilités. Elle ne démontre pas que notre plasma dispose effectivement de la ressource nécessaire.

L'approximation garde V_r et les contrastes constants. Un milieu dont le volume disponible change, de grands contrastes relatifs, une forte conversion, ou une température variable nécessiteraient une énergie complète. Le faible volume converti ne suffit pas à garantir à lui seul que l'expansion en densité du réservoir est contrôlée : il faut aussi connaître Δc et ses susceptibilités.

La dépendance de l'équilibre et de la nucléation au réservoir et à l'ensemble statistique est étudiée dans les systèmes de gouttes à volume fini. Ces travaux motivent la question ; l'équation (1) est notre choix phénoménologique pour la tester et n'est pas un résultat de QCD. [Zierenberg, Schierz et Janke, 2017](https://arxiv.org/abs/1607.08355).

## 5 Rayons stationnaires et premier seuil

La dérivée de (1) s'écrit

\[
\Phi'(R)=4\pi R\left[2\sigma-\Delta p_0R
+\frac{4\pi K}{3V_r}R^4\right].
\]

L'équilibre de rayon non nul est donc

\[
\Delta p_0-\frac{K V_b}{V_r}=\frac{2\sigma}{R}.
\tag{2}
\]

La poussée effective diminue avec le volume et équilibre la tension de surface. La fonction Δp₀(R) = 2σ/R + 4πKR³/(3V_r) possède un minimum aux valeurs

\[
R_{\rm sn}=\left(\frac{\sigma V_r}{2\pi K}\right)^{1/4},
\qquad
\Delta p_{\rm sn}=\frac{8\sigma}{3R_{\rm sn}}.
\tag{3}
\]

Au-dessus de cette poussée apparaissent deux rayons : un maximum de barrière R_b < R_sn et un minimum R_s > R_sn. La courbure aux points stationnaires vaut

\[
\Phi''(R)=8\pi\sigma\left[\left(\frac{R}{R_{\rm sn}}\right)^4-1\right].
\tag{4}
\]

Au seuil exact, le point dégénéré n'est pas un minimum. Ce seuil est l'apparition d'une paire de points stationnaires à rayon positif, pas la disparition de la stabilité de R = 0.

## 6 Deuxième seuil et barrière persistante

Posons r = R/R_sn, δ = Δp₀/Δp_sn et f = Φ/(4πσR_sn²). Le potentiel devient

\[
f(r;\delta)=r^2-\frac89\delta r^3+\frac19r^6.
\tag{5}
\]

Les rayons positifs satisfont

\[
r^4-4\delta r+3=0.
\tag{6}
\]

Les branches existent pour δ > 1. À un point stationnaire,

\[
f_{\rm stat}=\frac{r^2}{9}(3-r^4).
\]

Le minimum de bulle devient égal en énergie à r = 0 lorsque

\[
r_{\rm eq}=3^{1/4}\simeq1{,}316074,
\qquad
\delta_{\rm eq}=\frac{3^{3/4}}2\simeq1{,}139754.
\tag{7}
\]

| Domaine de δ | Résultat dans la famille sphérique |
|---|---|
| δ < 1 | Aucun équilibre de rayon positif |
| δ = 1 | Point stationnaire dégénéré, sans minimum |
| 1 < δ < 1,139754 | Bulle localement stable, mais plus coûteuse que l'absence de bulle |
| δ = 1,139754 | Égalité des deux minima de la famille |
| δ > 1,139754 | Bulle localement stable et plus favorable que l'absence de bulle |

La barrière depuis l'état sans bulle reste positive à toute poussée finie : près de r = 0, f ≈ r². Le rayon barrière vérifie 0 < r_b < 1 et f(r_b) > 0. Une densité qui rend la bulle favorable ne la fait donc pas apparaître automatiquement dans cette dynamique déterministe. Il faut une perturbation suffisante ou un mécanisme de passage. Une disparition de barrière à densité finie exigerait une autre physique, par exemple un modèle microscopique de spinodale ou une évolution de l'interface.

La préférence énergétique ci-dessus compare l'absence de bulle aux bulles sphériques dans (1). Elle n'explore pas toutes les phases, plusieurs bulles, une fragmentation ou une autre géométrie.

## 7 Résultats numériques et dynamique de rayon

Nous choisissons σ = 1, K = 100 et V_r = 200π en unités arbitraires, ce qui donne R_sn = 1 et Δp_sn = 8/3. Ces nombres ne sont ni des densités ni des tensions mesurées de plasma.

À δ = 1,2, le calcul donne

\[
r_b=0{,}665984,\quad r_s=1{,}379520,\quad
f(r_b)=0{,}138150,\quad f(r_s)=-0{,}131459.
\]

La barrière de sortie depuis la bulle vers l'état sans bulle vaut alors environ 0,269609 dans les unités de f. Sa valeur ne fournit pas une durée de vie sans température réduite, bruit et mobilité physiquement déterminés.

Pour tester les bassins d'attraction, on impose δ constant et une mobilité radiale constante positive,

\[
\frac{dr}{d\tau}=-\frac{\partial f}{\partial r},
\qquad \frac{df}{d\tau}=-\left(\frac{\partial f}{\partial r}\right)^2\leq0.
\tag{8}
\]

Si la loi dimensionnée est Ṙ = −M_R ∂RΦ, le temps réduit est τ = M_R(4πσR_sn²)t/R_sn². Il n'est pas calibré. La loi de relaxation est une approximation dissipative ; elle n'est pas une équation hydrodynamique relativiste. À paramètres variables, un terme de travail externe s'ajouterait à la dérivée de f.

| Rayon initial | Résultat à τ = 60 |
|---:|---|
| 0 | Reste nul |
| 0,599386, sous la barrière | Se contracte vers zéro |
| 0,732582, au-dessus de la barrière | Converge vers 1,379520 |
| 1,517472, au-dessus du minimum | Converge vers 1,379520 |

La contraction vers zéro est une extrapolation formelle de la loi de rayon ; les derniers stades exigeraient une description microscopique. À δ = 2, la plus grande fraction de volume converti parmi les cas examinés reste inférieure à 5 % du volume de référence. L'énergie tronquée reste toutefois une hypothèse, et cette faible fraction ne valide pas ses coefficients physiques.

![Barrières, rayons stationnaires et relaxation](bulles_stabilite.png)

Figure : les croix indiquent les maxima de barrière et les cercles les minima. Le premier panneau est cadré sur les extrema pour δ allant jusqu'à 1,5 ; les remontées de forte énergie sortent du cadrage vertical. Le cercle vide au deuxième panneau marque le seuil dégénéré, non un minimum stable. Le dernier panneau compare des germes initiaux préparés, sans bruit ni nucléation spontanée.

## 8 Relier le contrôle à une accumulation

Pour étudier l'accessibilité des seuils avant nucléation, dans un volume de nuage supposé fixe, nous proposons

\[
\dot q=I-\gamma q,\quad q(0)=0,\qquad
\delta(q)=\delta_0+\beta q.
\tag{9}
\]

I est un apport de densité normalisée par unité de temps ; γ > 0 représente une perte de l'excès de densité ; β > 0 postule qu'une accumulation favorise la phase transformée. Cette relation doit ultérieurement être dérivée d'une équation d'état. β peut avoir un autre signe ou varier selon les conditions. La conversion de matière et sa rétroaction sur q ne sont pas intégrées : (9) sert uniquement à calculer les temps où un milieu précurseur atteint un paramètre de contrôle donné.

Avec δ₀ = 0,8 et β = 1, les seuils de contrôle sont q_sn = 0,2 et q_eq ≈ 0,339754. Pour I/γ supérieur au seuil considéré,

\[
t_* = \frac1\gamma\ln\left(\frac{I/\gamma}{I/\gamma-q_*}\right).
\]

Si le plafond est égal au seuil, son approche est asymptotique ; s'il est inférieur, le seuil est inaccessible. Pour γ = 0,2 et I = 0,14, le milieu atteint δ = 1 à t = 1,682361 et l'égalité des énergies à t = 3,321459. Ces temps sont des repères d'accumulation, pas des temps de formation effective de bulle. Les résultats avec cinq apports figurent dans [le tableau calculé](resultats_bulle.md).

## 9 Sensibilité et contre-cas

Les échelles suivent R_sn ∝ (σV_r/K)^(1/4) et Δp_sn ∝ σ^(3/4)(K/V_r)^(1/4). Une tension plus grande élève donc la poussée requise pour voir apparaître les branches, aux autres paramètres fixés.

En conservant Δp₀ = 3,2, K = 100 et V_r = 200π, les simulations donnent un rayon minimum de 1,566260 pour σ = 0,5, de 1,379520 pour σ = 1 et aucun minimum positif pour σ = 2. Un même milieu moteur ne produit donc pas systématiquement une bulle stable.

Supprimer la rétroaction K laisse uniquement le maximum de la section 3. À l'inverse, rendre la ressource très limitée peut empêcher le minimum d'être favorable ou accessible. Dans les limites où le rayon devient comparable à l'environnement, les hypothèses du réservoir de référence doivent être remplacées. Aucun passage à une gravitation forte n'est couvert par ces lois d'échelle.

## 10 Reproduction et vérifications

Le programme [calcul_bulle.py](calcul_bulle.py) utilise uniquement la bibliothèque standard pour les calculs. Exécuter `python3 calcul_bulle.py` depuis ce dossier ; `--plot` ajoute les figures avec Matplotlib. Il produit les résultats Markdown et JSON ainsi que les trajectoires CSV. Dans cette session, les figures ont été produites avec Matplotlib 3.11.2 ; le code numérique ne dépend pas de cette bibliothèque.

Quatorze contrôles réussissent : racines et courbures, point dégénéré, absence de minimum au seuil, égalité analytique des énergies, réduction dimensionnelle pour plusieurs jeux de paramètres, gradient par différences finies, balance de pression, convergence RK4, dissipation, bassins d'attraction, invariance de r = 0, temps d'accumulation, contre-cas sans rétroaction et domaine de volume examiné. L'écart maximal des trajectoires lorsque le pas est divisé par deux vaut environ 9,7 × 10⁻⁹ ; la tolérance choisie est 10⁻⁷.

Ces vérifications contrôlent l'implémentation et les identités du modèle. Aucune donnée observationnelle n'a été utilisée pour ajuster ses paramètres ou valider son interprétation.

## 11 Ce que cette étape ajoute à notre hypothèse

Le problème possède maintenant un exemple calculable de compensation entre surface, poussée et ressource finie. Dans cet exemple, une bulle déjà suffisamment grande rejoint un rayon stable. Le résultat précise un mécanisme possible de persistance et fait apparaître deux seuils thermodynamiques distincts.

La chaîne complète reste ouverte à quatre endroits : la loi d'agrégation et de chauffage du nuage ; la transition qui crée l'interface ; le déclenchement effectif à travers la barrière ; la stabilité du domaine avec sa matière, ses échanges et sa géométrie. Un domaine cohérent en expansion exigerait en outre une notion de persistance différente de l'équilibre radial fini étudié ici.

La prochaine étude physique doit identifier l'intérieur et l'extérieur de la bulle, puis calculer ou contraindre σ, Δp₀ et la rétroaction à partir de leurs équations d'état. La nouveauté scientifique de cette construction par rapport aux théories de nucléation en volume fini n'est pas établie.
