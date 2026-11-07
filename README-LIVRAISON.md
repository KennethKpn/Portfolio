# Livraison Desk95 KPANOU Kenneth v2.8

Cette archive reprend la v2.7 (CV téléchargeable) et ajoute le certificat Anthropic dans le parcours Formation & certifications.

## Nouveauté v2.8

- Carte « nouvelle certification » dans About (FR/EN), qui renvoie vers la fenêtre Formation / Education.
- Section **Formation & certifications** avec :
  - Claude with the Anthropic API ;
  - intitulé de cours affiché dans la validation : Building with the Claude API ;
  - émetteur Anthropic Education ;
  - date d’achèvement : 6 novembre 2026 ;
  - résumé concis des thèmes couverts ;
  - téléchargement du PDF original ;
  - lien de vérification Skilljar fourni.
- Français par défaut ; les libellés sont traduits en anglais.
- Le PDF a été inclus sans modification : `assets/documents/Certificate-Claude-with-Anthropic-API.pdf`.
- Le certificat est qualifié exactement comme un **Certificate of Completion**, sans l’assimiler à une certification professionnelle réglementée.

## Tests

- Régression v2.6 : 33/33 réussis (`verify_v26.py`).
- Téléchargement CV v2.7 : 23/23 réussis (`verify_v27.py`).
- Certificat v2.8 : 43/43 réussis (`verify_v28.py`).
- Téléchargement du certificat vérifié réellement dans Chromium ; le fichier téléchargé est identique octet par octet au PDF fourni.
- Vérification FR/EN, URL Skilljar, nom de fichier, erreurs JavaScript et tailles 320×568, 390×844, 820×1180 et 1365×768.

## Lancement

- Windows : `start.bat`.
- macOS/Linux : `./start.command`.
- Alternative : `python -m http.server 4173`, puis ouvrir `http://localhost:4173`.

## État de publication

Aucun push GitHub, aucune modification Vercel et aucun déploiement n’ont été réalisés. Cette archive est la livraison locale.

Le lien Skilljar est celui fourni par Kenneth. Son chargement direct n’a pas pu être confirmé depuis l’environnement de test ; le bouton est correctement configuré pour ouvrir l’URL.
