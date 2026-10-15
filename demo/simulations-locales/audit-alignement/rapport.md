# Audit : théorie et automate chromatique 3D

Audit . Le moteur et l'interface restent inchangés. Les fichiers JavaScript analysés sont identiques à ceux embarqués dans `automate-3d.html` ; leurs empreintes sont enregistrées dans `verification.json`.

**Précision ultérieure .** La gravitation doit être induite pendant la mutation du nuage et participer au premier agrégat ; l'assemblage complet des boucles est proposé comme seuil et mécanisme de stabilité. La [note de clarification et de bibliographie](clarifications-et-cordes.md) complète ce diagnostic et retrouve les fonctions de rayon des autres moteurs. Le modèle pression–surface–réservoir du présent audit demeure une réalisation antérieure, pas une exigence imposée à cette nouvelle formulation.

**Clarification qui fait désormais référence.** L'auteur précise ensuite que les combinaisons de toutes les boucles locales peuvent faire émerger une configuration X, dont la gravitation commence alors à agir. L'information est celle que distribuent les boucles. Dans cette lecture, l'organisation préalable sans attraction n'est pas un bug en soi, et le principe « configuration → source » du moteur est compatible avec la causalité souhaitée. Les passages ci-dessous sur l'absence de gravitation du précurseur restent des constats sur le code, mais ne suffisent plus à conclure à un défaut de causalité. La définition de X, sa correspondance avec la couverture chromatique et la dynamique de persistance restent ouvertes.

**Conclusion.** L'automate est cohérent avec une règle d'assemblage chromatique points → demi-cordes → cordes → boucles → pseudo-sphères. Il n'implémente pas encore le modèle physique nuage → concentration gravitationnelle → transition de phase → bulle à rayon stable. Les résultats des deux modèles ne sont donc pas interchangeables. L'apparition de sphères sans attraction est permise par construction et n'est pas, en elle-même, une erreur de programmation.

## 1. Ce que signifie le relevé 

L'auteur rapporte 12 foyers et 12 sphères à la génération 11 060, pour « 0 gravité ». Il ajoute qu'il n'y a peut-être simplement pas eu assez de générations. La configuration appliquée et son historique ne sont pas disponibles : le relevé est conservé comme observation rapportée, sans prétendre l'avoir reproduit.

Le compteur compte les objets **présents**, pas les apparitions cumulées : `World.summary()` additionne les booléens `source` et `condensed` de l'état courant (`structures-engine.js`, ligne 71). Aucun historique d'identité, de naissance et de disparition des sphères n'est enregistré.

Avec le déclencheur par défaut `sphere` et `gravity.enabled=true`, `source=condensed` : les 12 foyers et les 12 sphères désignent alors les mêmes 12 cellules. Ce ne sont pas 24 objets ni deux confirmations indépendantes.

Deux sens de « zéro gravité » doivent être distingués :

- `gravity.strength=0` supprime le déplacement attractif mais conserve les étiquettes de foyer ;
- `gravity.enabled=false` supprime les étiquettes de foyer. Après recalcul de l'état, le compteur de foyers vaut alors zéro, même si des sphères subsistent.

L'interface ne prend en compte le réglage d'intensité qu'après **Appliquer les réglages**. Ce bouton conserve la population et la génération. Une intensité affichée à zéro en fin d'expérience ne prouve donc pas une évolution sans attraction depuis le départ (`automate-app.js`, lignes 37–46 et 66–85). Rien ne permet d'affirmer que cette situation s'est produite dans l'expérience rapportée.

Davantage de générations peut modifier le nombre d'objets ; le relevé seul ne démontre ni un plateau ni une rareté. Il faut suivre une trajectoire, puis répéter avec plusieurs graines et des configurations enregistrées.

## 2. Principaux écarts d'alignement

### A. La causalité gravitationnelle du précurseur est absente

Par défaut, aucune cellule initiale n'est une source : la gravité se déclenche lorsqu'une sphère est déjà assemblée. Les sources utilisées pour les déplacements sont celles du pas précédent (`structures-engine.js`, lignes 64–67 et 103–116).

L'automate réalise donc : **liaisons et diffusion → assemblage → sphère → attraction supplémentaire**. Il ne teste pas si la gravitation du nuage amorce son agrégation avant la première sphère. Il peut explorer un scénario où l'attraction apparaît après condensation, mais cette variante doit être explicitement distinguée de celle du nuage autogravitant. L'hypothèse  n'est pas transformée ici en affirmation que la gravité serait indispensable à toute formation.

### B. Les mécanismes d'agrégation restent actifs à intensité zéro

Les liaisons locales ont une probabilité par défaut de 0,75 ; la diffusion, 0,12 ; les assemblages successifs ont leurs propres probabilités. Les cellules voisines contenant déjà des structures peuvent se lier sans critère de gravité (`structures-engine.js`, lignes 80–100 et 109–116).

La naissance de points selon le nombre de voisins reste également active. L'attraction à zéro ne constitue donc pas une expérience sans mécanisme d'organisation.

### C. La « stabilité » est en partie imposée

`condensation.persistent=true` maintient le statut condensé tant qu'il reste au moins un point, même si la condition de formation n'est plus satisfaite. Les condensats sont ancrés et protégés de la règle de disparition ; deux condensats ne se lient pas entre eux. Par défaut, l'émission est nulle (`structures-engine.js`, lignes 12, 16–17, 65, 105, 109 et 113).

Ce verrouillage ne démontre pas un attracteur radial. Le code ne calcule ni contraction, ni expansion, ni rappel après perturbation du rayon. Désactiver la persistance ne suffit pas : les critères de reclassement resteraient des critères de composition.

### D. La sphère est une classification locale et un symbole graphique

La formation dépend d'un nombre minimal de boucles et du nombre de positions présentes dans ces boucles. Ce n'est pas un seuil de densité, de température ou d'énergie libre. Chaque pseudo-sphère occupe une cellule de la grille ; son rayon graphique vaut `9 × facteur de projection`, sans dynamique physique (`automate-app.js`, lignes 98–103).

Notre modèle de bulle utilise au contraire une énergie

\[
\Phi(R)=4\pi\sigma R^2-\Delta p_0 V_b+\frac{K}{2V_r}V_b^2,
\qquad V_b=\frac{4\pi}{3}R^3,
\]

avec barrière, minimum et relaxation radiale. Aucune de ces quantités n'intervient dans cet automate. La [note de bulle](../../plasma-bulle/nuage_plasma_bulle.md) précise déjà que ce modèle phénoménologique ne suffit pas à identifier un plasma réel.

### E. L'attraction n'est pas le modèle gravitationnel de nos calculs

La règle utilise une probabilité de déplacement plafonnée à 1, proportionnelle à l'intensité et à la racine carrée de la masse source, divisée par une distance au carré adoucie. Elle sélectionne un seul foyer, filtre la proximité RGB, limite la portée et immobilise les sources. Elle ne résout pas de champ gravitationnel ni de dynamique pression–vitesse–densité (`structures-engine.js`, lignes 113–116).

Les équations du module de Jeans ne sont pas appelées. À titre de référence de validation, le [test de Jeans de FLASH](https://flash.rochester.edu/site/flashcode/user_support/flash_ug_devel/node193.html) couple hydrodynamique et gravité et compare le résultat à la relation de dispersion. Cette référence fournit un objectif de contrôle physique, pas une validation de notre automate.

Une interprétation Coleman–De Luccia n'est pas implémentée : le moteur ne contient ni action de champs couplés à la gravitation ni calcul de transition semiclassique.

### F. Le bilan de matière et d'énergie n'est pas défini

Les naissances ajoutent des points sans prélever une réserve. Soustractions, disparitions et plafonnements peuvent en retirer. La « masse » est une somme de poids de structures ; avec les poids et seuils par défaut, les assemblages seuls conservent cette masse, mais ce n'est pas garanti après des réglages arbitraires (`structures-engine.js`, lignes 60, 90 et 91–106).

Cela ne décrit pas la compression d'une quantité fixe ni le réservoir fini de notre bulle. Un système ouvert resterait possible, à condition de définir ses flux et son bilan énergétique. Conserver tous les nombres de particules d'un plasma n'est pas non plus une exigence correcte universelle : les quantités conservées pertinentes restent à identifier.

### G. Les couleurs et structures ne sont pas des particules physiques identifiées

Le moteur stocke des comptes par couleur et quatre niveaux d'assemblage. Il ne décrit ni spin, ni statistique quantique, ni charges physiques, ni équation d'état du plasma. Les 10/11/26/32 positions sont des identifiants de palette, sans dimensions supplémentaires dynamiques. Les mots « corde » et « boucle » n'introduisent pas une théorie de cordes. Cette limite est correctement signalée dans le guide existant.

### H. Le dispositif ne mesure pas encore un taux de nucléation

Les probabilités des règles sont des entrées choisies ; elles ne sont pas déduites d'une barrière et d'un bruit thermique. Les compteurs d'état ne donnent pas un taux de premier passage. Le nombre `12/11060` n'est ni une probabilité de nucléation ni un Γ volumique.

On pourrait mesurer une fréquence propre à l'automate en enregistrant les apparitions distinctes et l'exposition en cellules × générations, avec un protocole précisant les récidives, le volume admissible et les variations temporelles. La convertir en taux physique demanderait ensuite des échelles d'espace et de temps et une correspondance justifiée avec la transition étudiée.

## 3. Contrôles exécutés

Les 16 scénarios existants de `sources/check-structures.cjs` passent. Ils vérifient la conformité aux règles déclarées, sans établir leur validité physique.

L'audit ajoute 9 contrôles, dont une comparaison pas à pas des états sur 100 générations. Réglages : défauts complets, 32 positions, grille 18³, graine 728931 ; seules l'intensité et l'activation de gravité varient.

| Expérience | Première sphère | Sphères à 100 | Foyers à 100 | Points constitutifs à 100 |
|---|---:|---:|---:|---:|
| Intensité 0, gravité cochée | 51 | 8 | 8 | 55 325 |
| Intensité 0, gravité désactivée | 51 | 8 | 0 | 55 325 |
| Intensité 3, gravité cochée | 51 | 9 | 9 | 54 564 |

Les trois expériences commencent avec 596 points constitutifs. Les deux expériences sans attraction ont exactement la même trajectoire hors étiquette de source, sur les 100 générations testées. Cette équivalence est vérifiée pour le déclencheur `sphere` ; elle n'est pas revendiquée pour les autres déclencheurs.

Les états des expériences d'intensité 0 et 3 sont identiques jusqu'à la première sphère incluse. Leur divergence ultérieure est compatible avec le déclenchement retardé de l'attraction. La différence 8 contre 9 sur une seule graine ne mesure pas un effet statistique général.

Une contre-épreuve isolée prépare un condensat réduit à un point libre : il reste classé sphère avec persistance, puis perd ce statut dès que la persistance est retirée. Ce test construit vérifie le verrouillage ; il ne prétend pas que cet état a été observé naturellement dans le relevé .

Ces essais ne reproduisent pas le relevé à 11 060 générations et ne fixent aucun nombre maximal de sphères.

Reproduction depuis la racine du projet avec Node.js :

```sh
node output/simulations-locales/sources/check-structures.cjs
node output/simulations-locales/audit-alignement/verifier-alignement.cjs
```

Le second programme produit [verification.json](verification.json), avec les configurations, les instantanés, les contrôles et les empreintes des sources.

## 4. Travail nécessaire pour aligner les modèles

1. **Fixer les correspondances** : distinguer la densité du nuage, la phase transformée, le rayon et les unités. Définir si la gravité agit avant condensation ou si une nouvelle interaction apparaît après.
2. **Relier la dynamique aux équations retenues** : transport et bilan du milieu ; gravitation cohérente avec le régime choisi ; énergie de phase et d'interface. Réutiliser le calcul radial comme référence de validation avant toute généralisation spatiale.
3. **Faire résulter la persistance d'une dynamique** : permettre croissance et décroissance et mesurer le retour après perturbation, au lieu de prendre le drapeau persistant comme preuve de stabilité.
4. **Instrumenter les expériences** : configuration et historique des changements, identité des objets, apparitions cumulées, survie, masse et flux ; graines multiples et sensibilité aux frontières, à la grille et à l'ordre de mise à jour.
5. **Construire le taux** : utiliser un mécanisme de fluctuations et des premiers passages définis conformément à la [note sur Γ](../../plasma-bulle/ingredients_taux_nucleation.md). Un bruit arbitraire supplémentaire ne suffirait pas à établir une nucléation physique.

Prolonger les générations répondra à la question de l'évolution tardive de cet automate. Cela ne remplace pas ces correspondances. L'observation actuelle peut être présentée dans la synthèse comme un résultat d'assemblage d'un automate exploratoire, avec ses règles explicites.
