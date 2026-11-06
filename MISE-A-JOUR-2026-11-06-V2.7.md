# Desk95 KPANOU Kenneth — v2.7

## Intégration du CV

- Ajout du PDF fourni : `assets/documents/CV-Yisse-Kpanou.pdf`.
- PDF copié sans modification ni recompression ; une page A4.
- Bouton de téléchargement directement dans la fenêtre About Kenneth : « Télécharger mon CV (PDF) ».
- Traduction de l'étiquette en anglais : « Download my CV (PDF) ».
- Le nom du fichier téléchargé est propre et constant : `CV-Yisse-Kpanou.pdf`.
- Deuxième entrée dans `My Computer` → `Portfolio`, section « Mon CV ».
- L'interface reste en français par défaut ; le document est actuellement uniquement en français.

## Vérifications

- `verify_v26.py` : 33 contrôles de régression réussis.
- `verify_v27.py` : 23 contrôles de téléchargement, de langue et de responsive réussis.
- 0 erreur JavaScript lors de la suite ciblée.
- Téléchargement Chromium testé depuis About et depuis le dossier Portfolio.
- Résolution responsive du bouton vérifiée : 320×568, 390×844, 820×1180 et 1365×768.
- SHA-256 du PDF : `5d0b9327b7ae6e80c6231e7051a9e752c6380fc4c759c31e59bca2fae2e1f8de`.

## Données personnelles

Le CV est conservé tel que fourni. Il contient des informations personnelles telles que date de naissance, situation familiale, adresse e-mail et numéros de téléphone. Vérifier ces éléments avant toute publication publique du portfolio.

## Publication

Aucun changement n'a été poussé sur GitHub et aucun déploiement n'a été déclenché.
