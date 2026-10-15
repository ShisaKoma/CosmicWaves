# Paroi scalaire couplée au Higgs

Choix de recherche adopté  : tester un portail de Higgs pour relier notre champ de paroi Φ au milieu matériel. Le champ supplémentaire et son origine collective restent hypothétiques. Ce module prolonge la [référence parois–plasma](../parois-plasma/README.md) ; il ne modifie pas les règles des démonstrateurs géométriques.

## Exécution et sorties

```sh
python3 simulateur.py --portail-higgs
python3 simulateur.py --portail-higgs --config mon_portail.json --output output/mon-portail
python3 -m unittest discover -s output/simulateur -p 'test_*.py' -v
```

La bibliothèque standard suffit. Pour les figures scientifiques PNG/SVG, utiliser Matplotlib déjà présent dans cet espace de travail :

```sh
PYTHONPATH=tmp/plasma-python MPLCONFIGDIR=tmp/matplotlib python3 simulateur.py --portail-higgs --plot
```

[Rapport](resultats/rapport.html), [résultats JSON](resultats/resultats.json), [profils et masses CSV](resultats/profils.csv), [relaxation numérique CSV](resultats/relaxation.csv), [configuration](configuration.json). Chaque exécution conserve les paramètres, les contrôles et les empreintes du code et de la documentation.

## Potentiel et conventions

Avec deux champs canoniques, H†H=h²/2, en unités naturelles :

\[
V(\Phi,h;T)=\frac{a_\Phi(T)}2\Phi^2+\frac{\lambda_\Phi}4\Phi^4
+\frac{a_h(T)}2h^2+\frac{\lambda_h}4h^4+\frac{\kappa}4\Phi^2h^2,
\]

\[
a_\Phi(T)=-\lambda_\Phi v_\Phi^2+c_\Phi T^2,
\qquad a_h(T)=-\mu_h^2+c_hT^2.
\]

Notre convention est **V_int=κ Φ² H†H/2**, donc κ Φ²h²/4. Certains articles écrivent κ Φ²h²/2 : leur κ est alors la moitié du nôtre. La constante additive du potentiel de la référence Φ⁴ est omise ; les énergies de surface sont toujours calculées relativement au même état homogène.

Cette première branche exige λ_Φ>0, λ_h>0 et κ≥0 : le potentiel quartique est borné inférieurement. c_Φ et c_h sont positifs ou nuls. Les coefficients thermiques sont **prescrits dans un ansatz quadratique**, sans dérivation des boucles du plasma, resommation thermique, correction QCD ou contrôle de dépendance de jauge. Les nombres du fichier ne constituent pas un ajustement aux mesures du Higgs ni une région autorisée par les expériences. κ négatif et d'autres opérateurs demanderaient une extension avec leurs conditions de stabilité.

E₀ reste à fixer : champs, température et masses sont en E₀, z en E₀⁻¹, V en E₀⁴, énergie libre par aire en E₀³, valeurs propres de stabilité en E₀². Les températures 0,2, 0,4 et 0,6 sont des rapports T/E₀, pas des GeV ni des températures de nucléation.

## Champs couplés et conditions aux limites

Lorsque a_Φ<0, les domaines de référence ont v_Φ(T)=√(−a_Φ/λ_Φ). Le calcul cherche un profil plan stationnaire sur [−L,L] :

\[
\Phi''=a_\Phi\Phi+\lambda_\Phi\Phi^3+\frac\kappa2\Phi h^2,
\qquad h''=a_hh+\lambda_hh^3+\frac\kappa2\Phi^2h.
\]

Les bornes sont Φ(−L)=−v_Φ(T), Φ(L)=v_Φ(T), h(±L)=0. On initialise Φ par un kink tanh et h par une petite perturbation positive localisée. La rétroaction du Higgs sur Φ est incluse. Le solveur minimise l'énergie libre discrète avec diffusion implicite et recherche d'un pas qui la fait décroître ; il vérifie le résidu des deux équations. La parité du profil centre la paroi. Une convergence vers un point stationnaire n'établit pas la stabilité complète, l'unicité du minimum ou le résultat d'une collision.

\[
\frac{F_{\rm exc}}A=\int_{-L}^{L}dz\left[\frac12(\Phi'^2+h'^2)
+V(\Phi,h;T)-V(v_\Phi(T),0;T)\right].
\]

À température finie, il s'agit d'un **excès d'énergie libre par aire**. Il ne faut pas l'assimiler à une énergie interne libérée ou à une puissance de chauffage. Le paramètre de relaxation et ses itérations n'ont pas de signification temporelle physique.

Le calcul compare aussi les candidats homogènes origine, Φ seul, Higgs seul et phase mixte, et leurs courbures. Si a_Φ≥0, il signale l'absence de ces domaines ; si la courbure du Higgs dans le domaine Φ est négative ou nulle, il signale une instabilité dans tout le volume et ne présente pas le résultat comme une paroi localement modifiée. Si une autre phase est plus basse, la boîte à bornes fixées peut contenir une phase qui l'envahit ; le rapport de h près des bords à son maximum signale une influence possible de la taille de boîte. Ce diagnostic heuristique demande des comparaisons explicites de tailles.

## Stabilité de la paroi initiale : inclure les gradients

Pour h=0, Φ₀(z)=v_Φ(T)tanh(z/ℓ), ℓ=√(2/λ_Φ)/v_Φ(T). Une perturbation du Higgs satisfait le problème spectral :

\[
\mathcal L_h=-\partial_z^2+a_h+\frac\kappa2\Phi_0^2(z).
\]

Une valeur propre ω₀²<0 signifie que la paroi initiale est instable dans ce canal. a_h<0 au centre ne suffit pas : une perturbation localisée a aussi un coût de gradient. Ce n'est pas le calcul d'un franchissement de barrière.

Pour κ>0, le potentiel de Pöschl–Teller donne sur la droite infinie :

\[
\nu=\frac{\sqrt{1+4\kappa/\lambda_\Phi}-1}{2},\qquad
\omega_0^2=a_h+\frac\kappa2v_\Phi(T)^2-\frac{\nu^2}{\ell^2}.
\]

Le programme compare cette expression à la plus petite valeur propre de l'opérateur discrétisé, par bisection de Sturm. À κ=0, l'expression donne le bord du spectre continu ; la boîte possède un supplément π²/(2L)². Une boîte courte ou un mode très étendu peuvent expliquer une différence : on ne masque pas cette différence en la baptisant erreur de calcul.

Ce diagnostic concerne la **paroi initiale h=0**. La Hessienne couplée du profil final, les perturbations transverses et les modes de jauge restent à examiner. Aucun T_c ou T_n n'est annoncé : coexistence homogène, instabilité locale, nucléation et percolation sont des critères distincts.

Le [complément scientifique sur les critères de transition](../bibliographie/conditions_transition_paroi_higgs.md) dérive la fenêtre locale candidate 0<μ_h²−Π_h(T)<κv_Φ(T)²/2, distingue ce critère du diagnostic spectral et précise les conditions d'une croissance dans le milieu. Il propose une carte température–couplage–épaisseur issue des paramètres du potentiel, puis les vérifications nécessaires à une compatibilité physique et expérimentale.

## Masses et préparation du transport

Pour trois sondes : m_t²=y_t²h²/2, m_W²=g²h²/4 et m_Z²=(g²+g_Y²)h²/4. Leurs couplages sont des entrées. Ces colonnes donnent uniquement les **contributions du fond de Higgs aux masses**, pas la dispersion complète dans un plasma. Le module ne recalcule ni le comptage thermodynamique ni les populations du catalogue SM de l'autre mode. Si les excitations de Φ sont thermalisées, leur contribution au bain devra être ajoutée séparément.

Les CSV donnent aussi K_i(z)=−½∂z m_i². Dans l'approximation semi-classique d'une paroi épaisse, F_z=K_i/E_i. K_i seul n'est pas une force moyenne ou un taux d'échange. Il manque les distributions f_i et leurs corrections thermiques.

Le prolongement cinétique prévu est :

\[
\partial_t f_i+\frac{p_z}{E_i}\partial_z f_i
-\frac{\partial_zm_i^2}{2E_i}\partial_{p_z}f_i=C_i[f],
\]

avec les collisions, leurs réactions inverses et la rétroaction sur les deux champs. qg↔qg et gg↔q q̄ sont deux canaux QCD de départ ; une théorie cinétique complète dans le régime faiblement couplé peut aussi nécessiter des processus colinéaires effectifs. Aucun taux numérique n'est inventé. À l'équilibre, une paroi statique ne chauffe pas continuellement le bain. La puissance de transfert, les taux et T_n restent **null dans les exports, au sens « non calculé »**, et non zéro.

Le bilan futur devra fermer l'énergie-impulsion totale champs + plasma, en comptant l'énergie d'interaction une seule fois. Le potentiel thermique d'équilibre et les corrections hors équilibre devront être organisés pour éviter un double comptage. Une masse locale, une force de gradient et une attraction gravitationnelle sont trois objets différents.

## Résultat exploratoire de la configuration fournie

À T/E₀=0,2, ω₀²/E₀²≈−0,03007 : le profil h=0 est instable ; la relaxation donne h(0)/E₀≈0,8302 et un excès d'énergie libre par aire ≈0,62542 E₀³. À 0,4 et 0,6, le diagnostic est positif et h revient près de zéro à la précision du solveur, même si la courbure locale au centre est négative.

Dans les trois cas, la phase homogène Φ reste la plus basse du potentiel choisi. Le premier résultat décrit donc une réponse localisée au cœur de la paroi, **sans démontrer une nouvelle phase qui remplit le volume ou une bulle**. Le jeu de paramètres illustre un mécanisme et ses témoins ; il ne constitue pas une prédiction cosmologique.

## Références

- [Blasi et Mariotti, 2203.16450](https://arxiv.org/abs/2203.16450) : parois favorisant une transition, instabilité et nucléation. Les normalisations sont adaptées explicitement ci-dessus.
- [Friedlander et al., 2009.14295](https://arxiv.org/abs/2009.14295) : profils, friction et vitesse calculés ensemble avec le transport ; ce niveau cinétique reste à implémenter.
- [Arnold, Moore et Yaffe, hep-ph/0209353](https://arxiv.org/abs/hep-ph/0209353) : théorie cinétique du plasma chaud dans son domaine de validité.
- [Morrissey et Ramsey-Musolf, 1206.2942](https://arxiv.org/abs/1206.2942) : phases, sources et effacement en baryogenèse électrofaible.

La [note d'intégration scientifique](../bibliographie/portail_higgs_parois_transport.md) situe ce choix dans le postulat et les prochaines étapes.
