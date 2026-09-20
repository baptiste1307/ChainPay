# ⚡ ChainPay — Passerelle de Paiement Crypto EVM

<p align="center">
  <img src="public/assets/logo.svg" alt="ChainPay Logo" width="380" />
</p>

<p align="center">
  <strong>Passerelle de paiement crypto sans intermédiaire et API de vérification de transactions on-chain.</strong>
</p>

<p align="center">
  <a href="#-explique-moi-comme-si-j'avais-5-ans-eli5">Pour les débutants</a> •
  <a href="#-prérequis-détaillés">Prérequis</a> •
  <a href="#-démarrage-rapide-en-local">Installation</a> •
  <a href="#-mettre-le-site-en-ligne-gratuitement">Déploiement en ligne</a> •
  <a href="#-explications-techniques-pour-développeurs">Section Devs</a> •
  <a href="#-api-reference">API</a>
</p>

<p align="center">
  <a href="README.md">🇬🇧 Switch to English README</a>
</p>

<p align="center">
  <a href="https://chainpay-xhl0.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Démo_en_Ligne-chainpay--xhl0.onrender.com-00DC82?style=for-the-badge&logo=render&logoColor=white" alt="Démo en ligne sur Render" />
  </a>
</p>

---

## 💡 Explique-moi comme si j'avais 5 ans (ELI5)

### Le problème avec les paiements classiques

Quand vous payez par carte sur Internet ou via des plateformes comme PayPal ou Coinbase Commerce :

1. Un intermédiaire prend une commission (souvent 1,5% à 3% de chaque vente).
2. Cet intermédiaire peut bloquer votre compte ou geler votre argent sans préavis.
3. Le client et le marchand doivent remplir des formulaires d'inscription interminables (KYC).

### La solution ChainPay

Imaginez que vous donniez un billet de banque directement de la main à la main à un commerçant : **aucun intermédiaire, aucun frais de commission, personne pour bloquer la transaction**.

**ChainPay fait exactement ça, mais sur Internet grâce à la blockchain :**

1. **L'acheteur** envoie les cryptomonnaies directement depuis son portefeuille numérique (ex: MetaMask) vers le portefeuille du marchand.
2. **Le serveur ChainPay** regarde directement dans le grand livre public et infalsifiable de la blockchain (_Ethereum / Sepolia_) pour vérifier :
   - _« Est-ce que l'argent est bien arrivé ? »_
   - _« Est-ce que c'est bien la bonne adresse de destination ? »_
   - _« Est-ce que le montant reçu est suffisant ? »_
3. Dès que la blockchain confirme le virement, ChainPay valide la commande en une seconde chrono !

---

## 🧰 Prérequis détaillés (Ce qu'il vous faut avant de commencer)

Pour tester ChainPay, vous n'avez besoin d'aucun argent réel ! Tout fonctionne sur un réseau de test gratuit appelé **Sepolia**.

| Prérequis                      | À quoi ça sert ?                                                                     | Comment l'obtenir ?                                                                                                                                                                                                                |
| :----------------------------- | :----------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js (v18+)**             | Le moteur pour exécuter le serveur sur votre machine.                                | Téléchargeable gratuitement sur [nodejs.org](https://nodejs.org/).                                                                                                                                                                 |
| **Extension MetaMask**         | Votre portefeuille crypto Web3 dans votre navigateur (Chrome, Brave, Firefox, Edge). | À installer depuis [metamask.io](https://metamask.io/).                                                                                                                                                                            |
| **Faux ETH Sepolia (Gratuit)** | Du carburant de test pour effectuer des virements fictifs.                           | Obtenez-en gratuitement en 1 clic sur :<br>• [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)<br>• [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) |
| **Un endpoint RPC (Gratuit)**  | La passerelle qui permet au serveur de poser des questions à la blockchain.          | Créez un compte gratuit sur [Alchemy.com](https://www.alchemy.com/) ou [Infura.io](https://infura.io/) pour obtenir une URL Sepolia.                                                                                               |

---

## 🚀 Démarrage rapide en local (3 minutes)

### 1. Télécharger le projet

Ouvrez votre terminal et lancez :

```bash
git clone https://github.com/baptiste1307/Crypto_Payment_Integration.git chainpay
cd chainpay
npm install
```

### 2. Configurer les clés

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Ouvrez le fichier `.env` avec votre éditeur et remplissez :

```env
# URL de connexion à la blockchain (Alchemy ou Infura)
RPC_URL="https://eth-sepolia.g.alchemy.com/v2/VOTRE_CLE_API"

# Adresse publique de votre portefeuille (qui recevra les paiements)
DEFAULT_RECIPIENT="0x445Aaae218d736acD1658c31B09Fe0263f466965"

# Port du serveur (3001 par défaut)
PORT=3001
```

### 3. Lancer l'application

```bash
npm start
```

Ouvrez ensuite votre navigateur sur : **[http://localhost:3001](http://localhost:3001)**

1. Cliquez sur **"Connect Wallet"** pour associer votre MetaMask.
2. Choisissez un montant (ex: `0.001 ETH`).
3. Cliquez sur **"Pay with MetaMask"** et signez la transaction.
4. ChainPay détecte le paiement, attend l'inclusion dans le bloc et affiche un badge vert de confirmation !

---

## 🌐 Mettre le site en ligne gratuitement (En 3 minutes sur Render)

> **Oui ! Le site n'est pas limité à votre machine locale.** Vous pouvez l'héberger en ligne pour que n'importe qui dans le monde puisse tester votre passerelle avec son propre MetaMask.

### Tutoriel pas-à-pas pour Render.com :

1. Assurez-vous d'avoir poussé votre projet sur votre compte **GitHub**.
2. Créez un compte gratuit sur **[Render.com](https://render.com/)**.
3. Sur votre tableau de bord Render, cliquez sur **New +** puis **Web Service**.
4. Sélectionnez votre dépôt GitHub `Crypto_Payment_Integration`.
5. Renseignez les paramètres suivants :
   - **Name** : `chainpay-demo`
   - **Region** : Frankfurt (Europe) ou Oregon (US)
   - **Language** : `Node`
   - **Branch** : `main`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free`
6. Dans la section **Environment Variables**, ajoutez :
   - `RPC_URL` = Votre URL RPC Sepolia Alchemy
   - `DEFAULT_RECIPIENT` = Votre adresse Ethereum
7. Cliquez sur **Create Web Service**.

En moins de 2 minutes, vous aurez une URL publique sécurisée en HTTPS (ex: `https://chainpay-demo.onrender.com`) prête à être partagée !

---

## 🛠️ Explications techniques pour développeurs

ChainPay a été conçu en respectant scrupuleusement les principes de John Ousterhout (_A Philosophy of Software Design_).

```text
Flux architectural :
[Client Browser / MetaMask]
         │
         ▼  (1) Envoi de la transaction signée
[Blockchain EVM / Sepolia] ◄────── (2) Mined in block #5839210
         ▲
         │  (4) Vérification JSON-RPC (eth_getTransactionByHash + eth_getTransactionReceipt)
[Backend ChainPay Express] ◄────── (3) POST /api/tx { txHash, amount, to }
         │
         ▼
[Registre In-Memory / DB] ──────► (5) 200 OK Confirmed
```

### 1. Modules Profonds (_Deep Modules_)

Le composant central `PaymentService` (`src/services/paymentService.js`) masque toute la complexité de l'écosystème blockchain derrière 2 méthodes simples :

- `verifyPayment({ txHash, amount, to })`
- `getAllPayments()`

### 2. Arithmétique sécurisée en Wei (BigInt)

En JavaScript standard, les calculs décimaux souffrent d'erreurs d'arrondi (ex: `0.1 + 0.2 !== 0.3`). Pour éviter toute faille financière où un paiement partiel serait accepté :

- Les montants en ETH sont convertis en unité atomique **Wei** ($10^{18}$) via `ethers.parseEther`.
- Les comparaisons sont exécutées en `BigInt` natif 256-bit :
  ```javascript
  const expectedWei = ethers.parseEther(amount.toString());
  if (tx.value < expectedWei) {
    return { success: false, message: "Insufficient payment amount." };
  }
  ```

### 3. Normalisation Checksum EIP-55

Les adresses Ethereum peuvent être écrites en minuscules ou avec une casse mixte représentant un checksum cryptographique. Pour éviter qu'un pirate ne trompe le filtre d'adresse :

- Les adresses sont toujours normalisées avec `ethers.getAddress(address)`.

### 4. Protection contre le Reorg et Double-Spending

Une transaction présente dans la mempool peut être annulée ou remplacée (Speed Up / Cancel). ChainPay utilise `provider.waitForTransaction(txHash, confirmations)` pour s'assurer que :

1. La transaction est effectivement minée dans un bloc.
2. Le statut d'exécution EVM est `1` (succès) et non `0` (revert).

---

## 📡 API Reference

### 1. Vérifier un paiement

- **Route** : `POST /api/tx`
- **Body** :
  ```json
  {
    "txHash": "0x5a2d8f9b...",
    "amount": 0.001,
    "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965"
  }
  ```
- **Réponse (`200 OK`)** :
  ```json
  {
    "status": "confirmed",
    "message": "Payment verified and confirmed on-chain.",
    "payment": {
      "txHash": "0x5a2d8f9b...",
      "from": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965",
      "amount": "0.001",
      "blockNumber": 5839210,
      "status": "confirmed"
    }
  }
  ```

### 2. Consulter le registre des paiements

- **Route** : `GET /api/payments`
- **Réponse** : Liste des transactions confirmées depuis le lancement du service.

### 3. Vérifier la santé du nœud

- **Route** : `GET /api/health`
- **Réponse** : Hauteur de bloc actuelle, nom du réseau et statut de la connexion RPC.

---

## 💼 Pourquoi ce projet a de la valeur (et qui ça intéresse ?)

1. **Les créateurs de Micro-SaaS & Développeurs Indépendants (_Indie Hackers_)** :
   - Ils veulent vendre un outil ou un template sans créer une société enregistrée chez Stripe ni payer des frais de compte marchands.
2. **Les sites de contenu & dons P2P** :
   - Alternative 100% open-source aux boutons "Buy me a coffee" qui prennent une marge.
3. **Les recruteurs Web3 / Ingénierie logicielle** :
   - Montre une maîtrise concrète de Node.js, Express, Ethers.js v6, de la gestion des erreurs blockchain et de l'architecture logicielle propre.

---

## 📄 Licence

Sous licence MIT. Projet open-source créé par [baptiste1307](https://github.com/baptiste1307).
