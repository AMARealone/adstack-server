# AdStack Image Generator — Setup

## Prérequis
- Node.js installé (https://nodejs.org)
- Google Cloud SDK installé (https://cloud.google.com/sdk/docs/install)

## Installation (une seule fois)

### 1. Authentification Google Cloud
```bash
gcloud auth application-default login
```
→ Une fenêtre s'ouvre dans le navigateur → connecte-toi avec ton compte Google AdStack

### 2. Installer les dépendances
```bash
cd adstack-server
npm install
```

## Lancement (à chaque utilisation)

```bash
cd adstack-server
node server.js
```

→ Ouvre http://localhost:3001 dans ton navigateur

## Utilisation
1. Upload le wireframe CT
2. Upload la photo produit
3. Colle le prompt depuis l'outil Prompt Engine
4. Clique "Générer"
5. Télécharge ou régénère

## Coûts Vertex AI (sur tes $300 crédits Google Cloud)
- gemini-2.5-flash-image : $0.039 / image
- gemini-3.1-flash-image-preview : $0.067 / image
- gemini-3-pro-image-preview : $0.134 / image
