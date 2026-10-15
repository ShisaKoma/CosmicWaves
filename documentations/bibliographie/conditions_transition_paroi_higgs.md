# Quand une paroi peut favoriser une nouvelle phase

Complément du 7 octobre 2026, intégré à l'étude à la demande de l'auteur. Il précise le mécanisme proposé dans la [note portail de Higgs et transport](portail_higgs_parois_transport.md), ses critères et le programme de vérification. La fenêtre ci-dessous est conditionnelle à notre potentiel ; elle ne définit pas une région déjà autorisée par les expériences.

## Mécanisme et fenêtre locale candidate

Dans notre convention H†H=h²/2, V_int=κΦ²h²/4. Pour κ>0, ce terme pénalise la présence simultanée de grandes amplitudes Φ et h. La paroi relie −w(T) à +w(T) et passe par Φ=0 au centre : la pénalité y diminue. Le cœur peut donc favoriser h≠0 avant le milieu environnant. Les deux domaines de signes opposés ont le même Φ² ; le couplage ne leur attribue pas automatiquement des masses différentes.

Dans notre approximation thermique quadratique :

\[
V_{\mathrm{eff}}(\Phi,h;T)=V_\Phi(\Phi;T)
+\frac12a(\Phi,T)h^2+\frac{\lambda_h}{4}h^4,
\qquad
a(\Phi,T)=-\mu_h^2+\Pi_h(T)+\frac{\kappa}{2}\Phi^2.
\]

Π_h(T)=c_hT² dans le module actuel. a est la courbure de l'énergie libre autour de h=0 à Φ fixé. Avec a<0 et λ_h>0, le minimum en h, en négligeant les gradients et la rétroaction sur Φ, satisfait h²=−a/λ_h. Cette estimation explique la tendance énergétique ; elle ne remplace pas la résolution spatiale. La convention du portail correspond à celle de [Friedlander et al.](https://arxiv.org/abs/2009.14295), mais nos coefficients thermiques restent prescrits.

Lorsque a_Φ(T)<0, les domaines de référence ont w(T)=√(−a_Φ(T)/λ_Φ). Pour favoriser h≠0 au centre tout en maintenant h=0 stable dans ce canal à l'extérieur :

\[
a_{\mathrm{centre}}=-\mu_h^2+\Pi_h(T)<0,
\qquad
a_{\mathrm{extérieur}}=-\mu_h^2+\Pi_h(T)+\frac{\kappa}{2}w(T)^2>0.
\]

La **fenêtre locale candidate**, obtenue avec notre normalisation, est donc :

\[
\boxed{0<\mu_h^2-\Pi_h(T)<\frac{\kappa}{2}w(T)^2.}
\]

Elle suppose κ>0, l'existence des domaines Φ et l'ansatz thermique retenu. Les bornes d'égalité demandent l'analyse des termes suivants. w, l'épaisseur et les corrections thermiques évoluent avec T : cette inégalité ne fixe pas une température universelle de transition.

## Du critère local à une transformation effective

Le gain au centre doit compenser l'énergie de gradient (∂_z h)²/2 et la déformation de Φ. Une zone favorable trop étroite peut ne pas déclencher une perturbation croissante. Pour la paroi initiale Φ₀(z)=w(T)tanh(z/ℓ), on examine donc :

\[
\left[-\partial_z^2+a(\Phi_0(z),T)\right]\delta h=\omega^2\delta h.
\]

Une plus petite valeur propre ω₀²<0 indique une perte de stabilité dans le canal h. Toutes les valeurs positives excluent cette instabilité linéaire dans ce canal, sans exclure d'autres canaux ou un passage par nucléation. Le seuil ω₀²=0 appelle une analyse non linéaire. Le [module du portail](../portail-higgs/README.md) calcule déjà ce spectre initial ; la stabilité complète du profil final reste ouverte.

Une configuration initiale stable peut aussi être quittée par une fluctuation franchissant une barrière. Il faut alors chercher un germe critique déformant les deux champs et calculer son coût relativement à la paroi préexistante. La distinction entre instabilité classique et nucléation favorisée par une paroi est étudiée par [Blasi et Mariotti](https://arxiv.org/abs/2203.16450). Notre spectre seul ne fournit aucun taux.

Une réponse h≠0 limitée au cœur ne prouve pas qu'une nouvelle phase envahit le volume. Comparer l'énergie libre et la stabilité des minima homogènes pertinents, y compris une phase mixte. Une phase plus basse peut fournir une poussée d'expansion, qui doit encore compenser les coûts d'interface et rencontrer une dynamique compatible. Dans la limite d'une bulle sphérique à interface mince, sans gravitation ni réservoir fini :

\[
\Delta F(R)=4\pi R^2\sigma_{\mathrm{interface}}
-\frac{4\pi}{3}R^3\Delta f,
\quad \Delta f=f_{\mathrm{parent}}-f_{\mathrm{nouveau}}>0,
\quad R_c=\frac{2\sigma_{\mathrm{interface}}}{\Delta f}.
\]

Cette référence ne s'applique pas automatiquement à un germe posé sur une paroi : sa géométrie et l'énergie de la portion de paroi remplacée changent le coût. σ_interface n'est pas nécessairement la tension de la paroi Φ initiale. Le réservoir fini de notre autre modèle et le foyer gravitationnel exigeraient leurs contributions propres.

Pour comparer des voies de nucléation, distinguer γ_V, par volume et par temps, de γ_A, par aire de paroi et par temps. Sur un protocole uniforme défini, les nombres moyens d'événements sont :

\[
\mathcal N_V=\int dt\,\gamma_V(T(t))\mathcal V(t),
\qquad
\mathcal N_A=\int dt\,\gamma_A(T(t))\mathcal A(t).
\]

Pour des conditions non uniformes, employer les intégrales spatiales correspondantes. Aire disponible, durée de vie des parois et histoire thermique déterminent la comparaison ; les taux bruts n'ont pas les mêmes unités. Une probabilité de Poisson demanderait ses hypothèses de validité.

## Témoins issus du calcul déjà enregistré

Les [résultats du portail](../portail-higgs/resultats/resultats.json), avec leur [configuration](../portail-higgs/configuration.json), donnent les valeurs suivantes. Aucun nouveau calcul du moteur n'est ajouté par cette note.

| T/E₀ | a_centre/E₀² | a_extérieur/E₀² | ω₀²/E₀², référence analytique | Diagnostic dans le canal h |
|---:|---:|---:|---:|---|
| 0,2 | −0,2040 | +0,0924 | −0,03007 | Paroi initiale instable ; réponse localisée obtenue |
| 0,4 | −0,1560 | +0,1296 | +0,01159 | Pas d'instabilité linéaire dans ce canal |
| 0,6 | −0,0760 | +0,1916 | +0,08103 | Pas d'instabilité linéaire dans ce canal |

Les trois températures satisfont la fenêtre locale candidate, mais seule la première donne une valeur propre négative. Les gradients changent donc effectivement le diagnostic local. Dans les trois cas, le minimum homogène Φ reste le plus bas parmi les candidats du potentiel fourni. Le calcul ne montre pas une phase envahissant le milieu ni une bulle en expansion. Les paramètres restent exploratoires et E₀ non calibrée.

## Compatibilité et protocole à construire

Les conditions suivantes doivent être vérifiées ensemble, avec un statut explicite pour chacune :

1. **Cohérence du potentiel.** Dans notre normalisation quartique, λ_Φ>0, λ_h>0 et κ>−2√(λ_Φλ_h) garantissent une quartique strictement positive dans les directions physiques non nulles. La branche κ≥0 du programme satisfait cette condition ; la borne d'égalité demande une analyse séparée. Vérifier aussi les minima, le vide pertinent et la validité perturbative ou du modèle effectif.
2. **Compatibilité expérimentale.** Fixer E₀, reproduire les propriétés mesurées du Higgs et confronter masses, mélanges et couplages aux observations et aux recherches de scalaires supplémentaires. Les exclusions dépendent des désintégrations et du modèle complet, notamment de ses hypothèses cosmologiques. Aucun intervalle autorisé n'est annoncé pour notre configuration.
3. **Accessibilité et durée.** Justifier la formation et la disparition des parois dans l'histoire thermique retenue ; comparer leur durée de vie à celle des perturbations et de la nucléation. Un profil tanh ne justifie pas à lui seul leur présence cosmologique.
4. **Bilan dynamique.** Calculer échanges champs–plasma, travail, transport et pertes avant de déterminer T(t). Une hausse de Π_h peut retarder la réponse du Higgs ; w(T) et ℓ(T) changent aussi. La baisse d'énergie libre de la relaxation numérique n'est pas une mesure de chauffage.

Construire ensuite une **carte température–couplage–épaisseur** en balayant les paramètres indépendants du potentiel. L'épaisseur est une sortie liée à λ_Φ et w(T) pour la paroi initiale ; elle ne doit pas être modifiée librement tout en gardant le même potentiel comme si le profil restait une solution.

Pour chaque point : existence et stabilité des domaines extérieurs ; courbures locales ; spectre initial ; profil couplé et stabilité finale ; ordre des minima homogènes ; sensibilité à la boîte et au maillage. Distinguer réponse localisée, instabilité, nucléation et croissance, qui peuvent se succéder dans une même histoire. Les critères exigeant un taux, une durée physique ou une confrontation expérimentale restent non déterminés tant que leurs ingrédients manquent.

Ce programme précise les points 22 et 23 . Le foyer gravitationnel avant la bulle et le rôle de l'alignement restent à construire dans la chaîne du postulat.
