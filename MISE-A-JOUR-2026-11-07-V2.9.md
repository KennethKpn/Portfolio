# Mise à jour — 7 novembre 2026 — Desk95 v2.9

## Objectif

Compléter la fenêtre **Formation & certifications** avec les deux badges de complétion Claude Academy fournis dans le dossier de justificatifs.

## Éléments présentés

| Intitulé exact | Émetteur | Type de justificatif | Date | Vérification |
|---|---|---|---|---|
| Claude with the Anthropic API | Anthropic Education | Certificate of Completion | 6 novembre 2026 | https://verify.skilljar.com/c/jshitiofo33z |
| AI capabilities and limitations | Claude Academy | Course Completion Badge | 7 novembre 2026 | https://academy.claude.com/verify/c4e4cc5f3d7dda4bae246fa4e00eca71 |
| Building with the Claude API | Claude Academy | Course Completion Badge | 7 novembre 2026 | https://academy.claude.com/verify/e6d6cacb0bd49e296d1863c3aefb28bb |

## Changements

- Ajout des deux badges Claude Academy dans la fenêtre Formation & certifications.
- Chaque badge affiche son intitulé, son émetteur, sa date, son type exact et son lien de vérification.
- Le certificat Anthropic Education reste distinct et conserve son bouton de téléchargement PDF.
- Mise à jour du teaser About en français et en anglais : un certificat et deux badges.
- Ajout des deux badges dans profile-data.json, sous completion_badges.
- Ajout d'un style spécifique aux badges Claude Academy et d'une note distinguant le certificat Skilljar du badge Claude Academy portant un intitulé de cours proche.
- Ajout du test ciblé verify_v29.py.

## Exactitude des intitulés

Le document Anthropic Education porte la mention **Certificate of Completion**. Les deux documents Claude Academy portent la mention **Course Completion Badge**. Le portfolio conserve ces catégories et ne les présente pas comme des certifications professionnelles par examen.

Les URL de vérification sont reprises exactement des documents fournis. Leur accès externe n'a pas pu être confirmé par l'outil de navigation utilisé pendant cette modification ; les liens sont donc présentés comme liens de vérification fournis, sans badge « vérifié en direct ».

## Validation

Contrôles statiques préparés : présence des trois identifiants de justificatif, séparation des types, dates et trois URL exactes. La suite Playwright verify_v29.py est ajoutée pour la vérification navigateur complète ; elle n'a pas été exécutée dans cet environnement, car le dépôt ne pouvait pas être cloné directement et les dépendances navigateur locales n'étaient pas disponibles.

## Publication

Modifications préparées sur la branche feat/portfolio-v2.9-verified-credentials. Aucun changement n'est appliqué à main par cette branche et aucun déploiement de production n'est déclenché avant fusion.
