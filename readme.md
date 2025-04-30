# LSI SHOP

## Présentation
LSI SHOP est une application web de gestion de commandes, développée dans le cadre d’un examen MEAN STACK. Elle permet la gestion des clients, produits, commandes et lignes de commande, avec authentification sécurisée (JWT) et une interface moderne.

---

## Cahier des charges de l’examen

### 1. Backend (Node.js, Express, MongoDB, Mongoose)
- **Modélisation** :
  - Client : nom, âge, email
  - Produit : libellé, prix unitaire
  - Commande : date, client, lignes de commande
  - Ligne de commande : produit, quantité
- **Relations** :
  - Un client peut avoir plusieurs commandes
  - Une commande contient plusieurs produits via les lignes de commande
- **API REST sécurisée** :
  - CRUD complet pour chaque entiténow let's
  - Authentification JWT (bonus)

### 2. Frontend (Angular, Bootstrap, Tailwind CSS)
- **Composant principal (Order)** :
  - Sélection du client (à gauche)
  - Sélection/modification de la date (en haut à droite)
  - Tableau central : produits, quantités, total par ligne, actions (+/-)
  - Calcul automatique du total TTC (HT + 20% TVA)
  - Impression PDF (bonus)
- **Composants Auth (Login/Register)** :
  - Formulaires modernes et sécurisés
  - Feedback utilisateur (erreurs, succès)
- **Design** :
  - Utilisation de Bootstrap et Tailwind pour un rendu professionnel
  - Responsive et agréable à utiliser

### 3. Bonus
- Authentification JWT
- Impression PDF des commandes

---

## Fonctionnement du projet

### Architecture
- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Frontend** : Angular, Bootstrap, Tailwind CSS
- **Sécurité** : Authentification JWT, gestion des droits

### Lancement du projet
1. **Backend**
   - Installer les dépendances : `npm install`
   - Lancer le serveur : `node server.js`
2. **Frontend**
   - Aller dans le dossier `order/`
   - Installer les dépendances : `npm install`
   - Lancer l’application : `ng serve`
3. **Accès**
   - Frontend : http://localhost:4200
   - Backend API : http://localhost:3000

### Utilisation
- S’inscrire puis se connecter (JWT)
- Gérer les clients, produits, commandes
- Ajouter/modifier/supprimer des lignes de commande
- Générer un PDF de la commande (bonus)

---

## Résultat en images

> **Insérez ici vos captures d’écran principales :**
> - Page de connexion (Login)
![image](https://github.com/user-attachments/assets/8718e645-b7ea-44ad-9ade-79ae4d1cef38)

> - Page d’inscription (Register)
![image](https://github.com/user-attachments/assets/c9bd73a7-834d-4bbc-83e1-7a2e22083fc7)

> - Vue principale de gestion des commandes (Order)
![image](https://github.com/user-attachments/assets/f2882da2-dd71-4218-879c-c7ce09959539)

> - Exemple de PDF généré
![image](https://github.com/user-attachments/assets/33f8c874-6589-42a3-bb34-3df41be148b8)


---

## Remarques
- Projet réalisé sous Linux, Angular 19, Node.js 22, MongoDB
- Design responsive, expérience utilisateur soignée
- Respect des bonnes pratiques de sécurité et de développement

---

## Auteurs
- Mohamed EL Gorrim

---

**Bon test et bonne découverte de LSI SHOP !**
