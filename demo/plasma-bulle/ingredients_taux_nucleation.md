# Ce qui manque pour calculer un taux de nucléation

Note . Réponse à la question  sur l'absence actuelle de Γ. Cette note définit une extension calculable du modèle ; aucun taux numérique ou physique n'a encore été évalué.

## 1 Définir la quantité attendue

On réserve Γ à un taux de formation par unité de volume et par unité de temps. Un taux de sortie pour un germe ou un site potentiel de nucléation, noté k_sortie, a seulement les unités d'un temps inverse. Les deux ne peuvent pas être identifiés sans décrire le volume ou la population de sites.

L'événement doit être explicite. Franchir le maximum de l'énergie libre, atteindre le voisinage du minimum de bulle et y rester pendant une durée donnée sont des événements différents. Pour un premier calcul, on peut choisir le premier passage jusqu'à un rayon R_cible situé dans le bassin de la bulle. La stabilité ultérieure demandera un calcul séparé, avec les retours possibles.

## 2 Éléments disponibles et manquants

| Élément | Disponible dans notre travail | Complément nécessaire |
|---|---|---|
| Paysage d'énergie libre Φ(R) | Surface, avantage volumique et rétroaction finie | Identifier ses phases et justifier ses coefficients pour un plasma réel |
| Barrière | Rayon maximum R_b et hauteur calculés en unités réduites | Échelle d'énergie ou rapport à kBT |
| Mouvement radial | Relaxation déterministe choisie | Mobilité ou friction et leur domaine de validité |
| Fluctuations | Non simulées | Bain thermique et bruit, ou action quantique complète |
| Définition de la formation | Bassins d'attraction identifiés | Rayon cible, conditions aux limites, état initial et éventuelle durée de survie |
| Normalisation spatiale | Aucun ensemble de sites défini | Densité de sites indépendants, longueur de corrélation ou calcul spatial des champs |
| Gravitation | Analyse conceptuelle et critère de Jeans | Couplage cohérent, géométrie, contraintes et modification de la transition |

La construction d'un taux conditionnel n'exige pas d'avoir identifié le modèle à la nature. Elle exige de choisir et d'annoncer ces hypothèses. Une valeur en unités physiques demande ensuite de calibrer les échelles ; une prédiction cosmologique demande en plus de justifier les objets et les lois.

## 3 Première voie compatible avec le modèle actuel

Notre énergie libre est isotherme et sa dynamique dissipative. Une extension thermique serait donc une première voie cohérente, sous les hypothèses supplémentaires d'un bain markovien, d'une variable de rayon pertinente et d'une mobilité constante M_R > 0. Dans l'intérieur du domaine radial, elle prendrait la forme

\[
dR=-M_R\Phi'(R)\,dt+\sqrt{2M_R k_BT}\,dW_t.
\]

Le coefficient du bruit et la dissipation sont liés ; leur choix n'est pas indépendant à l'équilibre. Cette équation suppose une mesure de référence plate en R avec l'énergie libre correspondante. Une réduction réelle des champs peut produire une mesure, une mobilité ou un bruit dépendant de R : il faudrait alors reconstruire le processus et sa dérive correctement. [Hänggi, Talkner et Borkovec, 1990](https://doi.org/10.1103/RevModPhys.62.251).

La frontière R = 0 demande une condition. Une réflexion pourrait servir de convention pour un modèle exploratoire de première apparition. Elle constitue un choix supplémentaire, car la description de paroi mince est invalide à très petit rayon et ne résout pas les fluctuations microscopiques à l'origine des germes. Une absorption à un rayon R_cible > R_b permettrait de compter les premiers passages. Le même système sans absorption peut ensuite retourner vers de petits rayons : franchissement et persistance ne doivent pas être fusionnés.

Dans un régime de passages rares, une expression d'activation a schématiquement la forme

\[
\Gamma\simeq A_{\rm vol}\exp\left[-\frac{\Delta\Phi}{k_BT}\right].
\]

A_vol contient une échelle cinétique et une normalisation spatiale. La hauteur de barrière seule ne le détermine pas. L'état de référence à R = 0 est ici situé à une frontière ; appliquer sans adaptation un préfacteur de Kramers prévu pour un puits intérieur serait incorrect. Il est préférable de résoudre un problème de premier passage avec nos propres conditions aux limites.

## 4 Formulation calculable en unités réduites

Conservons E₀ = 4πσR_sn² et r = R/R_sn. Posons θ = kBT/E₀ et τ = M_R E₀ t/R_sn². À poussée réduite δ fixée,

\[
dr=-f'(r)\,d\tau+\sqrt{2\theta}\,dW_\tau,
\qquad f(r)=r^2-\frac89\delta r^3+\frac19r^6.
\]

Sous la convention d'une réflexion à r = 0 et d'une absorption en b > r_b, le temps moyen de premier passage m(r) satisfait l'équation rétrograde

\[
\theta m''(r)-f'(r)m'(r)=-1,\qquad m'(0)=0,\quad m(b)=0.
\]

Une intégration avec le facteur exp(−f/θ) donne, pour un départ à zéro,

\[
\boxed{m(0)=\frac1\theta\int_0^b dy\,e^{f(y)/\theta}
\int_0^y dz\,e^{-f(z)/\theta}.}
\]

Cette expression est exacte pour ce processus unidimensionnel postulé et ces frontières. Elle ne dépend pas de l'approximation d'une haute barrière. Elle peut être calculée par quadrature et contrôlée par résolution de l'équation rétrograde ou simulations de trajectoires avec une réflexion correctement traitée. Les calculs de premier passage avec frontières réfléchissante et absorbante sont des méthodes établies ; leur emploi pour ce rayon hypothétique est un choix de modèle. [Exemple de recherche sur les distributions de premier passage](https://pmc.ncbi.nlm.nih.gov/articles/PMC6749835/).

L'inverse 1/m(0) définit une échelle de sortie réduite. L'interpréter comme un taux constant de Poisson nécessite une séparation entre relaxation dans le bassin et sortie rare, ou une vérification de la loi de survie. Sinon, il faut conserver la distribution des temps et son taux instantané h(t) = −d ln S(t)/dt, où S(t) est la probabilité de ne pas avoir encore atteint la cible.

La conversion de temps est

\[
\langle t_{\rm passage}\rangle=\frac{R_{\rm sn}^2}{M_R E_0}m(0).
\]

Si l'on justifie une densité n_sites de sites indépendants identiques et des sorties rares, un taux volumique initial approché serait

\[
\Gamma\simeq n_{\rm sites}\frac{M_R E_0}{R_{\rm sn}^2m(0)}.
\]

Cette relation est une approximation de sites. Une théorie spatiale de nucléation homogène détermine la normalisation par les degrés de liberté et les fluctuations du champ ; elle n'obtient pas Γ en divisant arbitrairement un taux de rayon par le volume géométrique d'une bulle. La consommation du réservoir et les interactions entre événements rendraient ensuite Γ variable.

## 5 Ce que notre barrière apporte déjà

Pour δ = 1,2, la barrière depuis l'état sans bulle vaut ΔΦ/E₀ ≈ 0,138150. La dépendance d'activation serait donc exp(−0,138150/θ) dans le régime où l'approximation est applicable. Nous connaissons ce coefficient de barrière dans le modèle. Nous n'avons fixé ni θ, ni M_R, ni n_sites, ni le traitement physique de l'état sans bulle.

Le rayon minimum r_s ≈ 1,379520 peut être proposé comme première cible pour un calcul exploratoire, mais atteindre r_s ne garantit pas la survie. Une analyse de sensibilité à plusieurs cibles dans le même bassin permettra d'évaluer cette convention. Les coefficients devront d'abord être fixes ; si l'accumulation change δ pendant le passage, la formule stationnaire précédente ne suffit plus. Il faudra résoudre le problème dépendant du temps, ou vérifier une approximation quasi statique.

## 6 Ce qu'exigerait la voie quantique avec gravitation

Une nucléation de type Coleman-De Luccia suppose des états de champs et une action incluant les termes cinétiques, les gradients et la gravitation. Il faut identifier l'état métastable, résoudre la configuration euclidienne de transition avec des conditions aux limites compatibles, calculer une différence d'actions B et un préfacteur de fluctuations. Dans le régime semiclassique approprié, Γ prend schématiquement la forme A exp(−B/ℏ). [Coleman, 1977](https://doi.org/10.1103/PhysRevD.15.2929), [Coleman et De Luccia, 1980](https://doi.org/10.1103/PhysRevD.21.3305).

L'énergie libre de rayon actuellement disponible ne fournit pas cette action. Le remplacement de kBT par ℏ dans l'exponentielle thermique serait dimensionnellement et physiquement incorrect : ΔΦ est une énergie et B une action. La présence d'un plasma chaud peut également exiger un traitement à température finie. Le critère de Jeans ne détermine ni cette action ni un taux de nucléation.

## 7 Prochaine étape concrète

La suite la plus directe est un calcul de temps de premier passage en unités réduites : conserver le potentiel choisi à δ fixé, définir une frontière réfléchissante exploratoire et une cible dans le bassin, comparer plusieurs valeurs de θ, puis vérifier la distribution de survie et les retours. Il produira un taux de sortie conditionnel ou une distribution de temps. L'ajout de M_R et d'une normalisation spatiale justifiée permettra ensuite de passer à Γ.

Le rattachement de ce taux à un plasma autogravitant restera une étape distincte : identifier les phases, calculer l'équation d'état, les propriétés de l'interface, la dissipation, les fluctuations et la géométrie. La présente note ne fixe pas arbitrairement ces paramètres pour annoncer une probabilité cosmologique.

## 8 Complément bibliographique 

L'[analyse des trois références ajoutées](../bibliographie/baryogenese_nucleation_cpt.md) précise les dépendances de la suite du programme. Le premier passage radial reste la prochaine étape calculable ; un modèle spatial devra ensuite relier phase, profil de frontière et réservoir. Une histoire thermique donnera un sens à un critère d'apparition dépendant de la température.

L'étude d'un excès de matière sur l'antimatière demandera des populations et réactions distinctes du calcul de formation. Leur compatibilité avec la quantité conservée de notre réservoir doit être vérifiée. La branche CPT porte sur la métrique, les champs et l'état cosmologique ; le rapprochement bibliographique ne fournit pas Γ pour notre modèle. Voir les points 22–26 .
