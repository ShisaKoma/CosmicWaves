# Gravitation et probabilité de formation du germe

Note , à la suite de la proposition  : rechercher si une configuration gravitationnelle intervient dans la probabilité de formation d'un germe. Cette note précise le programme et l'interprétation des calculs existants ; aucune simulation gravitationnelle nouvelle n'y est annoncée.

## 1 Deux questions physiques distinctes

La première question porte sur les excitations fondamentales. Dans les constructions perturbatives de cordes fermées pertinentes, le spectre contient un mode sans masse de spin 2 interprété comme le graviton. C'est un résultat théorique concernant le contenu et les interactions d'une théorie quantique. Il ne signifie pas que toute fermeture de filament produit un graviton, ni qu'un nuage acquiert nécessairement une configuration liée. [MIT OpenCourseWare, cours sur le spectre des cordes et le graviton](https://ocw.mit.edu/courses/8-821-string-theory-and-holographic-duality-fall-2014/video_galleries/video-lectures/), [transcription du cours](https://ocw.mit.edu/courses/8-821-string-theory-and-holographic-duality-fall-2014/673f398dc3439b7e64e041a2a836cdb1_iPWIqjYkVns.pdf).

La seconde question est collective : une distribution de matière et de champs peut-elle s'agréger, former une région et persister sous l'effet conjoint de sa pression, de ses interactions et de la gravitation ? C'est cette question qui se rapporte directement au germe. La configuration recherchée devrait inclure la matière, les champs et la géométrie ; le seul choix d'une excitation gravitationnelle ne la détermine pas.

La correction de vocabulaire  est conservée : les leptons constituent une famille de fermions ; bosons et fermions se distinguent par leur spin et leur statistique dans le cadre relativiste usuel. La taille ou la dimension géométrique d'une oscillation ne suffit pas à identifier un électron, un quark ou un graviton. Un spectre cohérent et les nombres quantiques et interactions doivent être reconstruits.

## 2 Ce que montre exactement notre attracteur

Pour une équation radiale Ṙ = v_R(R), un point fixe satisfait v_R(R_*) = 0. Si v_R est dérivable et v_R'(R_*) < 0, la linéarisation prédit un rappel local exponentiel. Si la dérivée est nulle, il faut examiner les ordres suivants ; cette inégalité est un critère suffisant de stabilité linéaire, pas la définition de toute stabilité possible.

Notre calcul utilise dr/dτ = −∂r f, avec

\[
f(r;\delta)=r^2-\frac89\delta r^3+\frac19r^6.
\]

Pour δ > 1, un maximum r_b sépare l'état sans bulle du minimum r_s. Le bassin du minimum s'étend formellement de r_b à l'infini dans cette équation polynomiale ; physiquement il doit être limité aux rayons où les hypothèses du milieu fini restent applicables. Ainsi, r_b < r < r_s conduit à une croissance vers r_s, mais 0 < r < r_b conduit à une contraction. L'expression « germe petit » doit donc signifier petit par rapport au rayon stable, tout en restant au-dessus de la barrière.

En écrivant r = r_s + u, on obtient localement

\[
\dot u=-\kappa_{\rm loc}u+O(u^2),\qquad
\kappa_{\rm loc}=f''(r_s)=2(r_s^4-1)>0,
\]

où le point désigne le temps réduit τ. L'exponentielle proposée décrit donc bien le voisinage de notre minimum. Elle ne doit pas être prolongée à tous les rayons, car elle ferait disparaître la barrière réellement présente dans le modèle.

À δ = 1,2, les résultats existants donnent r_b ≈ 0,665984 et r_s ≈ 1,379520. Une évaluation directe de la formule ci-dessus donne κ_loc ≈ 5,243392 et un temps de relaxation local 1/κ_loc ≈ 0,190716. Ces valeurs concernent les petites perturbations autour du minimum, en temps réduit sans calibration physique ; elles ne donnent pas le temps de formation d'une bulle. La gravitation n'intervient dans aucun coefficient du calcul actuel. Le minimum résulte de la surface, de la poussée et de la rétroaction finie que nous avons postulées.

## 3 Ce que la gravitation peut ajouter

La gravitation peut amplifier certaines inhomogénéités et aider une concentration de matière à se développer. Elle peut aussi conduire à un effondrement. Une structure en équilibre demande de déterminer les contributions qui s'opposent à la compression, puis d'étudier ses perturbations.

Un repère analytique est la relation de Jeans dans une approximation newtonienne de fluide homogène statique, à faibles perturbations et avec un traitement du fond approprié :

\[
\omega^2=c_s^2 k_{\rm onde}^2-4\pi G\rho_0.
\]

ρ₀ désigne la masse volumique de fond et c_s la vitesse du son adiabatique. Pour c_s²k_onde² < 4πGρ₀, un mode croissant existe. Le critère établit une possibilité d'amplification gravitationnelle, sans donner un rayon final stable ni une probabilité de formation. Il ne s'applique pas directement à notre plasma relativiste hypothétique ; l'expansion du fond, les champs et la relativité modifient les équations. [Documentation scientifique FLASH sur le test de Jeans](https://flash.rochester.edu/site/flashcode/user_support/flash_ug_devel/node193.html).

Pour un état métastable de champs, la gravitation peut également modifier les configurations de nucléation et leur action. Le cadre de Coleman et De Luccia fournit un exemple de traitement ; il ne justifie pas de supposer que la gravitation augmente toujours le taux de formation. [Coleman et De Luccia, 1980](https://doi.org/10.1103/PhysRevD.21.3305).

## 4 D'une dynamique à une probabilité

Une évolution déterministe à conditions initiales fixées détermine un devenir. Pour obtenir une probabilité, il faut définir un ensemble d'états initiaux, des fluctuations thermiques ou quantiques, ou une autre source d'aléa explicitement modélisée. Il faut aussi définir l'événement : apparition d'une interface, atteinte du bassin, survie pendant une durée donnée ou naissance d'une histoire cosmologique.

Dans notre seule équation de rayon à δ fixé et sans bruit, si les rayons initiaux ont une densité normalisée p₀(r) sur un domaine physique admissible [0,r_max], la probabilité de rejoindre le minimum vaut

\[
P_{\rm capture}=\int_{r_b}^{r_{\max}}p_0(r)\,dr,
\]

en supposant r_max > r_b, une distribution continue et la validité du modèle sur les trajectoires concernées. Aucun p₀ physiquement justifié n'a été choisi. Cette formule définit la capture de germes déjà préparés, pas leur création à partir d'un état sans bulle.

Pour une nucléation, un taux Γ par unité de volume et de temps pourrait donner, sous une hypothèse de processus de Poisson indépendant,

\[
P_{\geq1}(t)=1-\exp\left[-\int_0^t\Gamma(t')V(t')\,dt'\right].
\]

Le volume, le temps et le régime de validité doivent être définis ; en relativité, le calcul doit respecter la géométrie et les éléments de volume-temps appropriés. Γ doit être calculé à partir de la dynamique et des fluctuations. Cette expression ne fournit pas la probabilité de survie ultérieure de la région formée. Aucun Γ n'a été évalué dans notre étude.

## 5 Hypothèse retenue et prochaine comparaison

**Hypothèse à tester : certaines configurations couplées de matière, de champs et de gravitation pourraient favoriser la formation ou la persistance de germes, selon leur état initial et les mécanismes de transition disponibles.**

La comparaison devra garder la même définition de l'événement et des préparations comparables, puis mesurer comment le couplage gravitationnel modifie les seuils, les bassins, les taux et la survie. Les contraintes gravitationnelles doivent être satisfaites dans chaque préparation ; activer G dans une configuration arbitraire ne constitue pas nécessairement une comparaison physique cohérente.

Le choix préalable reste la nature du germe : région de plasma matériel, domaine d'un autre état de champs, ou région déjà décrite par une géométrie cosmologique. Ces cas ne disposent pas des mêmes bilans ni des mêmes critères. L'ajout d'une action de cordes complète n'est pas nécessaire pour commencer une étude gravitationnelle effective, mais une identification microscopique aux cordes exigerait ensuite une dérivation distincte.

## 6 Amplification exponentielle et conditions de stabilité

**Ajout .** Proposition que la gravitation amplifie exponentiellement l'agrégation et que la gravité que nous observons participe au seuil de stabilité du germe. Il conserve également son intervention dans la nucléation comme piste physique.

### Un régime où l'exponentielle est calculable

Dans le modèle statique newtonien de Jeans de la section 3, notons D(t) l'amplitude d'un mode de contraste de densité. Cette notation évite de confondre cette perturbation avec la poussée réduite δ du modèle de bulle. Les coefficients étant constants,

\[
\ddot D=s^2D,\qquad
s^2=4\pi G\rho_0-c_s^2 k_{\rm onde}^2.
\]

Lorsque s² > 0, la solution est D = C_+ exp(st) + C_- exp(−st). Le mode croissant est exponentiel si C_+ est non nul. Avec une vitesse initiale nulle, la solution est D(0) cosh(st), qui rejoint un comportement exponentiel après le régime initial. L'amplitude de l'inhomogénéité augmente ; la formule ne dit pas que le nombre de particules ou de germes augmente exponentiellement.

Cette dérivation vaut pour |D| très inférieur à 1 et le fond prescrit. Pour un mode purement croissant, atteindre une amplitude D_lim encore dans le régime linéaire prend t = ln(D_lim/D_0)/s. Extrapoler jusqu'à D de l'ordre de 1 indique seulement la sortie approximative du régime linéaire, pas la formation démontrée d'une bulle. Le temps dépend de la fluctuation initiale et diverge lorsque s tend vers zéro à amplitude initiale fixée. [Test et relation de dispersion de Jeans dans FLASH](https://flash.rochester.edu/site/flashcode/user_support/flash_ug_devel/node193.html).

### La gravitation fait partie d'une condition collective

Pour k_onde > 0 et c_s > 0, introduisons

\[
\mathcal J=\frac{4\pi G\rho_0}{c_s^2k_{\rm onde}^2}.
\]

Le modèle prédit un mode croissant pour J calligraphique > 1 et des oscillations linéaires pour J calligraphique < 1. À égalité, D = C_1 + C_2 t : le mode n'a plus de rappel linéaire, et l'examen des vitesses et des termes négligés est nécessaire. Ce critère est un seuil d'instabilité du nuage homogène, pas un minimum de rayon de la bulle finale.

Cette combinaison contient bien G, mais aussi une densité, une réponse de pression et une échelle spatiale. La gravité entre donc dans les conditions de stabilité, sans constituer un seuil universel à elle seule. La proposition  est conservée dans ce sens ; elle n'est pas interprétée comme l'affirmation que la valeur mesurée de G serait précisément une valeur critique. Une telle affirmation exigerait un modèle expliquant cette sélection et des prédictions observables, notamment sans dimension.

### Effet d'un fond en expansion

Dans une approximation cosmologique newtonienne appropriée pour les perturbations d'une composante non relativiste aux échelles concernées, l'équation devient

\[
\ddot D+2H\dot D+
\left(\frac{c_s^2k_{\rm com}^2}{a^2}-4\pi G\rho_0\right)D=0.
\]

L'expansion amortit la croissance et fait évoluer ses coefficients. Pour un fond plat dominé par la matière sans pression, a ∝ t^(2/3), H = 2/(3t) et 4πGρ₀ = 2/(3t²). En substituant D ∝ t^p, on obtient p² + p/3 − 2/3 = 0, donc un mode croissant D ∝ t^(2/3) et un mode décroissant D ∝ t^(−1). La gravitation produit ici une croissance en puissance du temps. Le plasma relativiste proposé demanderait ses propres équations et ne doit pas être assimilé à cette matière sans pression. [David Tong, Cosmology, chapitre Structure Formation](https://www.damtp.cam.ac.uk/user/tong/cosmo/cosmohtml/S3.html).

### Deux exponentielles physiquement différentes

L'amplification exp(st) d'une perturbation n'est pas l'exponentielle qui apparaît dans une approximation semiclassique de nucléation. Dans un régime où elle est justifiée, un taux peut avoir la forme Γ ≈ A exp(−B/ℏ), où B est une différence d'actions euclidiennes et A un préfacteur dimensionné. La gravitation peut modifier B, A et l'existence même de la configuration de transition ; le signe de l'effet doit être calculé. Le travail de Coleman et De Luccia concerne une transition entre états de champs avec gravitation, pas directement l'agrégation d'un plasma matériel. [Coleman et De Luccia, 1980](https://doi.org/10.1103/PhysRevD.21.3305).

Nous retenons donc deux calculs à relier ultérieurement : la croissance des inhomogénéités du milieu précurseur, puis une transition et la persistance du domaine obtenu. Aucune croissance exponentielle, stabilité finale ou probabilité chiffrée n'est imposée avant la définition de leurs équations communes.
