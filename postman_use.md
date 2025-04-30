# Guide de Test des API de la Stack MEAN

Ce fichier fournit des instructions sur comment tester tous les endpoints de cette projet MEAN stack en utilisant Postman.

## Configuration

1. Assurez-vous que le serveur est en cours d'exécution en exécutant `node server.js`  depuis le répertoire du backend.
2. L'API s'exécute généralement sur `http://localhost:3000` (ou le port que vous avez configuré).
3. Créez une collection Postman pour organiser vos requêtes.

## Authentification

### Enregistrer un Utilisateur
- **Méthode**: POST
- **URL**: `http://localhost:3000/api/auth/register`
- **Corps** (JSON raw):
```json
{
  "name": "Mohamed EL Gorrim",
  "email": "contact@med.com",
  "password": "motdepasse123"
}
```

### Connexion
- **Méthode**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Corps** (JSON raw):
```json
{
  "email": "contact@med.com",
  "password": "motdepasse123"
}
```
- Cela renverra un Token (JWT) que vous devrez utiliser pour les endpoints authentifiés
- Dans Postman, copiez le token de la réponse et ajoutez-le à vos requêtes authentifiées dans l'onglet Autorisation:
  - Type: Bearer Token
  - TOKEN: [collez votre token ici]

## Produits

### Obtenir Tous les Produits
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/produits`
- **Autorisation**: Bearer Token

### Obtenir un Produit par ID
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/produits/:id`
- **Autorisation**: Bearer Token
- Remplacez `:id` par l'ID réel du produit

### Créer un Produit
- **Méthode**: POST
- **URL**: `http://localhost:3000/api/produits`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "libelle": "Nom du Produit",
  "pu": 19.99
}
```

### Mettre à Jour un Produit
- **Méthode**: PUT
- **URL**: `http://localhost:3000/api/produits/:id`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "libelle": "Nom du Produit Mis à Jour",
  "pu": 24.99
}
```

### Supprimer un Produit
- **Méthode**: DELETE
- **URL**: `http://localhost:3000/api/produits/:id`
- **Autorisation**: Bearer Token

## Clients

### Obtenir Tous les Clients
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/clients`
- **Autorisation**: Bearer Token

### Obtenir un Client par ID
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/clients/:id`
- **Autorisation**: Bearer Token
- Remplacez `:id` par l'ID réel du client

### Créer un Client
- **Méthode**: POST
- **URL**: `http://localhost:3000/api/clients`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "nom": "Nom du Client",
  "age": 30,
  "email": "client@exemple.com"
}
```

### Mettre à Jour un Client
- **Méthode**: PUT
- **URL**: `http://localhost:3000/api/clients/:id`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "nom": "Nom du Client Mis à Jour",
  "age": 31,
  "email": "client.mis.a.jour@exemple.com"
}
```

### Supprimer un Client
- **Méthode**: DELETE
- **URL**: `http://localhost:3000/api/clients/:id`
- **Autorisation**: Bearer Token

## Commandes

### Obtenir Toutes les Commandes
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/commandes`
- **Autorisation**: Bearer Token

### Obtenir une Commande par ID
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/commandes/:id`
- **Autorisation**: Bearer Token
- Remplacez `:id` par l'ID réel de la commande

### Créer une Commande
- **Méthode**: POST
- **URL**: `http://localhost:3000/api/commandes`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "client": "6151a1d5e7b1f23a4c5d6e7f",
  "date": "2023-08-15T10:30:00.000Z",
  "lignes": [
    {
      "produit": "6151a1d5e7b1f23a4c5d6e8f",
      "qte": 2
    },
    {
      "produit": "6151a1d5e7b1f23a4c5d6e9f",
      "qte": 1
    }
  ]
}
```
- Note: Remplacez les IDs par des IDs MongoDB réels de votre base de données

### Mettre à Jour une Commande
- **Méthode**: PUT
- **URL**: `http://localhost:3000/api/commandes/:id`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "client": "6151a1d5e7b1f23a4c5d6e7f",
  "date": "2023-08-16T10:30:00.000Z"
}
```

### Supprimer une Commande
- **Méthode**: DELETE
- **URL**: `http://localhost:3000/api/commandes/:id`
- **Autorisation**: Bearer Token

## Lignes de Commande

### Obtenir Toutes les Lignes de Commande
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/ligneCmd`
- **Autorisation**: Bearer Token

### Obtenir les Lignes de Commande par ID de Commande
- **Méthode**: GET
- **URL**: `http://localhost:3000/api/ligneCmd/commande/:id`
- **Autorisation**: Bearer Token
- Remplacez `:id` par l'ID réel de la commande

### Créer une Ligne de Commande
- **Méthode**: POST
- **URL**: `http://localhost:3000/api/ligneCmd`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "commande": "6151a1d5e7b1f23a4c5d6e7f",
  "produit": "6151a1d5e7b1f23a4c5d6e8f",
  "qte": 3
}
```

### Mettre à Jour une Ligne de Commande
- **Méthode**: PUT
- **URL**: `http://localhost:3000/api/ligneCmd/:id`
- **Autorisation**: Bearer Token
- **Corps** (JSON raw):
```json
{
  "qte": 5
}
```

### Supprimer une Ligne de Commande
- **Méthode**: DELETE
- **URL**: `http://localhost:3000/api/ligneCmd/:id`
- **Autorisation**: Bearer Token

## Exemple de Flux de Test !

1. Enregistrez un utilisateur et connectez-vous pour obtenir votre jeton JWT
2. Créez un client
3. Créez quelques produits
4. Créez une commande pour le client avec quelques lignes de commande
5. Obtenez toutes les commandes pour vérifier votre nouvelle commande
6. Obtenez une commande spécifique par ID pour voir ses détails et ses lignes
7. Mettez à jour un prix de produit ou une quantité de commande
8. Supprimez une ligne de commande
9. Supprimez une commande entière

## Problèmes possibles que vous pourriez rencontrer (et comment vous pouvez les resoudre !)

- Si vous obtenez une erreur 401 Non autorisé, vérifiez si votre Token est valide et correctement ajouté en tant que Bearer TOKEN
- Si vous obtenez une erreur 404 Non trouvé, vérifiez que l'ID que vous utilisez existe dans la base de données
- Si vous obtenez une erreur 500 Erreur Serveur, consultez le logs du serveur pour plus d'informations détaillées (erreur dans le logique du code)
```

Bon test !
