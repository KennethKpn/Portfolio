# KPANOU Kenneth — Desk 95 Portfolio

Portfolio personnel interactif présenté comme un bureau Windows 95. La version 2.4 conserve l’identité rétro du template tout en clarifiant le profil, les réalisations et la visibilité réelle des dépôts GitHub.

## Lancer le portfolio

- **Windows :** double-cliquer sur `start.bat`.
- **macOS / Linux :** lancer `./start.command` depuis un terminal.
- **Autre méthode :** exécuter `python -m http.server 4173` dans ce dossier, puis ouvrir `http://localhost:4173`.

Aucune installation npm ni aucun compte n’est requis. Le portfolio fonctionne localement ; seule l’actualisation des métadonnées GitHub nécessite Internet. En cas d’échec réseau, les fiches restent visibles et un lien mène au profil complet.

## Profil affiché

- **Nom :** KPANOU Kenneth
- **Positionnement :** développement web & applicatif, UI/UX design.
- **Structure :** cofondateur d’Iconlabs, studio de création web et d’automatisation.
- **Localisation :** Bénin.
- **Formation :** ESGIS Bénin, depuis 2025 ; Licence prévue en 2028.
- **Profil GitHub officiel :** <https://github.com/KennethKpn>

Le nom d’utilisateur `KennethSalomon` a été supprimé des liens et des appels API du portfolio. Le profil actif vérifié est `KennethKpn`. La date de naissance a été retirée de la présentation publique.

## Réalisations sélectionnées

La section Portfolio distingue six projets des rubriques de compétences. Les étiquettes signalent explicitement la visibilité réelle des dépôts privés et publics.

| Projet | Ce qui est présenté | Source |
|---|---|---|
| **UNYVON** | Business OS pour PME : ventes, stocks, marges, encaissements, créances et analyses NOVA. | Produit en production et dépôt GitHub public : <https://github.com/KennethKpn/UNYVON>. |
| **KAZA** | PropTech pour la recherche de logements et le suivi locatif au Bénin : géolocalisation, comptes par rôle, messagerie, paiement et quittances. | Aperçu consultable ; dépôt privé et projet en développement. |
| **Marsal Technologies** | Site et catalogue consacrés à la sécurité électronique, au contrôle d’accès et à la domotique. | Site publié ; le dépôt public lié est une version historique, pas nécessairement le code déployé aujourd’hui. |
| **E’YRAM Business** | Boutique digitale de tissus, bijoux et accessoires, avec catalogue responsive et parcours de commande WhatsApp. | Dépôt public ; domaine d’aperçu à confirmer (voir rapport). |
| **ORCA DECO** | Catalogue et boutique de meubles et d’articles de décoration, avec parcours de contact et de commande locale. | Site publié et dépôt public. |
| **Iconlabs** | Studio digital cofondé par Kenneth : UI/UX, sites web, développement et automatisation. | Site public et dépôt public. |

Les fiches présentent une description, le contexte, l’approche, les technologies observées et les liens disponibles. UNYVON est identifié comme produit en production avec dépôt public ; KAZA reste signalé comme dépôt privé.

## Utilisation et navigation

- Écran d’introduction et bureau personnalisés.
- Raccourcis de projets et de compétences ; double-clic pour ouvrir une fiche.
- Glisser-déposer des icônes à la souris ou au toucher ; positions enregistrées localement.
- Fenêtres déplaçables, redimensionnables, empilables, minimisables et maximisables.
- Barre des tâches et menu Start.
- Explorateur My Computer et dossier Portfolio.
- Design Lab simulé pour parcourir les rubriques.
- Fiche Iconlabs avec accès au site et au dépôt.
- Panneau GitHub affichant le profil officiel, UNYVON avec son dépôt public, KAZA avec son état privé et cinq dépôts publics sélectionnés.
- Responsive sur ordinateur, tablette et téléphone.
- Préférence `prefers-reduced-motion` prise en compte.

## Fichiers utiles

- `index.html` — structure de l’application.
- `styles.css` — bureau, fenêtres et responsive.
- `app.js` — navigation, fiches projets, interactions et panneau GitHub.
- `profile-data.json` — données de profil et coordonnées.
- `assets/` — portraits et vignettes de projets.
- `reports/` — captures de validation et résultats automatisés.
- `test_local.py` — suite de tests Playwright facultative.
- `RAPPORT-COMPARAISON.md` — audit des sources, décisions, points à confirmer et recommandations.

## Validation

La suite Playwright est réexécutée avec Chromium à chaque livraison ; le détail et le nombre effectif de tests sont consignés dans `reports/test-results.json`. Les scénarios couvrent l’ouverture des fiches, le profil GitHub, les liens de contact, le déplacement des icônes, les fenêtres, la navigation et les parcours tablette/mobile. Les captures et le résultat JSON se trouvent dans `reports/`. La dernière suite a réussi 54/54 scénarios.

Pour rejouer les tests, il faut Python, Playwright et Chromium. Ces outils ne sont pas nécessaires pour lancer le portfolio.

## Informations à confirmer avant publication

1. Le domaine E’YRAM Business : le dépôt GitHub et son HTML ne déclarent pas le même domaine canonique.
2. Le périmètre exact de ta contribution à chaque réalisation (conception, développement, intégration, maintenance ou accompagnement).
3. Les coordonnées de contact et les liens sociaux, à tester depuis un téléphone.
4. Les éventuels indicateurs mesurables et captures de produits que tu souhaites publier.

**Important :** le ZIP est une version locale personnalisée. Aucun changement n’a été poussé sur GitHub et aucun déploiement public du portfolio n’a été déclenché.
