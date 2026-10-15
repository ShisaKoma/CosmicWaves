# Nucléation, asymétrie matière-antimatière et symétrie CPT

Note du 7 octobre 2026. Lecture ciblée des trois références proposées par l'auteur, destinée à préciser les analyses et les prochains calculs. Les observations et limites expérimentales rapportées dans ces articles sont celles de leur époque ; cette note n'en fait pas une actualisation à 2026. Aucun nouveau résultat numérique n'est annoncé.

## 1 Références et portée

| Référence | Sujet | Utilité pour le projet |
|---|---|---|
| Chee Sheng Fong, Enrico Nardi et Antonio Riotto, *Leptogenesis in the Universe*, Advances in High Energy Physics 2012, 158303 ; dépôt arXiv en 2013 | Production et effacement d'une asymétrie leptonique | Définir un éventuel module de composition et d'asymétries |
| David E. Morrissey et Michael J. Ramsey-Musolf, *Electroweak baryogenesis*, New Journal of Physics 14, 125003 (2012) | Transition, bulles et transport près de leurs parois | Comparer notre nucléation à un mécanisme de transition de phase explicite |
| Latham Boyle, Kieran Finn et Neil Turok, *CPT-Symmetric Universe*, Physical Review Letters 121, 251301 (2018) | État cosmologique global et neutrinos | Examiner une autre hypothèse sur la géométrie, le temps et les conditions initiales |

Les PDF sources sont conservés sans modification dans [sources](sources/), avec leurs empreintes et les passages consultés dans le [registre bibliographique](references.json).

### R1 — Leptogenèse

La revue décrit la génération d'une asymétrie leptonique par des neutrinos lourds, puis sa conversion partielle en asymétrie baryonique par les processus électrofaibles. Les conditions de Sakharov et les termes de production/effacement sont centraux. Le système simplifié à une saveur suit l'abondance du neutrino et l'asymétrie leptonique ; ses coefficients dépendent des réactions et du régime thermique. Passages retenus : sections 1.1.2 et 1.2.1–1.2.4, notamment équations (1.18)–(1.23) et (1.29)–(1.30). [Article et PDF](https://arxiv.org/abs/1301.3062).

### R2 — Baryogenèse électrofaible

La revue relie une transition de premier ordre à des bulles, puis à la diffusion et aux réactions près de leurs parois. Elle distingue température de coexistence et température de nucléation, et examine profil, vitesse, friction et effacement de l'asymétrie. Elle souligne les limites du critère usuel φc/Tc et sa dépendance de jauge. Passages retenus : introduction et figure 2 ; section 2, figure 3 et équations (15)–(21) ; section 3, équations (28)–(35). [Article et PDF](https://arxiv.org/abs/1206.2942).

### R3 — Univers symétrique sous CPT

Les auteurs proposent des branches avant/après le Big Bang liées par CPT, sur un fond FRW plat dominé par le rayonnement. Un neutrino droit stable sert de candidat à la matière noire ; les deux autres peuvent participer à la leptogenèse. Le texte étudie la sélection du vide et des modes de perturbation, et laisse un traitement plus complet de la singularité ouvert. Passages retenus : équation (1), sections *CPT invariant vacuum*, *Dark matter*, *Other predictions* et *Discussion*. [Article publié](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.121.251301).

## 2 Questions distinctes à garder dans nos analyses

Notre problème immédiat est la formation d'un domaine à partir d'un milieu parent. La baryogenèse concerne un autre résultat : une différence nette entre matière et antimatière. La cosmologie CPT pose encore une autre question : les symétries et l'état global de l'espace-temps.

| Question du projet | Résultat à calculer | État actuel |
|---|---|---|
| Une configuration nouvelle se forme-t-elle ? | Événements de formation, distribution des temps ou taux de nucléation | Bulle : barrière et bassins ; taux non calculé |
| Le domaine résiste-t-il après formation ? | Retours, fuites, ruptures et distribution des durées | Relaxation radiale et diagnostics géométriques partiels |
| Existe-t-il un excès net de matière ? | Densités de particules/antiparticules et asymétries de charges | Composition et réactions non définies |
| Quelle histoire cosmologique en résulte ? | Géométrie, énergie, expansion, température et perturbations | Modules séparés et interprétation ouverte |

Cette séparation est notre choix de méthode. Un même mécanisme pourrait relier plusieurs lignes, mais il faudrait alors dériver ses échanges et ses conséquences. Les couleurs, le partage de capture 50/50 et le nombre de constituants de nos démonstrateurs ne sont pas des mesures d'une asymétrie baryonique.

## 3 Conséquences proposées pour notre nucléation

Les points ci-dessous sont des prolongements de notre modèle, à construire ; ils ne sont pas des résultats obtenus dans les trois articles pour notre scénario.

### Définir ce qui change de phase

Choisir un champ local φ, ses deux états et une énergie libre dépendant des contrôles physiques. Préciser si φ décrit une phase matérielle, une organisation des surfaces ou une autre propriété. Une identification au Higgs ou à une brane demanderait une justification supplémentaire. Le q du modèle entropique, la concentration effective du modèle de bulle et φ ne deviennent pas interchangeables par notation.

### Passer du rayon au profil

Construire d'abord un champ radial avec un coût des gradients, puis rechercher une configuration critique. L'épaisseur de la frontière, sa tension et la barrière devront découler du même modèle. Comparer ensuite ce calcul aux extrema de notre énergie Φ(R) dans le régime où une interface mince est une approximation contrôlée. Notre minimum de bulle à rayon fini peut limiter la croissance : une transition qui finit par remplir tout le milieu n'est donc pas une issue automatique de nos équations.

### Définir l'histoire thermique et le critère d'apparition

Une température constante et une poussée δ variable suffisent à un premier calcul exploratoire de passage. Une température de nucléation demande en plus une trajectoire T(t), un milieu et une fenêtre d'observation. Enregistrer séparément coexistence énergétique, perte éventuelle de métastabilité, premier passage et fraction transformée. Si un bain est supposé avant formation, identifier ce bain sans utiliser rétroactivement un plasma qui n'apparaîtrait qu'après elle.

Pour un taux volumique γ_nuc défini et une hypothèse de Poisson adéquate, le nombre attendu dans un volume physique suivi est

\[
\mathcal N(t)=\int_{t_0}^{t}\gamma_{\rm nuc}(t')V_{\rm phys}(t')\,dt',
\qquad P_{\geq1}=1-e^{-\mathcal N}.
\]

Cette expression prolonge le calcul à taux constant déjà présent dans le simulateur. Elle ne donne ni γ_nuc ni la fraction transformée. Les corrélations, les recouvrements et la consommation du réservoir doivent être traités lorsqu'ils rendent l'approximation inadaptée. Un taux par volume et par temps ne se compare pas directement à H, qui a les unités d'un temps inverse. Dans un contexte cosmologique relativiste et en unités naturelles, γ_nuc/H⁴ fournit un diagnostic de nombre d'événements dans un volume et un temps de l'ordre de ceux de Hubble ; le critère effectif doit rester lié au protocole choisi.

### Séparer les taux et leurs unités

Employer γ_nuc pour une formation par volume et par temps, k_sortie pour un passage individuel, k_réaction pour un taux de réaction par particule, et H pour l'expansion. Une barrière, un taux de réaction et une fréquence empirique de fermeture ne sont pas trois estimations d'une même quantité.

## 4 Un éventuel module d'asymétries

Nous proposons une branche de travail après définition de la composition et de l'histoire thermique : suivre les abondances, les charges nettes, leurs sources et leurs pertes. Annoncer séparément la rétention géométrique, la survie des particules et la conservation d'une asymétrie.

Avant d'utiliser des abondances rapportées à l'entropie, vérifier le bilan d'entropie. Une injection ou un réchauffage peut empêcher d'éliminer simplement l'effet de l'expansion. Dans un premier prototype, les fonctions de production et d'effacement pourraient être des entrées phénoménologiques affichées comme telles ; une identification à la leptogenèse demanderait masses, couplages et réactions compatibles.

Tests à prévoir pour un tel prototype : absence de source et asymétrie initiale nulle ; effacement seul ; changement du signe de la source ; limite de réaction lente/rapide ; variation des conditions initiales et contrôle de convergence. Une source ajoutée à la main permet de tester le solveur, sans prédire l'origine physique de l'asymétrie.

Deux chemins de baryogenèse pourraient être comparés : transport près d'une frontière mobile, ou réactions de populations dans un milieu. Ils peuvent se compléter à des instants ou dans des régions différents, sous réserve d'une théorie commune et d'une comptabilité des réactions et de l'effacement. Le [complément sur la convergence et l'échauffement](convergence_chauffage_mecanismes.md) précise cette possibilité et présente la leptogenèse assistée par bulles comme exemple de lien entre transition et production d'asymétrie.

## 5 Réexaminer la quantité conservée du réservoir

Notre stabilisation en R⁶ suppose une ressource conservée et une réponse finie. Si le futur module comporte des réactions qui modifient cette ressource, son élimination comme contrainte fixe peut devenir incohérente. C'est une implication à vérifier pour notre construction, et non une réfutation de tous les modèles à réservoir fini.

Identifier la charge exacte ou approximative ; comparer son temps de variation à ceux de formation et de relaxation ; inclure un bilan dynamique lorsqu'elle évolue. Ne pas supposer qu'une « quantité de particules », une charge baryonique, une charge leptonique et l'énergie jouent le même rôle. Vérifier aussi que les phases diffèrent effectivement pour la ressource choisie.

## 6 Place de l'hypothèse CPT

Nous retenons R3 comme comparaison pour la structure temporelle et les conditions initiales. Il faut distinguer une symétrie des lois, une symétrie de l'état complet et une symétrie apparente d'une seule région. Une dissymétrie locale ne permet pas, à elle seule, de statuer sur l'état global.

Pour appliquer ce programme à notre hypothèse, il faudrait définir une métrique, une transformation CPT des champs et de leur état, puis des contraintes compatibles sur les données initiales. Copier deux domaines avec des charges opposées ou inverser un compteur de temps dans l'automate ne satisfait pas ces exigences. Le rapprochement ne fournit pas une loi de création locale de domaine ni le taux manquant.

Si nous explorons simultanément la branche CPT et un mécanisme de leptogenèse, distinguer explicitement les espèces stables et instables. L'espèce rendue stable dans la première branche ne peut pas être utilisée comme population se désintégrant dans la seconde sous les mêmes hypothèses. Cela demande une correspondance de champs et de couplages, avec des tests de compatibilité.

## 7 Décisions et ordre de travail

1. Garder le premier passage radial comme étape calculable immédiate, sous ses hypothèses exploratoires.
2. Construire le potentiel spatial et le profil de frontière, avec un bilan cohérent et un réservoir identifié.
3. Ajouter une histoire thermique, puis mesurer formation, fraction transformée et persistance avec des événements distincts.
4. Définir un module de populations et d'asymétries si une composition physique a été choisie.
5. Examiner la branche CPT lorsque métrique, champs et état permettent de formuler ses contraintes.

