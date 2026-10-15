# Convergence, échauffement et mécanismes d'asymétrie

Note du 7 octobre 2026, en réponse aux propositions de l'auteur. Les calculs ci-dessous sont des conséquences d'équations d'état idéales sous hypothèses explicites. Ils ne calibrent ni les branes ni le plasma du projet. Les rapprochements bibliographiques indiquent des mécanismes à tester, sans démontrer leur compatibilité globale.

## 0 Postulat précisé : une soupe cosmique et des formations locales de bulles

**Clarification de l'auteur du 7 octobre 2026.** Le milieu parent est envisagé comme une « soupe cosmique ». L'alignement local des branes dans une certaine géométrie ferait apparaître un foyer gravitationnel, qui agglomérerait cette soupe. La concentration et les transferts d'énergie alimenteraient une production de matière et d'antimatière par un effet de chaîne. Une rupture de la configuration concentrée conduirait à la formation d'une bulle. Plusieurs formations locales pourraient se produire dans le même milieu parent.

La chaîne proposée est donc :

```text
Soupe cosmique préexistante
          ↓
Alignement local des branes dans une géométrie particulière
          ↓
Apparition ou renforcement d'un foyer gravitationnel
          ↓
Agglomération de la soupe et concentration d'énergie
          ↕
Production de matière/antimatière et réactions en chaîne
          ↓
Rupture de la configuration concentrée
          ↓
Formation d'une bulle, puis évolution de son contenu et de sa frontière
```

Chaque flèche reste une hypothèse de mécanisme à calculer. L'attraction intervient ici **avant la formation de la bulle** et participe à son alimentation. Le rôle gravitationnel éventuel du milieu parent reste ouvert ; cette clarification ne suppose pas que toute gravitation serait absente hors des foyers.

**Correction de la comparaison ekpyrotique.** Le scénario original de Khoury et al. produit une phase de Big Bang chaud par la collision d'une brane avec une frontière de l'espace supplémentaire, à partir d'un état froid et presque vide. L'auteur propose ici des formations locales dans une soupe, avec alignement, agrégation gravitationnelle et rupture. La référence ekpyrotique est donc une comparaison distincte, et non le cadre adopté pour le projet. La seule présence de branes ne suffit pas à identifier les deux scénarios. [Article original](https://arxiv.org/abs/hep-th/0103239).

Trois précisions permettent de conserver le postulat sans lui attribuer un résultat déjà démontré :

1. **Alignement → gravitation.** Définir comment la géométrie des branes modifie leurs tensions, interactions et énergie-impulsion, puis calculer la réponse du milieu et de la métrique. En relativité générale, une orientation dessinée ne donne pas à elle seule une loi d'attraction ; le contenu énergétique, les contraintes et les conditions aux limites interviennent. Une autre loi gravitationnelle effective serait une hypothèse supplémentaire à formuler. [Équations d'Einstein, David Tong](https://www.damtp.cam.ac.uk/user/tong/gr/grhtml/S4.html).
2. **Effet de chaîne → production.** Identifier les canaux qui convertissent l'énergie disponible en particules et antiparticules, leurs taux, les réactions inverses et leurs effets sur pression, transport et gravitation. Une cascade peut multiplier les particules en consommant l'énergie disponible ; elle ne fournit pas une énergie nouvelle à chaque étape. La production de paires se distingue de la création d'un excès de matière : la leptogenèse et la baryogenèse restent des branches conditionnelles pour ce second résultat. [Plasma et paires, David Tong](https://www.damtp.cam.ac.uk/user/tong/cosmo/cosmohtml/S2.html), [production et thermalisation, Allahverdi et al.](https://arxiv.org/abs/1001.2600).
3. **Concentration → rupture → bulle.** Définir la grandeur qui atteint le seuil et la configuration qui se rompt. « Toute l'énergie concentrée en un point » est conservé comme image du postulat ; le calcul devra préciser l'énergie concernée, la taille de la zone et sa densité, plutôt que poser d'emblée un point de volume nul. La rupture pourrait désigner une instabilité mécanique, un changement de connectivité ou une transition de phase ; aucune de ces identifications n'est adoptée sans dynamique. La formation à la rupture se distingue de la rupture d'une bulle déjà formée dans les démonstrateurs.

La nucléation thermiquement activée décrite dans les notes antérieures reste une possibilité à comparer à une formation par instabilité. Une barrière franchie par fluctuation et une configuration qui perd sa stabilité ne donnent pas nécessairement le même mécanisme ni le même taux. Le mot « rupture » ne tranche pas cette question.

Le [complément sur la composition et les appuis expérimentaux](composition_branes_soupe_appuis_experimentaux.md) distingue branes fondamentales, parois de champs et interfaces collectives ; il propose des témoins expérimentaux pour les bulles et les conversions d'énergie sans attribuer leur validation à toute notre chaîne.

## 1 Concentration et température : identifier ce qui est concentré

Le nombre N, la densité n = N/V, l'énergie thermique E_th et l'énergie cohérente des champs ou des surfaces sont des variables distinctes. Une hausse de N ne fixe pas à elle seule la température. L'énergie de masse et l'énergie des ondes ne deviennent de la chaleur que par des échanges identifiés. Avant thermalisation, une distribution de particules ou d'excitations peut être nécessaire à la place d'une température unique.

Pour un gaz idéal monoatomique non relativiste, sans énergie de masse dans E_th :

\[
E_{\rm th}=\frac32 N k_B T,
\qquad
\frac{T_1}{T_0}=\frac{E_1/E_0}{N_1/N_0}.
\]

Deux fois plus de particules avec deux fois plus d'énergie thermique laisse donc T inchangée. Avec trois fois plus d'énergie, T augmente de 50 % ; avec la même énergie, T est divisée par deux. [David Tong, gaz classiques](https://www.damtp.cam.ac.uk/user/tong/statphys/statmechhtml/S2.html).

Pour un plasma idéal ultrarelativiste en équilibre, à potentiels chimiques négligeables et à nombre effectif de degrés de liberté g_* constant, en unités naturelles ħ = c = k_B = 1 :

\[
\rho_{\rm th}=\frac{\pi^2}{30}g_* T^4,
\qquad
T=\left(\frac{30E_{\rm th}}{\pi^2g_*V}\right)^{1/4}.
\]

En unités SI, la densité énergétique correspondante est π² g_* (k_B T)⁴/(30 ħ³ c³). Les particules massives, les interactions, des potentiels chimiques importants ou des secteurs à températures différentes demandent une autre équation d'état. [David Tong, univers chaud](https://www.damtp.cam.ac.uk/user/tong/cosmo/cosmohtml/S2.html).

| Hypothèse | E₁/E₀ | V₁/V₀ | T₁/T₀ |
|---|---:|---:|---:|
| Énergie doublée à volume fixé | 2 | 1 | 1,1892 |
| Énergie doublée, volume divisé par deux | 2 | 0,5 | 1,4142 |
| Compression adiabatique, volume divisé par deux | 1,2599 | 0,5 | 1,2599 |

Le dernier cas inclut le travail de compression : l'énergie thermique n'y reste pas constante. Les [six exemples numériques](exemples_concentration_temperature.json) comprennent aussi les trois cas de gaz idéal. Ce sont des comparaisons de rapports ; aucune température absolue du projet n'est calculée.

## 2 Premier bilan calculable pour la convergence

Pour un élément de fluide homogène suivi, le bilan thermique minimal est :

\[
\frac{dE_{\rm th}}{dt}=P_{\rm th}-P_{\rm pertes}-p\frac{dV}{dt}.
\]

P_th est la puissance effectivement reçue par les degrés de liberté thermalisés. Dans une première approximation phénoménologique, on pourrait poser P_th = η P_conv : P_conv est la puissance disponible par conversion de l'énergie des branes et η son rendement thermique. Ce rendement est une hypothèse à mesurer ou à dériver, pas un nombre connu. Une production initiale non thermique demanderait de suivre son énergie avant son transfert au bain.

Le volume décroissant chauffe par le terme de travail. Les pertes incluent rayonnement, transport et fuite selon le modèle choisi ; les flux matériels doivent apporter ou emporter leur énergie. Le travail exercé par les branes et la puissance convertie doivent correspondre à leur perte d'énergie, en évitant de compter deux fois la même contribution. La chaleur latente et les interactions sont à inclure de façon cohérente dans une extension avec changement de phase.

Pour des collisions binaires entre deux espèces distinctes dans un gaz dilué sans corrélations, une estimation cinétique est P_transfert ≈ V n₁ n₂ ⟨σ v_rel ΔE⟩. σ est la section efficace du canal, v_rel la vitesse relative et ΔE l'énergie transférée par événement. À volume et distributions fixés, doubler les deux densités multiplie la fréquence de ce canal par quatre. Le transfert net exige toutefois les canaux inverses et leurs distributions ; une fréquence de collisions élevée n'implique pas un chauffage net à l'équilibre. Une collision entre surfaces étendues demande sa propre loi et ne reçoit pas automatiquement cette formule de gaz.

Avec p = E_th/(3V) et g_* constant, le bilan donne :

\[
\frac{\dot T}{T}
=\frac{P_{\rm th}-P_{\rm pertes}}{4E_{\rm th}}
-\frac{\dot V}{3V}.
\]

C'est une dérivation pour ce modèle idéal. Elle ne suppose aucune loi de transfert particulière entre branes. Elle permet de distinguer compression, conversion et refroidissement, avant de tester une loi d'interaction. Une température thermodynamique locale exige un temps de thermalisation court devant le temps de variation des conditions ; les outils de production et de thermalisation sont discutés séparément dans [Allahverdi et al., réchauffement cosmologique](https://arxiv.org/abs/1001.2600).

Une température plus élevée ne garantit pas la formation de la phase souhaitée. Dans de nombreux modèles, le chauffage restaure la symétrie et la transition se produit au refroidissement. Il faut suivre le potentiel effectif V_eff(S; T, n, couplages), ses phases et sa barrière, puis le taux de nucléation le long de la trajectoire locale. Coexistence, nucléation et perte de métastabilité restent des événements distincts. Voir la [note des trois références](baryogenese_nucleation_cpt.md) et [Morrissey et Ramsey-Musolf](https://arxiv.org/abs/1206.2942).

## 3 Les deux voies d'asymétrie peuvent se compléter

Une succession possible est : désintégrations de neutrinos lourds → asymétrie B−L → conversion partielle par les sphalérons → éventuelle source supplémentaire près de parois électrofaibles. B et L désignent ici les charges baryonique et leptonique.

La conversion électrofaible d'une asymétrie leptonique fait déjà partie de la baryogenèse par leptogenèse. Elle ne requiert pas à elle seule une transition électrofaible à bulles. Les sphalérons du Modèle standard violent B+L et conservent B−L ; d'autres réactions peuvent changer ce dernier. [Fong, Nardi et Riotto](https://arxiv.org/abs/1301.3062).

Une source supplémentaire de baryogenèse électrofaible près des parois demande ses propres ingrédients : transition appropriée de premier ordre, violation CP et transport hors équilibre, avec suppression suffisante de l'effacement dans la phase transformée. Le Modèle standard avec le Higgs physique a un crossover électrofaible ; la voie à bulles demande donc une extension matérielle. [Morrissey et Ramsey-Musolf](https://arxiv.org/abs/1206.2942), [D'Onofrio, Rummukainen et Tranberg](https://arxiv.org/abs/1212.3206).

Les deux sources peuvent être espacées dans le temps ou l'espace. Leur contribution finale exige cependant un réseau commun de réactions, de transport et d'effacement, avec la même histoire thermique. Les signes peuvent renforcer ou réduire l'asymétrie ; une asymétrie préexistante peut être redistribuée ou effacée. Additionner les résultats finaux de deux calculs indépendants n'établit pas cette compatibilité. Le coefficient de conversion baryonique dépend des espèces et des réactions en équilibre ; aucune valeur universelle n'est imposée ici.

Un rapprochement particulièrement pertinent existe dans **Bubble-assisted Leptogenesis** : des neutrinos droits initialement sans masse acquièrent leur masse lors d'une transition de premier ordre B−L, puis leurs désintégrations produisent l'asymétrie. L'article calcule aussi des canaux d'effacement supplémentaires. Il relie transition et leptogenèse, sans dériver cette transition d'une convergence de branes ni établir deux sources indépendantes de baryogenèse. [Chun et al., 2023](https://arxiv.org/abs/2305.10759).

## 4 Cadres à relier et correspondances encore manquantes

| Étape de notre scénario | Cadre ou mécanisme disponible | Correspondance à établir |
|---|---|---|
| Alignement local → foyer gravitationnel | Champs de branes ou de parois couplés à la gravitation | Géométrie, tensions, interactions, énergie-impulsion et loi d'attraction ; ce lien n'est pas démontré par la seule orientation |
| Foyer → agglomération de la soupe | Dynamique de matière ou de fluide avec gravitation | Composition du milieu parent, transport, pression et rétroaction |
| Interactions et concentration → excitations/paires | Production de particules dans des champs en interaction | Nature et dimension des branes, couplages, taux et bilan énergétique de la cascade |
| Excitations → plasma chaud | Production de particules, théorie cinétique et thermalisation | Puissance transférée, distributions, temps de thermalisation, pertes |
| Concentration → rupture et bulle | Analyse de stabilité ; nucléation si une barrière existe | Seuil et nature de la rupture, phases, gradients, frontière et profil éventuel du germe |
| Domaine formé → domaine persistant | Dynamique d'interface et thermodynamique à réservoir fini | Ressource conservée, pression, fuite, stabilité des déformations |
| Transition → asymétrie | Leptogenèse assistée par bulles ; transport électrofaible conditionnel | Espèces, masses, phases CP, réactions et régime thermique commun |
| Énergie concentrée → géométrie évolutive | Relativité générale et, si justifiées, approximations cosmologiques | Métrique, contraintes, tenseur énergie-impulsion, frontières et évolution |

**Branes et production.** Takamizu et Maeda calculent une production de particules lors de collisions de deux parois dans un espace-temps de Minkowski à cinq dimensions. La production dépend des couplages et du nombre de rebonds. Ce travail est une référence proche pour le premier transfert d'énergie, mais ses coefficients et dimensions ne se transposent pas directement à nos surfaces affichées dans un espace 3D. [Article](https://arxiv.org/abs/hep-th/0406235).

**Comparaison distincte, non adoptée comme postulat.** Le scénario ekpyrotique relie une collision cosmologique de branes à une phase chaude. Il ne fournit pas la chaîne soupe → alignement local → foyer gravitationnel → agrégation → rupture → bulle précisée par l'auteur. Il reste cité pour situer la différence ; sa collision et ses conditions initiales ne sont pas imposées à notre étude. [Khoury et al.](https://arxiv.org/abs/hep-th/0103239).

**Réservoir fini.** La nucléation et la condensation dans un ensemble canonique à volume fini ont leurs propres barrières et effets de taille. Ces méthodes peuvent aider à tester notre rétroaction de réservoir ; elles n'identifient ni sa ressource ni notre terme en R⁶ à une matière particulière. [Zierenberg, Schierz et Janke](https://arxiv.org/abs/1607.08355).

**Géométrie.** La relativité générale permet de coupler un contenu matériel à une métrique définie. Les équations de Friedmann s'appliquent sous des hypothèses d'homogénéité et d'isotropie à vérifier pour le domaine. Une frontière fermée chaude ne suffit pas à établir un univers autonome. [David Tong, équations d'Einstein](https://www.damtp.cam.ac.uk/user/tong/gr/grhtml/S4.html).

La branche [CPT](baryogenese_nucleation_cpt.md#6-place-de-lhypothèse-cpt) reste une question d'état global et de conditions initiales. Elle n'est pas une étape nécessaire du transfert branes → chaleur → germe.

## 5 Construction minimale proposée

**Choix adopté le 7 octobre 2026 :** les branes seront modélisées comme des parois de champs ; la soupe comprendra quarks, antiquarks, gluons et les autres espèces nécessaires. Un [premier calcul de référence](../parois-plasma/README.md) fournit un profil statique, une tension et un bain idéal. Le modèle ci-dessous reste à coupler : le choix ne démontre ni le foyer gravitationnel ni la rupture formatrice.

**Premier couplage désormais calculé :** le [portail de Higgs](../portail-higgs/README.md) résout les profils plans Φ–h à température imposée et examine leur réponse locale. Il fournit les contributions aux masses de sondes et le coefficient de force de gradient. La [note de transport](portail_higgs_parois_transport.md) précise les équations cinétiques, réactions inverses et bilans à ajouter ; la baisse d'énergie libre pendant l'optimisation numérique ne remplace pas P_th du bilan thermique.

Choisir une description commune du milieu parent, des branes et de la gravitation. Des champs de parois Φ_i, un contenu matériel et une métrique constituent une piste de modélisation, sous réserve de définir leurs interactions, charges et dimensions. La réponse gravitationnelle à l'alignement doit être calculée dès la phase d'agrégation. Ajouter un paramètre d'ordre S si la rupture est identifiée à une transition de phase ; son potentiel V_eff(S, Φ_i; T, n) permettrait alors de tester l'effet du recouvrement des branes. Des neutrinos N et des masses M_N(S) ne seraient ajoutés que pour une branche d'asymétrie matériellement compatible.

Premier calcul proposé : comparer des configurations alignées et désalignées à énergie initiale et conditions aux limites contrôlées ; suivre leur énergie-impulsion, l'attraction locale, les flux de soupe, l'énergie non thermique, l'énergie thermalisée, le volume et les pertes. Ajouter les canaux de production de paires avec leurs bilans, puis rechercher si une rupture calculée produit effectivement une frontière de bulle. Tester une barrière métastable seulement si le modèle en possède une. La stabilité ultérieure et une éventuelle asymétrie demandent des calculs complémentaires.

Le programme correspondant au postulat précisé est **milieu parent + organisation locale des branes + gravitation et agrégation + conversion d'énergie en paires + rupture et formation de bulle**. Les articles sur collisions, thermalisation et transitions apportent des outils à certaines étapes ; une collision ekpyrotique n'est pas un passage obligatoire. Aucun des articles cités ne démontre toute cette configuration, notamment le foyer issu de l'alignement, la rupture formatrice et la fermeture persistante.
