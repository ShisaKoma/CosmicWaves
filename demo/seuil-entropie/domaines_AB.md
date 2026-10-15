# Deux domaines et influence sur une transition métastable

Note , à partir de la proposition .

## Statut et hypothèses

Deux domaines A et B existent dans un espace-temps parent. Ils obéissent aux mêmes lois ; leurs états et les valeurs locales de champs peuvent différer. B occupe un état métastable. Un champ médiateur transmet causalement une perturbation de A vers B. Il s'agit d'une construction à examiner, sans identification à des champs observés, à des cordes fondamentales ou à la relativité intriquée. Aucune naissance d'espace-temps n'est ici modélisée.

Le potentiel proposé est :

\[
V(\varphi;J)=\frac{\lambda}{4}(\varphi^2-v^2)^2-J\varphi,
\qquad \lambda>0,\quad v>0.
\]

Pour l'analyse locale, J, lambda et v sont fixés. **Attention aux notations :** J est ici une inclinaison du potentiel, et non le flux d'accumulation J de la simulation des neuf germes. Lambda est ici le coefficient quartique, et non son taux de perte. Ce modèle ne remplace pas silencieusement le précédent : il étudie la disparition d'un puits métastable dans un double puits incliné, au lieu de la déstabilisation d'un état symétrique par changement du coefficient quadratique.

## Rendre cohérent l'état de référence

À J = 0, les deux minima sont dégénérés : aucun n'est le minimum de plus haute énergie au sens de la métastabilité recherchée. Pour que B soit déjà métastable en référence, on peut poser :

\[
J_B(t)=J_{\rm fond}+\delta J_{A\to B}(t),
\qquad 0<J_{\rm fond}<J_{\rm crit}.
\]

B est initialement dans le minimum négatif. Le terme de fond demande une origine physique ; il peut représenter un champ ambiant et inclure des contributions statiques déjà présentes. La comparaison conserve A dans les deux situations : on compare l'absence et la présence d'une perturbation supplémentaire produite dans A, en conservant le même état initial de B avant son arrivée. La persistance de B pendant la durée étudiée n'est pas garantie par la seule existence du minimum : elle dépend de son taux d'échappement.

## Vérification du seuil et de la barrière

Les extrema satisfont V' = lambda phi(phi² − v²) − J = 0, et leur courbure vaut V'' = lambda(3 phi² − v²). À la disparition du minimum négatif :

\[
\varphi_*=-\frac{v}{\sqrt3},\qquad
J_{\rm crit}=\frac{2\lambda v^3}{3\sqrt3}.
\]

Le cas négatif s'obtient par symétrie. Pour |J| < Jcrit, il existe deux minima et un maximum ; pour |J| > Jcrit, un seul minimum subsiste. Au seuil, le minimum métastable et le maximum se rejoignent ; V''' y est non nul, et ce point stationnaire n'est plus un minimum local. Ce cas diffère du minimum quartique encore stable à A = 0 dans la simulation précédente.

Pour 0 < J < Jcrit, notons phi_m < phi_s < phi_+ le minimum métastable, le sommet de barrière et le minimum stable. La barrière locale est :

\[
\Delta V(J)=V(\varphi_s(J);J)-V(\varphi_m(J);J).
\]

Comme V' s'annule aux deux extrema, la dérivée totale donne exactement, à lambda et v fixés :

\[
\frac{d\Delta V}{dJ}=\varphi_m-\varphi_s<0.
\]

Une augmentation positive de J abaisse donc la barrière de sortie du puits négatif dans ce modèle. Une perturbation de signe opposé peut la relever tant que l'on reste sur cette branche métastable. Si lambda et v évoluent aussi avec le médiateur, cette conclusion doit intégrer leurs contributions ; la seule existence de A ne fixe ni le signe ni l'amplitude des modifications.

On peut comparer les résultats sans choisir arbitrairement des unités : x = phi/v et j = J/(lambda v³) donnent V/(lambda v⁴) = (x² − 1)²/4 − jx. Les racines vérifiées numériquement conduisent au tableau suivant :

| J/Jcrit | Barrière Delta V/(lambda v⁴) |
|---:|---:|
| 0 | 0,250000 |
| 0,2 | 0,177535 |
| 0,4 | 0,114510 |
| 0,6 | 0,061929 |
| 0,8 | 0,021762 |

La ligne J = 0 est une référence symétrique, pas un état métastable de plus haute énergie. Les calculs vérifient les équations stationnaires, le signe des courbures, les deux conditions au seuil et la dérivée de la barrière par différences finies. Ce sont des calculs statiques locaux, pas des simulations du médiateur ou de transitions aléatoires.

Les dimensions satisfont [lambda] = [V]/[phi]⁴ et [J] = [V]/[phi]. Le seuil a donc bien les dimensions de J ; sa valeur physique reste inconnue sans identification et calibration des paramètres. Si V est une densité d'énergie, Delta V est aussi une densité : on ne peut pas l'utiliser directement comme une énergie d'activation dans une exponentielle thermique. Un domaine artificiellement contraint à rester homogène aurait une barrière proportionnelle à son volume ; un champ spatial peut former des bulles dont les gradients contribuent à la barrière.

## De la barrière au taux

Deux mécanismes possibles doivent être calculés avec leurs propres hypothèses :

- Activation thermique : spécifier le bain, la température, la dissipation et le bruit, puis calculer une énergie libre d'activation et un taux. Une loi de type Kramers est une approximation de régime ; elle ne se déduit pas de la seule hauteur de V et ne doit pas être extrapolée jusqu'à la disparition de la barrière sans contrôle. [Hänggi, Talkner et Borkovec, 1990](https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/41911)
- Effet tunnel : spécifier l'action, notamment les termes cinétiques et de gradient, puis calculer la configuration de transition et son action. Pour un champ, la hauteur locale du potentiel ne suffit pas à fixer le taux de désintégration du faux vide. [Coleman, 1977](https://journals.aps.org/prd/abstract/10.1103/PhysRevD.15.2929), [erratum](https://journals.aps.org/prd/abstract/10.1103/PhysRevD.16.1248)

L'entropie n'est pas encore définie dans le potentiel proposé. Pour examiner son rôle, il faut dériver un potentiel libre effectif à partir des degrés de liberté éliminés, avec un régime statistique explicite. Le terme −J phi représente une influence ; il n'est pas, à lui seul, une entropie ou une quantité d'information.

## Protocole de comparaison A/B

1. Fixer la même préparation de B, un temps d'observation défini et un critère de transition identique dans les deux situations. Distinguer le premier passage d'un simple état final, car des retours sont possibles.
2. Définir le médiateur et son couplage. Sa réponse retardée doit s'annuler hors du futur causal de la perturbation de A dans la métrique parent choisie. Un J imposé globalement et instantanément ne réalise pas ce mécanisme.
3. Calculer J_B(x,t). L'analyse quasi statique de la barrière suppose une variation lente devant la relaxation dans le puits ; cette approximation devient délicate près du seuil. Une impulsion rapide demande de résoudre la dynamique.
4. Comparer les barrières, les distributions des temps de premier passage et les probabilités P_ref(t) et P_A(t). La différence Delta P_B(t) = P_A(t) − P_ref(t) quantifie l'influence dans le modèle choisi. Répéter les trajectoires et donner l'incertitude statistique si une simulation stochastique est utilisée.
5. Vérifier les bilans, la rétroaction sur A et le médiateur, ainsi que la stabilité collective lorsque gradients et gravitation sont inclus. Un premier calcul avec J imposé est une approximation de forçage externe, pas la simulation autonome du système A/B.

**Acquis :** le seuil local et la variation de barrière avec J sont calculés. **À construire :** la source de J_fond, le médiateur causal et une dynamique de transition qui fournisse des taux. Ce cadre teste l'influence d'un domaine sur un autre déjà présent ; il ne démontre pas l'émergence d'un univers.
