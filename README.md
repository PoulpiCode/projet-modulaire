# Outil de Migration CSV

Ce projet permet l'importation et l'affichage de fichiers CSV volumineux via une interface web fluide.

## Architecture

- **IHM** : Interface utilisateur (HTML5 / Nginx) - Accessible sur le port 8080 (ou celui configuré).
- **Traitement** : Moteur d'analyse et de migration (Python FastAPI).

## Lancement Rapide

### 1. Démarrer le projet

Ouvrez un terminal dans le dossier du projet et saisissez :

```bash
docker-compose up -d --build
```

### 2. Accéder à l'outil

Ouvrez votre navigateur à l'adresse suivante :

http://localhost:8080

### 3. Utilisation

- Cliquez sur "Choisir un fichier" pour sélectionner votre CSV.
- Cliquez sur "Lancer l'import".
- Le tableau de prévisualisation s'affichera automatiquement une fois le traitement terminé.

## Commandes de maintenance

| Action | Commande |
|--------|----------|
| Arrêter l'outil | `docker-compose down` |
| Redémarrer après modification | `docker-compose up -d --build` |
| Vérifier l'état | `docker-compose ps` |
| Voir les logs | `docker logs -f service_traitement` |

