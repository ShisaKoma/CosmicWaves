# Stabilité entropique et interactions dans des modèles exploratoires de domaines

## Résumé

Nous examinons une expérience de pensée dans laquelle des domaines aux propriétés effectives différentes pourraient résulter d'une dynamique physique commune. Pour préciser cette hypothèse, nous séparons l'accessibilité d'une configuration, sa stabilité locale, la persistance d'une région et la formation d'une histoire cosmologique. Trois modèles élémentaires permettent d'étudier certains de ces liens. Dans un modèle classique isotherme, l'intégration exacte de modes harmoniques internes donne une contribution entropique qui avance ou retarde un seuil de stabilité sous accumulation. Dans un double puits incliné, une influence imposée réduit la barrière d'un état métastable jusqu'à sa disparition. Dans un modèle réciproque à deux variables, une interaction qui pénalise les différences peut déstabiliser la coexistence de configurations opposées et favoriser leur uniformisation. Les calculs montrent que ni l'accumulation ni l'intensification des interactions n'imposent à elles seules une création de domaine. Les simulations déterministes et les calculs d'équilibre sont distingués des taux de transition, qui restent à établir. Nous explicitons enfin les hypothèses nécessaires pour étudier la fermeture d'objets filiformes et pour relier une transition locale à une région cosmologique chaude en expansion. Les modèles présentés fournissent des résultats conditionnels et un programme de recherche, sans constituer une théorie de la naissance des univers.

## 1 Motivation et portée

L'hypothèse initiale propose de considérer notre univers comme un régime durable d'une réalité physique plus fondamentale. Les propriétés d'un domaine dépendraient de configurations de champs et de géométrie ; une même dynamique pourrait gouverner leur formation, leur persistance et leurs interactions. Dans ce vocabulaire, un univers désigne une région et son histoire cosmologique après un épisode de type Big Bang. Cette définition ne présuppose pas une création absolue de l'espace-temps.

Des théories à paramètres effectifs variables donnent un cadre à la première partie de cette intuition [1]. La relativité intriquée fournit une motivation particulière : Minazzoli obtient une relation de proportionnalité entre les variations de G et de ℏ dans le régime étudié [2]. Cette relation n'établit ni une pluralité de domaines ni leur production. Les potentiels introduits ici ne sont pas dérivés de cette théorie. Une différence observable doit en outre être formulée au moyen de quantités opérationnelles, notamment de rapports sans dimension [1].

Le choix de travail est celui de régions dans un espace-temps parent. Il permet de donner un sens aux distances, aux interfaces et à une influence causale. Faire émerger l'espace-temps lui-même serait un problème supplémentaire. Les exemples qui suivent sont des modèles locaux distincts : leurs variables ne désignent pas encore les mêmes objets physiques, et leur réunion ne constitue pas une dynamique commune démontrée.

Les méthodes employées appartiennent à la physique statistique, à l'analyse de stabilité et à l'étude des potentiels métastables. L'intérêt de la synthèse est d'identifier les conclusions effectivement obtenues et les liens encore manquants. La place d'un éventuel apport original par rapport à ces méthodes connues doit faire l'objet d'une recherche bibliographique plus ciblée avant soumission.

## 2 Définitions et hypothèses

Une configuration mathématiquement possible n'est pas nécessairement accessible depuis un état donné ; une configuration accessible n'est pas nécessairement réalisée. De même, un minimum local ne détermine ni la fréquence de formation d'une région ni sa durée de vie complète.

| Question | Objet à calculer |
|---|---|
| Quels états sont accessibles | Dynamique et contraintes à partir de conditions initiales |
| Un état résiste-t-il aux petites perturbations | Spectre linéaire puis termes non linéaires si nécessaire |
| Un état métastable peut-il être quitté | Barrière, fluctuations et taux de transition |
| Une région persiste-t-elle | Taille, interface, environnement et géométrie |
| Une phase cosmologique apparaît-elle | Expansion, transfert d'énergie et histoire thermique |

Nous retenons comme postulats exploratoires une structure commune autorisant plusieurs régimes, la présence éventuelle de plusieurs domaines et la possibilité d'une influence physique entre certains d'entre eux. Le postulat suivant lequel certaines transitions produiraient une histoire cosmologique reste indépendant des précédents.

Pour éviter les collisions de notation présentes dans les documents de travail, I désigne le flux d'accumulation, γ le taux de perte, h l'inclinaison du double puits et η le couplage réciproque entre deux variables. Le symbole g est réservé au couplage entre accumulation et configuration dans le premier modèle. Ces changements sont uniquement typographiques.

## 3 Accumulation et contribution entropique

### 3.1 Modèle microscopique conditionnel

Soient q une coordonnée de configuration sans dimension, n une charge accumulée sans dimension et N coordonnées internes classiques yᵢ. N reste fixe. Un bain maintient T > 0 ; les modes internes s'équilibrent rapidement devant l'évolution de q et de n. Nous choisissons

\[
U(q,\mathbf y;n)=\frac{k-gn}{2}q^2+\frac b4q^4
+\frac{c_0e^{\alpha q^2}}2\sum_{i=1}^{N}y_i^2,
\tag{1}
\]

avec b, c₀ et g strictement positifs. Si yᵢ est sans dimension, k, g, b et c₀ ont les unités d'une énergie ; α est sans dimension. La raideur des modes internes demeure positive pour les deux signes d'α. L'affaiblissement du rappel par n et sa dépendance aux modes internes sont des choix de modélisation, non des lois cosmologiques établies.

L'intégration gaussienne avec une mesure fixe dyᵢ/ℓ donne

\[
Z_y(q,T)=\left(\frac{2\pi k_BT}{c_0\ell^2}\right)^{N/2}
e^{-N\alpha q^2/2}.
\tag{2}
\]

L'énergie libre conditionnelle est donc exactement

\[
F(q;n,T)=F_0(T)+\frac{A(n,T)}2q^2+\frac b4q^4,
\qquad A=k-gn+N\alpha k_BT.
\tag{3}
\]

L'élimination de variables internes pour construire une énergie libre s'inscrit dans une méthode standard de physique statistique [3]. Ici, le résultat suit directement de l'intégrale (2). Le potentiel effectif est confinant pour tout n fini grâce au terme quartique. L'entropie conditionnelle des modes internes satisfait

\[
S_y(q,T)-S_y(0,T)=-\frac{N\alpha k_B}{2}q^2.
\tag{4}
\]

Pour α > 0, le déplacement de q rigidifie les modes, réduit leur entropie et renforce le rappel. Pour α < 0, il produit l'effet inverse. Cette entropie est définie à q fixé ; elle ne représente pas l'entropie totale du système et de son bain. Aucune saturation d'une capacité d'information n'est postulée.

### 3.2 Seuil et dynamique locale

Nous choisissons une relaxation dissipative de mobilité M > 0,

\[
\dot q=-M\partial_qF=-M(Aq+bq^3).
\tag{5}
\]

Pour A > 0, q = 0 possède un rappel linéaire. Pour A < 0, cet état est instable et deux minima apparaissent en q = ±√(−A/b). À A = 0, le minimum quartique reste strict et la relaxation est algébrique :

\[
q(t)=\frac{q(0)}{\sqrt{1+2Mbq(0)^2t}}.
\tag{6}
\]

Le changement de signe de la courbure intervient à

\[
n_c(T)=\frac{k+N\alpha k_BT}{g}.
\tag{7}
\]

Un seuil positif suppose k + NαkBT > 0. Si cette quantité est négative, l'état initial est déjà instable à n = 0. La sensibilité thermique est dn_c/dT = NαkB/g. L'accumulation ne suffit pas à imposer la transition : avec g = 0 le seuil ne se déplace pas, et un couplage de signe opposé renforcerait le rappel.

### 3.3 Accessibilité et délai de croissance

La loi ouverte d'accumulation est

\[
\dot n=I-\gamma n,\qquad
n(t)=\frac I\gamma+\left(n_0-\frac I\gamma\right)e^{-\gamma t},
\tag{8}
\]

avec I ≥ 0, γ > 0 et n₀ < n_c. Pour I/γ > n_c, le temps d'atteinte est

\[
t_c=\frac1\gamma\ln\left(\frac{I/\gamma-n_0}{I/\gamma-n_c}\right).
\tag{9}
\]

Un plafond inférieur au seuil empêche son atteinte ; un plafond égal au seuil ne permet qu'une approche asymptotique. Les calculs utilisent k = g = b = c₀ = M = 1, N = 10, kBT = 0,1, γ = 0,2, n₀ = 0 et q₀ = 0,05, en unités réduites. La solution analytique de n alimente une intégration RK4 de q jusqu'à t = 120, avec un pas de 0,01.

| α | I | I/γ | n_c | t_c | Premier passage montant de \|q\| à 0,1 après t_c |
|---:|---:|---:|---:|---:|---:|
| −0,4 | 0,1 | 0,5 | 0,6 | Aucun temps fini | Non observé |
| −0,4 | 0,2 | 1,0 | 0,6 | 4,581 | 13,431 |
| −0,4 | 0,3 | 1,5 | 0,6 | 2,554 | 7,108 |
| 0 | 0,1 | 0,5 | 1,0 | Aucun temps fini | Non observé |
| 0 | 0,2 | 1,0 | 1,0 | Aucun temps fini | Non observé |
| 0 | 0,3 | 1,5 | 1,0 | 5,493 | 15,774 |
| +0,4 | 0,1 | 0,5 | 1,4 | Aucun temps fini | Non observé |
| +0,4 | 0,2 | 1,0 | 1,4 | Aucun temps fini | Non observé |
| +0,4 | 0,3 | 1,5 | 1,4 | 13,540 | 82,468 |

Le repère 0,1 sert uniquement à comparer les trajectoires. Le délai après t_c dépend de l'amortissement antérieur, de q₀ et du repère choisi. Une trajectoire exactement initialisée à q = 0 y reste dans cette équation sans bruit, y compris lorsque cet état est instable. Les neuf cas sont indépendants et ne représentent pas un échantillon d'une population cosmologique ; leur fraction de franchissements n'est pas une probabilité de création d'univers.

### 3.4 Fluctuations et bilan

La distribution d'équilibre à n et T fixés est proportionnelle à exp[−F(q)/(kBT)]. Sa moyenne signée est nulle par symétrie, même lorsqu'elle présente deux modes. Au seuil,

\[
\langle q^2\rangle=\sqrt{\frac{4k_BT}{b}}
\frac{\Gamma(3/4)}{\Gamma(1/4)}.
\tag{10}
\]

À n = 1,2, les quadratures donnent respectivement ⟨q²⟩ = 0,501932 ; 0,279165 ; 0,168072 pour α = −0,4 ; 0 ; +0,4. Ces moments d'équilibre sont calculés séparément des trajectoires déterministes. Le système fini à température positive ne présente pas de singularité thermodynamique démontrée.

Une extension stochastique cohérente pour un bain markovien et une mobilité constante serait dq = −M∂qF dt + √(2MkBT) dW_t. Elle n'est pas simulée ici. Les taux d'échappement exigeraient un événement de sortie et un régime d'approximation explicites [4].

À n et T fixés, dF/dt = −M(∂qF)² ≤ 0. À T fixé lorsque n évolue, un terme de contrôle −gq²ṅ/2 s'ajoute. Une énergie de référence E₀(n) modifierait le bilan du chargement sans changer le seuil local. Les échanges du bain et du réservoir ne sont pas fermés : le modèle décrit une stabilité sous contrôle extérieur.

## 4 Influence imposée sur un état métastable

Pour distinguer perte de stabilité et franchissement d'une barrière, considérons un second modèle,

\[
V(\varphi;h)=\frac{\lambda_4}{4}(\varphi^2-v^2)^2-h\varphi,
\qquad \lambda_4>0,\quad v>0.
\tag{11}
\]

L'inclinaison h représente une influence reçue. Elle est distincte du flux I du modèle précédent. Pour que le minimum négatif soit déjà métastable dans la préparation de référence, nous posons h = h_fond + δh, avec 0 < h_fond < h_c. À h = 0 les deux minima sont dégénérés, et aucun n'est un minimum de plus haute énergie.

Les conditions V′ = V″ = 0 donnent

\[
\varphi_*=-\frac v{\sqrt3},\qquad
h_c=\frac{2\lambda_4v^3}{3\sqrt3}.
\tag{12}
\]

Au seuil positif, le minimum négatif fusionne avec le sommet de barrière. La dérivée troisième y est non nulle : le point stationnaire cesse d'être un minimum. Cela diffère du minimum quartique encore stable à A = 0 dans le premier modèle.

Pour 0 < h < h_c, notons φ_m le minimum métastable et φ_s le sommet. À λ₄ et v fixés,

\[
\Delta V(h)=V(\varphi_s;h)-V(\varphi_m;h),\qquad
\frac{d\Delta V}{dh}=\varphi_m-\varphi_s<0.
\tag{13}
\]

Cette dérivée suit de V′ = 0 sur chaque branche. Une perturbation positive réduit donc la barrière ; son signe opposé peut la relever tant que la même branche reste métastable.

| h/h_c | ΔV/(λ₄v⁴) |
|---:|---:|
| 0 | 0,250000 |
| 0,2 | 0,177535 |
| 0,4 | 0,114510 |
| 0,6 | 0,061929 |
| 0,8 | 0,021762 |

La première ligne sert de référence symétrique. Si V est une densité d'énergie, ΔV en est également une ; son insertion directe dans une exponentielle d'activation serait incorrecte. Il faut déterminer une énergie d'activation incluant le volume et, pour un champ spatial, les gradients. Une transition thermique ou quantique peut se produire avant la disparition du minimum [4,5]. La hauteur locale ne fournit ni son taux ni l'action de la configuration de transition.

Une comparaison causale entre domaines A et B conserverait le même état initial de B et A présent dans les deux situations. Seule une perturbation supplémentaire issue de A changerait. Il faudrait calculer la réponse retardée δh(x,t), puis comparer des probabilités de premier passage à échéance fixée. L'actuelle analyse quasi statique ne résout ni ce médiateur ni sa rétroaction et ne calcule aucune de ces probabilités.

## 5 Couplage réciproque et perte de coexistence

Une influence peut réduire la diversité des états. Dans un troisième modèle, deux variables sans dimension possèdent l'énergie réduite

\[
\mathcal U(x,y)=\frac{(x^2-1)^2}{4}+\frac{(y^2-1)^2}{4}
+\frac\eta2(x-y)^2,\qquad \eta\geq0.
\tag{14}
\]

Avec une relaxation par gradient, les états communs x = y = ±1 restent des minima : les valeurs propres de la Hessienne sont 2 et 2 + 2η. Les états opposés x = −y = q vérifient q² = 1 − 2η ; ils existent pour η < 1/2. Leurs valeurs propres sont

\[
\mu_{\rm commun}=2-6\eta,\qquad
\mu_{\rm oppose}=2-4\eta.
\tag{15}
\]

La coexistence opposée est un minimum strict pour η < 1/3 et un point selle pour 1/3 < η < 1/2. Une perturbation appropriée peut ainsi conduire à un état commun déjà présent dans le modèle. Aucun troisième domaine n'est créé.

Le cas η = 1/3, laissé ouvert par le seul test quadratique du document initial, peut être précisé. Posons s = (x+y)/2 et d = (x−y)/2. Sur la courbe d² = 1/3 − 3s², admissible pour |s| < 1/3, une substitution exacte donne

\[
\mathcal U(s+d,s-d)-\mathcal U(1/\sqrt3,-1/\sqrt3)=-4s^4.
\tag{16}
\]

L'équilibre opposé n'est donc déjà plus un minimum local au seuil exact. Cette vérification d'ordre supérieur est un complément mathématique de la présente synthèse ; elle ne constitue pas une revendication d'originalité scientifique. Elle illustre pourquoi une courbure nulle demande une analyse supplémentaire.

Sur un réseau fini à poids positifs, l'extension de (14) avec une somme sur les arêtes donne, autour d'un état commun, une Hessienne 2I_d + ηL, où I_d est la matrice identité et L le laplacien du réseau. L étant positif ou nul, augmenter le nombre de domaines ne suffit pas à rendre cet équilibre instable. Le couplage instantané reste une approximation locale, non un modèle relativiste de transmission.

## 6 De la stabilité locale à la persistance spatiale

Les trois modèles précédents ne décrivent pas une interface. Dans l'approximation d'une bulle sphérique à paroi mince, au repos et sans gravitation, une tension σ > 0 et un gain volumique Δρ > 0 donnent

\[
E(R)=4\pi\sigma R^2-\frac{4\pi}{3}\Delta\rho R^3.
\tag{17}
\]

Le maximum est à R_* = 2σ/Δρ, avec E″(R_*) = −8πσ. La stabilité du régime intérieur ne suffit donc pas à assurer la croissance d'une petite région. Ce rayon ne doit pas être confondu avec le rayon de nucléation à température nulle R₀ = 3σ/Δρ dans l'approximation de paroi mince correspondante [5,7]. Les vitesses initiales, les gradients et la gravitation modifient le problème ; la désintégration du vide avec gravitation possède son propre traitement [6].

La lente évolution d'un paramètre ne suppose pas non plus toujours un minimum attractif. À titre mathématique, l'équation imposée χ̈ + 3Hχ̇ = 0 donne χ̇ ∝ a⁻³. Pour a ∝ t^p à temps long, χ converge si p > 1/3. La diminution de sa vitesse et le rappel vers une valeur privilégiée sont deux propriétés distinctes. Cet exemple ne constitue pas une solution cosmologique du système étudié ici.

Même lorsqu'une région en expansion est obtenue, son entrée dans une phase chaude exige un mécanisme de production de matière et de thermalisation, comme l'illustre la littérature sur le réchauffement [8]. Aucun calcul présenté ici ne fournit cette étape ou une signature observable d'un univers nouvellement formé.

## 7 Fermeture et dimensions comme prolongements

Les notes de recherche proposent un milieu d'objets initialement ouverts, dont l'accumulation ou la géométrie pourrait favoriser la fermeture. Nous conservons cette proposition comme question physique distincte. Un intervalle et une boucle sont tous deux intrinsèquement unidimensionnels : une fermeture change la topologie et les conditions aux limites, sans créer automatiquement une direction spatiale supplémentaire. Le nombre N de modes internes du premier modèle n'est pas une dimension spatiale.

La comparaison des états ouverts O et fermés C demanderait des spectres, une mesure commune et des contraintes physiques compatibles. À température fixée, elle pourrait utiliser

\[
F_C-F_O=-k_BT\ln(Z_C/Z_O).
\tag{18}
\]

Une valeur négative favoriserait C à l'équilibre sans fixer le délai de fermeture. Une dynamique markovienne à deux états introduirait séparément des taux k_OC et k_CO. Le bilan détaillé, lorsqu'il s'applique, fixe leur rapport par (18), mais ne fixe pas leur échelle absolue.

L'exemple effectif d'un filament classique de longueur L et de rigidité de flexion κ illustre la distinction. En comparant un segment droit à un cercle lisse de même longueur, avec une énergie de liaison ε gagnée à la jonction, on obtient

\[
\Delta E=\frac{2\pi^2\kappa}{L}-\varepsilon.
\tag{19}
\]

La fermeture circulaire est énergétiquement favorisée si εL/κ > 2π². Ce critère compare deux formes choisies ; il ne fournit ni barrière, ni taux, ni entropie de fermeture. Il n'identifie pas le filament à une corde fondamentale. Une boucle ne constitue pas à elle seule une frontière enfermant un volume tridimensionnel.

Les deux voies proposées, modification des états internes et évolution de la géométrie spatiale, restent ouvertes. Il faudrait construire leurs spectres et leurs bilans sans compter deux fois un effet géométrique sur les modes accessibles. Les bornes covariantes d'entropie reposent sur des conditions géométriques spécifiques [9] ; elles ne fournissent pas ici un seuil automatique de fermeture ou d'expansion.

## 8 Résultats acquis et limites

| Résultat établi dans le modèle choisi | Interprétation non établie |
|---|---|
| Les modes internes déplacent n_c dans les deux sens | Une surcharge informationnelle produit un univers |
| Les apports déterminent l'accessibilité et le temps du seuil | Le temps du seuil est une durée de cosmogenèse |
| Une inclinaison positive réduit une barrière métastable | Un domaine réel transmet l'influence nécessaire |
| Un couplage réciproque peut détruire la coexistence opposée | Plus de domaines entraînent une création ou un effondrement |
| Deux formes de filament ont des énergies comparables | Un germe se ferme et devient une région cosmologique |

Le résultat transversal est que les étapes du scénario répondent à des critères différents. Une instabilité locale peut donner une réorganisation, une uniformisation ou une disparition. Les modèles ne sélectionnent pas automatiquement l'issue cosmologique recherchée.

Les discussions du corpus sur Everett, le statut des histoires et les analogies humaines conservent leur place dans l'histoire de l'expérience de pensée. Elles ne contribuent pas aux démonstrations ci-dessus. L'examen d'un commentaire externe sur le dédoublement du temps est également conservé dans les documents sources, sans être adopté comme appui physique. Cette délimitation concentre le manuscrit sur des hypothèses explicites et des conséquences calculables.

## 9 Reproductibilité

Les deux scripts existants ont été recopiés sans modification dans le dossier `reproduction`, puis réexécutés pour cette synthèse. Les deux résultats JSON correspondent exactement aux résultats sources ; les trajectoires CSV sont identiques octet par octet. Les dix contrôles du modèle d'accumulation et les six contrôles de la comparaison des germes réussissent, notamment les comparaisons avec des solutions analytiques et les réductions de pas.

Un script supplémentaire vérifie les racines du double puits, les signes de courbure, la dérivée de la barrière et le calcul d'ordre quatre au seuil réciproque. Le résidu maximal des équations stationnaires est inférieur à 7 × 10⁻¹⁶ ; l'écart de la dérivée de barrière par différences finies est inférieur à 4 × 10⁻¹¹. Ces contrôles testent la cohérence des calculs pour les paramètres examinés, sans constituer des observations.

Depuis le dossier de cette synthèse, avec Python 3 et sa bibliothèque standard :

```sh
python3 reproduction/calcul_seuil.py
python3 reproduction/comparer_germes.py
python3 verifier_synthese.py
```

La dernière commande compare aussi les fichiers au corpus voisin `../seuil-entropie`. Les empreintes du corpus figurent dans `sources_manifest.json` ; les contrôles complémentaires sont enregistrés dans `verification.json`.

## 10 Conclusion

L'expérience de pensée peut être structurée autour d'une question précise : comment des degrés de liberté internes, une accumulation et des interactions modifient-ils la stabilité et la persistance de configurations distinctes ? Trois modèles apportent des réponses conditionnelles et montrent que l'issue dépend du mécanisme choisi. L'entropie peut renforcer ou affaiblir un rappel, une influence peut réduire une barrière, et une interaction réciproque peut conduire à l'uniformisation.

Le passage à une théorie cosmologique demande encore une identification physique des variables, une dynamique spatiale causale et des bilans, puis une géométrie et une histoire thermique. Pour le prolongement ouvert/fermé, le premier calcul décisif serait celui des spectres, de la barrière de jonction et des taux de fermeture et de réouverture. La synthèse actuelle organise les acquis et leurs limites ; elle ne démontre pas la naissance d'un univers.

## Addendum sur le nuage de plasma et la stabilité d'une bulle

Après la rédaction de cette première synthèse, l'hypothèse a été précisée : un nuage de particules pourrait s'agréger, former un plasma et franchir un seuil menant à une bulle persistante. Le [journal des hypothèses](../journal_hypotheses.md) conserve cette évolution et son attribution. Elle n'est pas encore intégrée comme identification physique des variables des sections précédentes.

Une [note complémentaire](../plasma-bulle/nuage_plasma_bulle.md) examine un mécanisme de stabilité radiale finie. À l'énergie de surface et au gain volumique, elle ajoute un coût K V_b²/(2 V_r) représentant la rétroaction d'une ressource finie. Cette hypothèse produit un maximum de nucléation et un minimum à rayon positif au-dessus d'un seuil. Un second seuil rend le minimum de bulle favorable face à l'absence de bulle, sans supprimer la barrière de formation. Les calculs et quatorze contrôles sont fournis dans le dossier `plasma-bulle`.

Cette extension affine la question de la persistance. Les phases, la quantité conservée et l'équation d'état ne sont pas dérivées de la QCD ; le modèle ne simule ni l'agrégation initiale ni la formation effective d'un plasma ou d'un domaine cosmologique. Son intégration définitive dans l'article dépendra de ces identifications et du positionnement bibliographique.

## Références

Les notices et les passages accessibles ont été vérifiés pour cette synthèse. Cette sélection n'est pas une revue exhaustive de l'état de l'art. Le niveau de vérification documentaire est détaillé dans la note de préparation.

1. Jean-Philippe Uzan, *Varying constants, Gravitation and Cosmology*, Living Reviews in Relativity 14, 2 (2011). [arXiv:1009.5514](https://arxiv.org/abs/1009.5514).
2. Olivier Minazzoli, *Quantum of action in entangled relativity*, prépublication, 2022, version 5 du 5 mars 2025. [arXiv:2206.03824v5](https://arxiv.org/abs/2206.03824v5).
3. David Tong, *Statistical Field Theory*, chapitre 1, énergie libre et approche de Landau. [Cours de l'auteur](https://www.damtp.cam.ac.uk/user/tong/sft/sfthtml/S1.html).
4. Peter Hänggi, Peter Talkner et Michal Borkovec, *Reaction-rate theory: fifty years after Kramers*, Reviews of Modern Physics 62, 251 (1990). [DOI](https://doi.org/10.1103/RevModPhys.62.251).
5. Sidney Coleman, *Fate of the false vacuum: Semiclassical theory*, Physical Review D 15, 2929 (1977), et erratum D 16, 1248 (1977). [Article](https://doi.org/10.1103/PhysRevD.15.2929), [erratum](https://doi.org/10.1103/PhysRevD.16.1248).
6. Sidney Coleman et Frank De Luccia, *Gravitational effects on and of vacuum decay*, Physical Review D 21, 3305 (1980). [DOI](https://doi.org/10.1103/PhysRevD.21.3305).
7. Wen-Yuan Ai, Juan S. Cruz, Bjorn Garbrecht et Carlos Tamarit, *Instability of bubble expansion at zero temperature*, Physical Review D 107, 036014 (2023). [arXiv:2209.00639](https://arxiv.org/abs/2209.00639).
8. Rouzbeh Allahverdi, Robert Brandenberger, Francis-Yan Cyr-Racine et Anupam Mazumdar, *Reheating in Inflationary Cosmology: Theory and Applications*, Annual Review of Nuclear and Particle Science 60, 27-51 (2010). [arXiv:1001.2600](https://arxiv.org/abs/1001.2600).
9. Raphael Bousso, Éanna É. Flanagan et Donald Marolf, *Simple sufficient conditions for the generalized covariant entropy bound*, Physical Review D 68, 064001 (2003). [arXiv:hep-th/0305149](https://arxiv.org/abs/hep-th/0305149).
