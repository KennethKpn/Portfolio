# Rapport de mise à jour — Desk 95 Portfolio

**Version livrée :** Desk 95 KPANOU Kenneth v2.4  
**Date de vérification :** 6 novembre 2026  
**Fichier d’origine :** `Desk95-KPANOU-Kenneth-v2.1.zip`  
**Compte GitHub vérifié :** <https://github.com/KennethKpn>

## 1. Résumé exécutif

Le portfolio fourni a été mis à jour pour présenter un profil et des réalisations plus proches de l’état vérifiable du compte GitHub. Le style Windows 95 a été conservé ; les projets sont séparés des catégories de compétences, la visibilité des dépôts est vérifiée et les anciens liens `KennethSalomon` ont été remplacés par `KennethKpn`. La présente version tient compte du passage récent d’UNYVON en public.

**Résultat des tests : 54/54 réussis · 0 échec · 0 erreur JavaScript/console.** Aucun échec ni erreur JavaScript/console n’a été relevé dans la suite locale.

Cette livraison est un ZIP local prêt à être lancé. Elle n’a pas été poussée dans un dépôt GitHub et le site n’a pas été redéployé.

## 2. Identité GitHub : correction vérifiée

L’intégration GitHub connectée a retourné le login actif **`KennethKpn`** et le profil correspondant à l’URL :

<https://github.com/KennethKpn>

Corrections effectuées dans le portfolio :
- lien du profil dans la fiche Contact et le panneau GitHub ;
- en-tête du panneau GitHub : `KennethKpn` ;
- appel de l’API publique GitHub : `/users/KennethKpn/repos` ;
- liens du dépôt public UNYVON et du profil dans les fiches UNYVON et KAZA ;
- liens des dépôts publics sélectionnés ;
- cache navigateur renommé pour le compte `KennethKpn`.

L’ancien login `KennethSalomon` ne figure plus dans le code applicatif, les données de profil ni les liens de production du portfolio. Un test automatisé vérifie que l’ancien identifiant ne revient pas dans le code applicatif.

## 3. Sélection des projets

Le compte `KennethKpn` expose plusieurs dizaines de dépôts. Leur présence ne suffit pas à en faire des réalisations à mettre en avant : la sélection a tenu compte de leur visibilité, de leur structure, de leurs descriptions, de leur documentation et de l’existence d’un aperçu web.

### 3.1 Projets mis en avant

| Projet | Vérification | Traitement dans le portfolio |
|---|---|---|
| **UNYVON** | Dépôt public confirmé par l’API GitHub (`private: false`) le 6 novembre 2026 : <https://github.com/KennethKpn/UNYVON>. La propriété `homepage` du dépôt pointe vers <https://unyvon.vercel.app>. `package.json` confirme Next.js, React, TypeScript, Supabase et Tailwind CSS. | Fiche produit détaillée avec lien de production et lien direct vers le code source public. |
| **KAZA** | Dépôt privé ; aperçu répertorié à <https://kaza-web-chi.vercel.app>. Dépôt et documentation décrivent une solution PropTech avec recherche géolocalisée, outils locatifs, messagerie, FedaPay et quittances. | Fiche « en développement » ; code source privé clairement indiqué. |
| **Marsal Technologies** | Dépôt public `KennethKpn/MARSAL-THECNOLOGIE`; aperçu actif consulté à <https://marsal-refont.vercel.app>. Le site présente les univers de sécurité électronique et domotique et un catalogue. | Fiche de projet + lien site + lien vers le dépôt public historique. La différence entre le dépôt public et la version web actuelle est indiquée pour ne pas laisser croire que le dépôt reflète exactement le déploiement courant. |
| **E’YRAM Business** | Dépôt public `KennethKpn/E_YFRAM_BUSINESS`; description GitHub et HTML décrivent une boutique de tissus, bijoux et accessoires à Cotonou, avec parcours WhatsApp et SEO. | Fiche boutique + lien au dépôt et à l’aperçu déclaré par les métadonnées GitHub. Domaine à confirmer avant publication (voir § 5). |
| **ORCA DECO** | Dépôt public `KennethKpn/ORCA-DECO`; aperçu consulté à <https://orcadecobenin.com>. Site de mobilier et décoration avec catalogue et livraison locale. | Fiche boutique + lien de site et dépôt public. |
| **Iconlabs** | Dépôt public `KennethKpn/Iconlabs`; site vitrine <https://iconlabs-inky.vercel.app>. Dépôt organisé autour de pages agence, services, réalisations et contact. | Projet/structure cofondée ; ajout des liens directs vers le site et le dépôt. |

La visibilité publique d’UNYVON est désormais confirmée par la réponse du dépôt GitHub (`private: false`) ; son site de production déclaré est <https://unyvon.vercel.app>. Le README du dépôt demeure un README générique Next.js et gagnerait à être remplacé par une documentation métier. Les descriptions ne revendiquent pas des chiffres de résultats, des clients, ou des rôles précis non vérifiés. Dans les fiches projet, la formulation reste centrée sur le produit et ses fonctionnalités observées ; les responsabilités exactes de Kenneth pourront être précisées à partir de son historique et de ses contrats.

### 3.2 Dépôts volontairement écartés de la sélection principale

- `school-box-buddy` : README généré par Lovable avec identifiant de projet de remplacement, peu informatif pour un portfolio.
- `GUARDSITE-AI` : README réduit à un TODO.
- `camera` : README identifie un template WebGi/Three.js et crédite Anderson Mancini ; ne pas l'attribuer comme une création originale sans clarifier la part de personnalisation.
- `choose-site` : description GitHub indiquant une landing page de démonstration Nike x CHOOSE.
- autres dépôts incomplets ou prototypes sans documentation suffisamment claire : conservés sur GitHub, mais non présentés comme des projets phares.

Les autres dépôts restent accessibles depuis la page GitHub du compte. Cette sélection est volontairement plus courte et plus crédible qu'un mur de dépôts sans contexte.

## 4. Changements apportés à l'expérience

### Identité et contenu
- remplacement des liens GitHub de `KennethSalomon` par `KennethKpn` ;
- suppression de la date de naissance de l’affichage public ;
- conservation de la formation ESGIS Bénin (depuis 2025, Licence prévue en 2028) ;
- clarification de la cofondation d’Iconlabs ;
- fiches pour UNYVON, KAZA, Marsal, E’YRAM, ORCA DECO et Iconlabs ;
- rubriques UI/UX, frontend, backend, automation, mobile, stack et studies rangées dans « Skills & areas », et non présentées comme projets clients ;
- indication visible du caractère public du dépôt UNYVON et du caractère privé du dépôt KAZA ;
- accès directs au site et au dépôt depuis la fiche Iconlabs.

### Interface
- séparation visuelle entre « Selected work » et « Skills & areas » ;
- étiquettes d’état/source dans l’explorateur et les fiches ;
- quatre colonnes de raccourcis sur ordinateur, cinq en paysage mobile ;
- panneau GitHub réorganisé autour du profil réel, d’UNYVON (produit publié + dépôt public), de KAZA (code privé) et de cinq dépôts publics sélectionnés ;
- rafraîchissement des métadonnées GitHub avec cache local et message de secours hors ligne ;
- adaptation du panneau et des fiches aux écrans plus étroits.

Le système visuel rétro, les fenêtres et les interactions existantes ont été conservés.

## 5. Réserves et éléments à confirmer

### 5.1 Domaine E’YRAM Business

Deux valeurs différentes apparaissent dans les informations consultées :
- propriété `homepage` du dépôt : `https://eyframbusiness.vercel.app/` ;
- balise canonical présente dans le HTML : `https://e-yram-business.vercel.app/`.

Le portfolio pointe pour l'instant vers la valeur `homepage` publiée par les métadonnées GitHub. Le domaine de production doit être testé et confirmé par Kenneth avant mise en ligne.

### 5.2 Marsal : dépôt public et site actif

Les métadonnées du dépôt public `MARSAL-THECNOLOGIE` mentionnent une ancienne URL (`marsal-thecnologie.vercel.app`), tandis que l'aperçu web consulté actuellement est `marsal-refont.vercel.app`. Un dépôt `marsal-refont` existe aussi mais est privé. Le portfolio garde le site actuellement consultable et libelle le lien de dépôt public comme historique/associé ; il ne prétend pas que ce dépôt est la source exacte du déploiement récent.

### 5.3 Coordonnées

Les emails, numéros et profils sociaux présents dans les données initiales ont été conservés, mais ne peuvent pas être confirmés simplement à partir du compte GitHub. Teste chaque lien depuis un appareil mobile, en particulier WhatsApp et Telegram. Il serait utile de définir une adresse email professionnelle unique comme contact principal.

### 5.4 Responsabilités et preuves d’impact

Pour donner encore plus de valeur commerciale au portfolio, il manque les détails que seul Kenneth peut confirmer :
- rôle exact par projet (conception, développement, intégration, maintenance, coordination) ;
- date ou période de réalisation ;
- problème client et solution apportée ;
- chiffres réels (commandes, temps gagné, conversions, utilisateurs, produits au catalogue, etc.) ;
- captures du produit sur ordinateur et téléphone ;
- témoignages autorisés et noms de clients publiables.

Aucun indicateur ni témoignage fictif n'a été ajouté.

## 6. Alerte de sécurité GitHub

L'inventaire des fichiers publics a révélé des fichiers de configuration sensibles suivis dans deux dépôts :
- `KennethKpn/Your-pass` : fichier `.env` présent à la racine ;
- `KennethKpn/schoolbox` : fichier `.env.local` présent à la racine.

**Le contenu de ces fichiers n'a pas été ouvert, copié ou inclus dans ce rapport.** Leur présence dans un dépôt public suffit toutefois à justifier une vérification rapide. Si ces fichiers contiennent ou ont contenu de vraies clés, mots de passe, jetons ou URL privées :
1. révoquer/renouveler les secrets concernés dans les services associés ;
2. les remplacer par des variables d'environnement ou un gestionnaire de secrets ;
3. retirer les fichiers du suivi Git ;
4. vérifier l'historique Git, car supprimer un fichier dans le dernier commit n'efface pas son contenu des commits précédents.

Cette alerte n'empêche pas de présenter les autres dépôts, mais ces deux projets ne sont pas mis en avant dans la sélection principale.

Contrôle distinct du dépôt `KennethKpn/UNYVON` après son passage en public : l’arbre GitHub complet (342 entrées) ne contient pas de fichier `.env` réel suivi ; seul un fichier d’exemple `.env.local.example` est présent à la racine. Les valeurs de ce fichier d’exemple n’ont pas été reproduites ici.

## 6.1 Corrections complémentaires de la v2.4

- Le dépôt `KennethKpn/UNYVON` est confirmé public par l’API GitHub (`private: false`) ; la propriété `homepage` renvoie `https://unyvon.vercel.app`.
- La fiche UNYVON et la carte mise en avant dans le panneau GitHub affichent désormais le même statut : **« En production · dépôt public »**. Les deux actions sont explicites : ouvrir le produit en production ou ouvrir le code source public.
- La capture `reports/desktop-github-panel.png` a été régénérée pour refléter l’interface actuelle, au lieu de conserver la capture antérieure où le statut d’UNYVON était obsolète.
- La date de naissance n’apparaît plus non plus dans le détail de la rubrique Études.

## 7. Tests et validation locale

**Résultat : 54 réussis · 0 échec · 0 erreur JavaScript/console.**

Les vérifications comprennent :
- écran de démarrage et bureau ;
- présence des portraits fournis ;
- informations du profil et retrait de la date de naissance ;
- accès About, Skills, Education, Iconlabs, Contact et GitHub ;
- liens des emails, réseaux et WhatsApp ;
- ouverture des fiches UNYVON, KAZA, Marsal, E’YRAM et ORCA DECO ;
- statut « En production · dépôt public » et liens vérifiés pour UNYVON, dans sa fiche comme dans le panneau GitHub ;
- contrôle dédié empêchant de réafficher UNYVON comme projet à code privé ;
- absence de date de naissance également vérifiée dans le détail Études ;
- capture GitHub produite dans un contexte de test indépendant, sans fenêtres empilées ;
- état privé affiché pour KAZA ;
- séparation projets/compétences ;
- présence des six projets sélectionnés ;
- lien de profil GitHub `KennethKpn` et sélection des cinq dépôts publics, UNYVON inclus ;
- suppression de l'ancien identifiant GitHub dans le code applicatif ;
- déplacement d'icône à la souris et au toucher ;
- fenêtres : déplacement, maximisation/restauration, minimisation, barre des tâches, fermeture ;
- limites tablette et fiches mobiles ;
- navigation du menu Start et contact mobile.

Environnements testés :
- ordinateur : 1365 × 768 px, avec captures de référence à 1365 × 573 px ;
- tablette : 820 × 1180 px ;
- smartphone : 390 × 844 px.

Les captures locales sont enregistrées dans `reports/` ; la capture du panneau GitHub est prise dans une fenêtre propre, sans empilement de fenêtres de test. Le résultat détaillé est dans `reports/test-results.json` (54 tests réussis).

## 8. Recommandations pour la prochaine itération

1. **Cas clients plus convaincants :** ajouter une image réelle de chaque projet, le rôle exact, les choix techniques et un résultat vérifiable.
2. **Parcours conversion :** proposer deux actions visibles — « Voir les projets » et « Me contacter » — avec email/WhatsApp principal.
3. **Études de cas :** ajouter un récit court « Problème → Décision → Solution → Résultat » pour KAZA, UNYVON, Marsal et Iconlabs.
4. **Preuves sociales :** publier uniquement des témoignages validés et autorisés ; éviter les statistiques sans source.
5. **Accessibilité :** tester le contraste, les états clavier, les labels des fenêtres et la navigation tactile ; conserver l'option de réduction des animations.
6. **Profil professionnel :** compléter LinkedIn, CV téléchargeable, ville, langues de travail et disponibilités.
7. **Hygiène des dépôts :** vérifier les deux fichiers d'environnement signalés, les domaines E’YRAM/Marsal et les README des dépôts principaux.

## 9. Livraison

Le ZIP livré contient l'application personnalisée, ses ressources, les tests, les captures et ce rapport. Les fichiers sources d'origine n'ont pas été supprimés : la v2.3 est une copie de travail dérivée de la v2.1 et mise à jour depuis la v2.2.

**Aucune écriture distante n'a été faite sur GitHub.** Aucune branche, aucun commit, aucune modification de dépôt ni aucun déploiement public du portfolio n'a été déclenché.
