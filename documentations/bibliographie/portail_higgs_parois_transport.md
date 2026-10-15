# Portail de Higgs : choix de couplage et programme de transport

Le 7 octobre 2026, l'auteur adopte l'exploration d'une paroi scalaire couplée au Higgs et demande son ajout aux documents et à la simulation. Le choix est enregistré comme hypothèse de travail. La présence du Higgs et du plasma matériel ne prouve pas celle du champ Φ, ni sa composition collective.

## Correspondance avec les recherches

Le portail V_int=κΦ²H†H/2 respecte les symétries de jauge du Modèle standard et la symétrie Φ→−Φ. Il conserve la possibilité de deux domaines de signes opposés et donne une action explicite de Φ sur le secteur de Higgs. Les valeurs +Φ et −Φ ayant le même carré, le changement des masses peut être localisé au cœur de la paroi. Le signe et les paramètres déterminent la réponse ; cette première branche du simulateur explore κ≥0.

Blasi et Mariotti étudient un singlet scalaire avec des parois préexistantes capables de favoriser une transition ultérieure. Ils distinguent une instabilité classique et un passage par nucléation. Cette distinction fournit un lien utile avec la « rupture » proposée, sans identifier d'avance les deux mécanismes. [2203.16450](https://arxiv.org/abs/2203.16450).

Friedlander et al. calculent ensemble les profils, la friction et la vitesse de parois dans un modèle singlet–Higgs. Ce travail indique comment passer d'un potentiel aux échanges avec les particules via des équations de transport. [2009.14295](https://arxiv.org/abs/2009.14295).

Arnold, Moore et Yaffe fournissent un cadre cinétique pour les théories de jauge chaudes faiblement couplées. Les collisions, les réactions inverses et les processus colinéaires effectifs conditionnent les transferts et la thermalisation ; deux réactions dessinées ne suffisent pas à produire tous les coefficients. [hep-ph/0209353](https://arxiv.org/abs/hep-ph/0209353).

La QCD reste essentielle pour la soupe, mais le crossover calculé aux masses physiques et à potentiel chimique baryonique nul ne fournit pas de lui-même une interface de coexistence de premier ordre. Les régimes denses exigent une analyse spécifique. [Aoki et al.](https://arxiv.org/abs/hep-lat/0611014).

## Ajout effectif au simulateur

Le [mode `--portail-higgs`](../portail-higgs/README.md) résout les équations statiques couplées de Φ et h à température prescrite, compare les phases homogènes, mesure l'excès d'énergie libre de la configuration et calcule les contributions du Higgs aux masses top/W/Z. Il examine la stabilité linéaire de la paroi initiale dans le canal h avec les gradients inclus, puis prépare le coefficient de force semi-classique dans les exports.

Le potentiel thermique est un ansatz quadratique dont les coefficients sont des entrées exploratoires. La relaxation est un algorithme d'optimisation, pas un processus de thermalisation. La puissance transmise, les taux et la température de nucléation ne sont pas calculés. Le catalogue de charges et le bain idéal du mode précédent restent des références ; ils ne deviennent pas automatiquement un plasma massif en évolution.

## Conditions pour favoriser une nouvelle phase

Le [complément sur les critères de transition](conditions_transition_paroi_higgs.md), intégré à la demande de l'auteur le 7 octobre 2026, dérive la fenêtre locale candidate 0<μ_h²−Π_h(T)<κw(T)²/2 et la distingue de la stabilité avec gradients. Il confronte ces critères aux résultats enregistrés, précise les conditions d'une nucléation et d'une croissance dans le milieu, puis définit une carte température–couplage–épaisseur et les vérifications de compatibilité. Les paramètres exploratoires actuels ne constituent pas une région expérimentalement autorisée.

## Prochains calculs nécessaires

1. Fixer E₀, identifier le champ effectif et confronter les couplages aux contraintes expérimentales. Si Φ est composite, justifier la cinétique et le domaine de validité de la description scalaire.
2. Construire le potentiel thermique avec un schéma cohérent, vérifier les minima, la coexistence et la stabilité complète des profils. Comparer tailles de boîte et maillages.
3. Ajouter les distributions des espèces sensibles au Higgs, puis les collisions avec le bain QCD et électrofaible. Calculer leurs taux dans le régime choisi, notamment réactions directes et inverses ; ne pas remplacer une population par une masse locale.
4. Fermer les bilans d'énergie-impulsion et déterminer la friction, la vitesse et le chauffage avec rétroaction. Ne pas additionner sans précaution un potentiel thermique et les mêmes contributions d'équilibre dans les distributions.
5. Rechercher une configuration critique et un taux lorsque le mécanisme est une nucléation ; suivre une instabilité dynamique lorsque la barrière n'est plus pertinente. Comparer coexistence, apparition locale, premier passage et fraction transformée.

La leptogenèse, la violation CP et l'effacement exigent ensuite leurs interactions supplémentaires ; le portail réel ajouté ne génère pas une asymétrie matière–antimatière. Le cadre CPT demeure une comparaison globale, sans fournir ce taux local.

Le foyer gravitationnel **avant la bulle**, le rôle de l'alignement et la rupture formatrice restent les mécanismes du postulat à construire. Une réponse du Higgs au cœur d'une paroi n'établit ni cette gravitation, ni un espace-temps nouveau.
