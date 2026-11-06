# Desk95 KPANOU Kenneth — v2.6

## Changements

- Fond animé : vidéo Cloudflare R2 fournie par Kenneth.
- Chargement vidéo différé : aucune requête vidéo au boot ; chargement après entrée sur le bureau.
- Vidéo : muette, boucle, `playsinline`, `preload="none"`.
- Le fond vidéo se met en pause lorsque l’onglet est masqué.
- `About Kenneth` n’est plus ouvert automatiquement au démarrage.
- Position par défaut de `About Kenneth` déplacée dans la zone centrale correspondant au geste du lapin ; l’utilisateur peut toujours la déplacer.
- Clé de persistance des icônes versionnée pour éviter qu’une ancienne position locale ne réécrase la nouvelle disposition.
- Sélecteur FR / EN ajouté dans la barre des tâches.
- Français conservé comme langue par défaut au premier chargement.
- Traduction anglaise ajoutée aux principales fenêtres et fiches projet, avec conservation des noms de fichiers et noms propres.
- Langue choisie mémorisée pour les visites suivantes.
- Les métadonnées GitHub utilisent maintenant un format de date adapté à la langue sélectionnée.

## Vérification

`verify_v26.py` : **33/33 tests passés, 0 échec, 0 erreur JavaScript**.

Formats vérifiés : 1365×768, 1024×768, 390×844 et 320×568.

## Remarque

La vidéo de production reste distante et n’est pas embarquée dans l’archive. Les tests utilisent un petit fichier vidéo local de fixture afin de vérifier le comportement sans dépendre du réseau.
