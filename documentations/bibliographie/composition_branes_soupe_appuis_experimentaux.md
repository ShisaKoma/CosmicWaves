# Composition des branes et de la soupe : modèles et appuis expérimentaux

Note du 7 octobre 2026. L'auteur demande d'identifier de quoi pourraient être composés les branes et le milieu parent, et de rechercher des pistes déjà vérifiées scientifiquement. Cette note distingue résultats expérimentaux, descriptions théoriques et propositions pour le projet. Elle complète le [postulat précisé](convergence_chauffage_mecanismes.md).

**Choix adopté ensuite par l'auteur le même jour :** représenter les branes par des parois de champs et inclure quarks, antiquarks et gluons dans une soupe plus complète. Les autres possibilités ci-dessous restent des comparaisons. Le [premier module de calcul](../parois-plasma/README.md) fournit une paroi scalaire phénoménologique, un catalogue de charges et un bain idéal ; le champ collectif et les interactions de la soupe ne sont pas encore dérivés.

**Couplage adopté ensuite :** le [portail de Higgs](portail_higgs_parois_transport.md) relie le champ Φ au Higgs par un terme explicite. Le simulateur calcule les profils statiques et leur diagnostic initial de stabilité ; l'origine microscopique de Φ et les transferts par transport restent ouverts.

## 1 Une composition commune est possible, mais pas encore identifiée

Une brane n'est pas nécessairement un assemblage d'une matière différente de celle du milieu. Une description possible est une configuration collective de champs : le même milieu porte une phase, des excitations et des interfaces entre phases. Une paroi possède alors une épaisseur, un profil, une énergie et une tension issus de ces champs et de leurs interactions.

Une analogie concrète est une paroi entre régions de magnétisation différentes : ce qui change est l'organisation du milieu. Cette analogie aide à formuler le calcul, mais n'identifie pas notre soupe à un matériau magnétique.

| Option à examiner | Description des « branes » | Description de la soupe | Statut et limite |
|---|---|---|---|
| Branes de théorie des cordes | Objets étendus avec tension, charges et degrés de liberté propres ; pour des D-branes, extrémités de cordes ouvertes | Champs et excitations du fond, éventuellement plusieurs secteurs | Cadre théorique ; aucune composition de notre milieu n'en découle et aucune brane fondamentale n'est identifiée expérimentalement |
| Parois de champs | Profil spatial entre états distincts d'un ou plusieurs champs ; énergie de gradient et de potentiel | Ces champs, leurs excitations et un bain matériel couplé | Modèle calculable de soliton/interface ; sa réalisation cosmologique et ses couplages restent hypothétiques |
| Interfaces dans un milieu collectif | Frontières entre phases ou états d'un condensat/superfluide | Constituants et excitations du milieu | Certaines interfaces et transitions sont observées en laboratoire ; leur extrapolation cosmologique exige une correspondance supplémentaire |

Les constructions de solitons avec propriétés de branes existent en théorie des champs. Elles permettent de poser une question de dynamique sans adopter un scénario ekpyrotique, mais elles ne constituent pas une découverte de branes cosmologiques. [David Tong, constructions en théorie des champs](https://www.damtp.cam.ac.uk/user/tong/talks/caqcd.pdf). Pour les signatures de cadres avec dimensions supplémentaires, le [Particle Data Group](https://pdg.lbl.gov/2025/reviews/rpp2025-rev-extra-dimensions.pdf) rapporte des recherches et des contraintes dépendant des modèles ; celles-ci ne déterminent pas la composition de notre soupe.

## 2 Compositions candidates du milieu parent

**Rayonnement et plasma de particules connues.** Un premier bain réduit pourrait contenir photons, électrons et positrons. Il dispose de réactions connues de production/annihilation et de transport ; d'autres espèces seraient ajoutées lorsque leurs masses, températures et couplages le demandent. La présence de ce bain dans le milieu parent est une hypothèse du projet, même si ses constituants et certaines de leurs réactions sont établis. Ce choix ne fournit pas à lui seul les parois.

**Matière en interaction forte.** Un plasma de quarks, antiquarks et gluons fournit une autre composition matérielle étudiée dans les collisions d'ions lourds. Les mesures d'ALICE caractérisent un milieu collectif chaud et dense. Cela justifie de travailler avec une équation d'état et des coefficients de transport physiques, sans identifier le plasma produit au LHC à un milieu parent cosmologique ni supposer automatiquement une transition à bulles dans chaque régime. [ALICE, synthèse des résultats](https://alice-collaboration.web.cern.ch/ReviewPaper).

**Champs cohérents et excitations.** Une soupe pourrait être décrite comme un ensemble de champs avec des configurations collectives, plutôt que comme un gaz initial de particules bien définies. Pour rendre ce choix physique, spécifier les champs, leurs interactions et les conditions dans lesquelles leurs excitations peuvent être interprétées comme particules. Un nouveau champ scalaire, un axion ou un secteur caché demeure une hypothèse supplémentaire tant qu'il n'est pas identifié ; le mot « boson » ne fixe ni son potentiel ni ses couplages.

La composition ne suffit pas à garantir le scénario complet. Il faut aussi une dynamique d'organisation, un couplage gravitationnel, des canaux de conversion d'énergie et une rupture produisant effectivement une frontière.

## 3 Mécanismes observés qui peuvent guider des calculs

### E1 — Bulles de phase dans un superfluide atomique

Zenesini et al., *False vacuum decay via bubble formation in ferromagnetic superfluids*, Nature Physics 20, 558–563 (2024), observent une nucléation de domaines dans un gaz de sodium 23 à deux états internes cohérents. Une description par un champ collectif, des barrières et des parois permet de comparer expérience et simulations. Le régime étudié est dominé par l'activation thermique ; il ne s'agit pas d'une observation de la désintégration du vide cosmologique. Le système est allongé et la dynamique étudiée essentiellement unidimensionnelle. [Article expérimental](https://www.nature.com/articles/s41567-023-02345-4).

**Usage proposé :** construire un témoin physique pour nucléation, paroi et distribution des délais ; vérifier les unités, le bruit et les conditions d'observation. L'expérience ne démontre pas une bulle 3D stable, un foyer gravitationnel issu de branes ou une création d'univers. Dans ce milieu, « faux vide » et « vrai vide » désignent des états du système atomique.

### E2 — Production de photons par une frontière modulée

Wilson et al., *Observation of the dynamical Casimir effect in a superconducting circuit*, Nature 479, 376–379 (2011), observent des photons dans un circuit dont la longueur électrique effective est rapidement modulée. Il s'agit d'une frontière électromagnétique contrôlée, pas d'une brane cosmique ou d'un miroir matériel déplacé mécaniquement à vitesse relativiste. La modulation apporte l'énergie. [Article expérimental](https://www.nature.com/articles/nature10561).

**Usage proposé :** examiner comment une frontière ou un fond variant dans le temps excite un champ couplé. Une loi de couplage doit être dérivée pour les branes du projet ; ce résultat ne produit pas directement une asymétrie baryonique ni des paires électron–positron.

### E3 — Conversion en paires électron–positron

Burke et al., *Positron Production in Multiphoton Light-by-Light Scattering*, Physical Review Letters 79, 1626–1629 (1997), observent des positrons dans l'expérience E144 au SLAC. Le mécanisme décrit comporte deux étapes : un faisceau d'électrons produit des photons de haute énergie par interaction avec le laser, puis ces photons interagissent avec plusieurs photons du laser pour créer des paires. [Article expérimental](https://doi.org/10.1103/PhysRevLett.79.1626).

**Usage proposé :** prendre un canal réellement mesuré comme référence pour la conversion d'énergie en matière et antimatière. Une cascade dans notre milieu exige ses propres distributions, sections efficaces, réactions inverses et bilan ; l'énergie disponible alimente la production. L'observation de ce canal ne démontre pas une cascade autoentretenue dans la soupe, ni un excès de matière.

## 4 Calculer le foyer gravitationnel au lieu de le supposer

Le postulat place l'attraction avant la formation de la bulle. Une composition et une géométrie particulières doivent donc donner un contenu énergie-impulsion et une réponse gravitationnelle calculables.

La tension des objets étendus compte autant que leur densité énergétique. Certains modèles relativistes de parois possèdent une gravitation répulsive dans certains régimes ; on ne peut pas remplacer toutes les parois par des masses ponctuelles attirantes. Ce contre-exemple théorique ne rejette pas notre proposition d'alignement collectif : il montre que le signe et l'amplitude de la réponse sont un résultat du calcul, et non une propriété garantie par le mot « brane ». [Deng, Garriga et Vilenkin, exemple de dynamique gravitationnelle de parois](https://arxiv.org/abs/1612.03753).

Comparer des configurations alignées et désalignées avec énergie initiale contrôlée permettrait de déterminer si l'organisation produit une concentration attractive, sans la programmer comme conséquence de l'alignement. La pression et les flux peuvent aussi disperser le contenu ; leur dynamique doit répondre à l'énergie convertie en particules.

## 5 Premier modèle retenu et correspondances restantes

Le choix général retenu est : **parois comme configurations de champs + milieu incluant quarks/antiquarks/gluons et autres champs nécessaires + échanges énergétiques + gravitation**. Les parois et leur couplage au bain demeurent les hypothèses physiques à construire ; les réactions connues apportent des contrôles, pas une validation de toute la construction. Le potentiel scalaire simple du premier module reste une proposition phénoménologique et n'identifie pas encore le constituant physique de la paroi.

Deux travaux peuvent avancer séparément :

1. Un témoin de nucléation et de parois inspiré d'E1, pour contrôler le solveur dans un milieu où ces objets sont observés.
2. Un modèle de formation locale fidèle au postulat : champs de branes, foyer calculé, agglomération, conversion en paires, puis critère de rupture. E2 et E3 servent de repères pour certains transferts ; leurs paramètres ne sont pas copiés dans ce modèle sans correspondance.

Avant de coupler les moteurs, établir pour chaque espèce ou champ : masse, charge, énergie, interactions, état initial, mobilité/transport et rôle dans l'interface. Le catalogue du premier module recense charges et degrés internes dans une référence idéale ; masses et seuils physiques restent à ajouter. Pour chaque interaction : énergie et charges conservées, taux, réactions inverses et domaine de validité. Le [dictionnaire et la TODO](../../TODO_SIMULATEURS.md) recueillent ces dépendances.

La proposition est calculable lorsque ces choix sont définis. Sa plausibilité physique reste à évaluer par ses bilans, sa dynamique et ses conséquences ; aucune validation expérimentale de la chaîne complète n'est annoncée.
