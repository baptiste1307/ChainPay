# ⚡ ChainPay — Passerelle de Paiement Crypto EVM

<p align="center">
  <img src="public/assets/logo.svg" alt="ChainPay Logo" width="380" />
</p>

<p align="center">
  <strong>Passerelle de paiement crypto sans intermédiaire et API de vérification de transactions on-chain.</strong>
</p>

<p align="center">
  <a href="#-fonctionnalités-clés--atouts-techniques">Fonctionnalités & Tech</a> •
  <a href="#-prérequis-détaillés">Prérequis</a> •
  <a href="#-démarrage-rapide-en-local">Installation</a> •
  <a href="#-mettre-le-site-en-ligne-gratuitement">Déploiement en ligne</a> •
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

## ⚡ Fonctionnalités Clés & Atouts Techniques

ChainPay est une passerelle de paiement open-source et non-custodiale conçue pour Ethereum et les réseaux compatibles EVM (Base, Polygon, Arbitrum, Optimism).

```text
Flux architectural de règlement et vérification :
[Client / Wallet MetaMask]
         │
         ▼  (1) Envoi de la transaction signée (eth_sendTransaction)
[Blockchain EVM / Sepolia] ◄────── (2) Minée dans un bloc (ex: Bloc #5839210)
         ▲
         │  (4) Vérification JSON-RPC (eth_getTransactionByHash + eth_getTransactionReceipt)
[Backend ChainPay Express] ◄────── (3) POST /api/tx { txHash, amount, to }
         │
         ▼
[Registre Settled / DB] ──────► (5) HTTP 200 { status: "confirmed" }
```

- **Règlement Direct Non-Custodial (0% de commission)** : Transferts directs de portefeuille à portefeuille. Aucun intermédiaire ne prélève de pourcentage, aucun risque de gel de compte, et zéro rétrofacturation (_chargeback_).
- **Vérification On-Chain Indépendante (`POST /api/tx`)** : Interrogation directe de l'état JSON-RPC de l'EVM plutôt que de faire confiance à des webhooks tiers, confirmant l'expéditeur, le destinataire et le montant exact.
- **Arithmétique sans perte en Wei (BigInt)** : Tous les montants sont calculés en unités atomiques **Wei** ($10^{18}$) avec le type natif 256-bit `BigInt`, éliminant les failles d'arrondi décimal de JavaScript (IEEE-754).
- **Normalisation Checksum EIP-55** : Résolution automatique de la casse des adresses via `ethers.getAddress`, empêchant les fraudes par spoofing d'adresse ou les erreurs de casse.
- **Protection Anti-Reorg & Double-Dépense** : Attente de l'inclusion dans un bloc miné (`waitForTransaction`) et validation stricte du statut d'exécution EVM (`receipt.status === 1`), empêchant les transactions annulées ou rejetées d'être comptabilisées.
- **Architecture "Deep Module"** : Gestion des appels RPC, des vérifications et des conversions entièrement encapsulée dans `PaymentService` (`src/services/paymentService.js`), laissant les routes HTTP ultra-légères.
- **Dashboard Web3 Prêt à l'Emploi** : Interface moderne et responsive sur `/` avec paiement MetaMask en 1 clic, suivi en direct du bloc réseau et registre des transactions confirmées.

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

En moins de 2 minutes, vous aurez une URL publique sécurisée en HTTPS : **[https://chainpay-xhl0.onrender.com](https://chainpay-xhl0.onrender.com)** prête à être partagée !

> 📖 _Pour les détails d'architecture logicielle (Deep Modules, absence de Classitis, information hiding), consultez [`ARCHITECTURE.md`](ARCHITECTURE.md)._

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

## 📄 Licence

Sous licence MIT. Projet open-source créé par [baptiste1307](https://github.com/baptiste1307).
