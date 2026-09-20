<p align="center">
  <img src="public/assets/logo.svg" alt="ChainPay Logo" width="380" />
</p>

<p align="center">
  <strong>Lightweight EVM crypto payment gateway and transaction verification API.</strong>
</p>

<p align="center">
  <a href="#key-features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#web-dashboard">Web Dashboard</a> •
  <a href="#api-reference">API Docs</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#architecture">Architecture</a>
  <a href="#-explain-like-im-5-eli5">Beginners (ELI5)</a> •
  <a href="#-prerequisites">Prerequisites</a> •
  <a href="#-quick-start-local">Quick Start</a> •
  <a href="#-deploy-online-in-3-minutes-free">Deploy Online</a> •
  <a href="#%EF%B8%8F-deep-dive-for-developers">For Developers</a> •
  <a href="#-api-reference">API Docs</a> •
  <a href="#-why-chainpay-who-is-this-for">Why ChainPay?</a>
</p>

<p align="center">
  <a href="docs/GUIDE_FR.md">🇫🇷 Lire le guide complet en Français</a> •
  <a href="docs/API_REFERENCE.md">📖 Detailed API Reference</a> •
  <a href="docs/ARCHITECTURE.md">🏗️ Architecture Design</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-black?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-v5-black?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Ethers.js-v6-black?style=flat-square" alt="Ethers.js" />
  <img src="https://img.shields.io/badge/Network-EVM%20%2F%20Sepolia-black?style=flat-square&logo=ethereum" alt="Ethereum" />
  <img src="https://img.shields.io/badge/License-MIT-black?style=flat-square" alt="License" />
</p>

---

## ⚡ Overview
## 💡 Explain Like I'm 5 (ELI5)

**ChainPay** is a minimalist, developer-friendly payment gateway and verification service for Ethereum and EVM-compatible networks (Base, Polygon, Arbitrum, Optimism, Sepolia).
### The Problem With Traditional Online Payments
When you buy something online with a credit card or services like PayPal, Stripe, or Coinbase Commerce:
1. **Middlemen take a cut**: Usually 1.5% to 3% + fixed fees per transaction.
2. **Account risk**: Intermediaries can freeze your funds, block your account, or charge back payments without notice.
3. **Bureaucracy**: You must submit IDs, company papers, and wait days for KYC approval.

It eliminates the need for expensive third-party payment gateways by verifying payments directly against the blockchain via JSON-RPC.
### How ChainPay Solves This
Imagine handing physical cash directly to a store cashier: **no middlemen, zero commission, and nobody can stop or reverse the exchange**.

- **Zero Intermediaries**: Payments flow directly from the customer's wallet to yours.
- **Zero Processing Fees**: No percentage cuts; you only pay the native blockchain gas fees.
- **Real-Time Web3 UI**: Includes a responsive, dark-themed dashboard inspired by **Nala App** with MetaMask one-click checkout and instant on-chain transaction verification.
**ChainPay brings that same peer-to-peer simplicity to the internet using blockchain technology:**
- **Direct P2P**: The buyer sends cryptocurrency straight from their personal wallet (e.g. MetaMask) into your personal wallet.
- **Automatic Truth-Checking**: ChainPay doesn't hold your money. Instead, it acts like an automated auditor: it checks the public blockchain ledger in real-time to answer:
  - *“Did the customer actually send the crypto?”*
  - *“Was it sent to the right merchant wallet?”*
  - *“Was the exact expected amount delivered?”*
- **Instant Order Fulfillment**: As soon as the blockchain confirms the transaction, ChainPay validates the order in 1 second.

---

## 🚀 Key Features
## 🧰 Prerequisites

- **Direct On-Chain Settlement (`POST /api/tx`)**: Queries raw JSON-RPC state to verify transaction existence, status, block inclusion, and actual Wei transferred.
- **Checksum & Amount Validation**: Robust address matching (via `ethers.getAddress`) and floating-point safe comparison using native `BigInt` Wei.
- **Block Confirmations Waiting**: Prevents double-spending by awaiting inclusion in mined blocks (`waitForTransaction`).
- **Settled Payments Ledger (`GET /api/payments`)**: In-memory payment ledger tracking verified orders, timestamps, sender addresses, and block numbers.
- **Modern Web3 GUI**: Single-page application served out-of-the-box on `/` featuring a live network pulse, MetaMask integration, and transaction inspector.
- **CLI Testing Tools**: Ready-to-use scripts to check balances (`npm run check-balance`) and broadcast testnet payments (`npm run send-payment`).
You do not need any real money to test and run ChainPay! Everything runs on the **Sepolia EVM testnet** using free test tokens.

---
| Prerequisite | Purpose | Where to get it (100% Free) |
| :--- | :--- | :--- |
| **Node.js (v18+)** | Runtime to execute the server. | [nodejs.org](https://nodejs.org/) |
| **MetaMask Wallet** | Browser extension to hold test tokens and sign payments. | [metamask.io](https://metamask.io/) |
| **Free Sepolia Test ETH** | Fictional test currency used to make test payments. | • [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)<br>• [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) |
| **RPC Endpoint** | API URL allowing your server to query the blockchain. | Free accounts at [Alchemy.com](https://www.alchemy.com/) or [Infura.io](https://infura.io/) |

## 🖥️ Web Dashboard

When the server is running, navigating to `http://localhost:3001` launches the **ChainPay Dashboard**:

1. **Live Network Status**: Displays current EVM block height, connected network, and service health.
2. **MetaMask Checkout**: Connect any Web3 browser wallet, pick an amount, and initiate payment with one click.
3. **Transaction Inspector**: Paste any `txHash` to trigger real-time blockchain validation and view block settlement receipts.
4. **Live Payments Ledger**: Displays confirmed transactions in real-time with direct links to the Sepolia Etherscan explorer.

---

## 🚦 Quick Start
## 🚦 Quick Start (Local)

### 1. Clone & Install

```bash
git clone https://github.com/baptiste1307/ChainPay.git chainpay
cd chainpay
npm install
```

### 2. Environment Configuration

Copy the template configuration:

```bash
cp .env.example .env
```

Edit your `.env` file:

```env
# Alchemy, Infura, or any EVM RPC endpoint (Sepolia testnet recommended)
RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"

# Private key for CLI test transactions (Keep secret! Testnet only!)
PRIVATE_KEY="0xYOUR_TESTNET_PRIVATE_KEY"

# Merchant recipient address
# Merchant recipient wallet address (where payments are sent)
DEFAULT_RECIPIENT="0x445Aaae218d736acD1658c31B09Fe0263f466965"

# Server Port (optional, defaults to 3001)
# Server Port (defaults to 3001)
PORT=3001
```

### 3. Start the Server

```bash
# Production mode
npm start

# Development mode (with file watching)
# Development mode (with auto-reload on code change)
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser!
Open your browser at **[http://localhost:3001](http://localhost:3001)** to see the Web3 Dashboard!

---

## 📡 API Reference
## 🌐 Deploy Online in 3 Minutes (Free)

### 1. Verify Payment
> **You do NOT need to keep this running only on your computer!**  
> Anyone on the internet can test your live Web3 payment dashboard by deploying it to a free cloud hosting provider like [Render](https://render.com/).

- **URL**: `/api/tx` _(or `/tx`)_
- **Method**: `POST`
- **Content-Type**: `application/json`
### Step-by-Step Deployment on Render.com:

**Request Body:**
1. Push your repository to your **GitHub** profile.
2. Sign up / Log in to **[Render.com](https://render.com/)**.
3. Click **New +** and select **Web Service**.
4. Connect your GitHub repository (`Crypto_Payment_Integration`).
5. Configure the service:
   - **Name**: `chainpay-live`
   - **Language**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Under **Environment Variables**, add:
   - `RPC_URL` : Your Alchemy or Infura Sepolia RPC URL
   - `DEFAULT_RECIPIENT` : Your Ethereum wallet address
7. Click **Deploy Web Service**.

```json
{
  "txHash": "0x5a2d8f9b...",
  "amount": 0.001,
  "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965"
}
```
Render will build and serve your app with a free HTTPS URL (e.g. `https://chainpay-live.onrender.com`), making your payment dashboard accessible to anyone in the world!

**Successful Response (`200 OK`):**
---

```json
{
  "status": "confirmed",
  "message": "Payment verified and confirmed on-chain.",
  "payment": {
    "txHash": "0x5a2d8f9b...",
    "from": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965",
    "amount": "0.001",
    "blockNumber": 5839201,
    "confirmations": 1,
    "timestamp": "2026-09-20T15:00:00.000Z",
    "status": "confirmed"
  }
}
```
## 🖥️ Web Dashboard Tour

**Rejection Response (`400 Bad Request`):**
When navigating to the dashboard, users and merchants have access to:

```json
{
  "status": "rejected",
  "message": "Recipient mismatch. Expected: 0x445Aaae..., Actual: 0x981bc..."
}
```
1. **Live Network Pulse**: Real-time Sepolia block height indicator and health check status.
2. **1-Click MetaMask Checkout**: Preset amount chips (0.001 ETH, 0.005 ETH, etc.) and instant transaction broadcast via window.ethereum.
3. **Automatic Inspector**: Automatically fills the transaction hash upon broadcast and queries the verification endpoint.
4. **Settled Payments Ledger**: Real-time table displaying recent payments with timestamps, block numbers, and direct links to Sepolia Etherscan.

---

### 2. Get Settled Payments
## 🛠️ Deep-Dive for Developers

- **URL**: `/api/payments` _(or `/payments`)_
- **Method**: `GET`
ChainPay is built adhering to the principles in John Ousterhout’s *A Philosophy of Software Design* (2nd Edition):

**Response (`200 OK`):**

```json
[
  {
    "txHash": "0x5a2d8f9b...",
    "from": "0x70997970...",
    "to": "0x445Aaae...",
    "amount": "0.001",
    "blockNumber": 5839201,
    "timestamp": "2026-09-20T15:00:00.000Z",
    "status": "confirmed"
  }
]
```text
Payment Flow Architecture:
[User / Web3 Wallet]
         │
         ▼  (1) Broadcast signed tx (eth_sendTransaction)
[EVM Blockchain] ◄────── (2) Mined into block (Block #5839210)
         ▲
         │  (4) Verify on-chain via JSON-RPC (eth_getTransactionByHash + Receipt)
[ChainPay Backend] ◄────── (3) POST /api/tx { txHash, amount, to }
         │
         ▼
[Payment Ledger] ──────► (5) HTTP 200 { status: "confirmed" }
```

---
### 1. Deep Module Architecture (`PaymentService`)
All RPC communication, hex parsing, block polling, and mathematical validations are encapsulated inside `src/services/paymentService.js`. The HTTP controllers and UI remain featherweight and completely decoupled from blockchain intricacies.

### 3. Health & Network Check
### 2. Lossless BigInt Wei Arithmetic
Floating-point mathematics in standard JavaScript (`0.1 + 0.2 !== 0.3`) causes severe financial vulnerabilities. ChainPay avoids float math completely:
- Inputs are parsed to fundamental atomic units (**Wei**, $10^{18}$) via `ethers.parseEther`.
- Comparisons use native 256-bit `BigInt`:
  ```javascript
  const expectedWei = ethers.parseEther(amount.toString());
  if (tx.value < expectedWei) {
    return { success: false, message: "Insufficient payment amount." };
  }
  ```

- **URL**: `/api/health`
- **Method**: `GET`
### 3. EIP-55 Address Checksum Normalization
Ethereum addresses can be formatted in lower case, uppercase, or mixed-case checksums. ChainPay passes all addresses through `ethers.getAddress` prior to comparison, preventing address spoofing and casing mismatch bugs.

**Response (`200 OK`):**
### 4. Reorg & Double-Spending Protection
A transaction in the mempool can be cancelled or speed-run. `PaymentService` leverages `provider.waitForTransaction(txHash, confirmations)` to guarantee:
- The transaction has been included in a finalized block.
- The EVM execution receipt status is strictly `1` (Success), preventing reverted calls from registering as valid payments.

```json
{
  "status": "healthy",
  "network": "Sepolia (EVM Testnet)",
  "chainId": 11155111,
  "currentBlock": 5839205,
  "defaultRecipient": "0x445Aaae218d736acD1658c31B09Fe0263f466965"
}
```

---

## 🛠️ CLI Utilities
## 📡 API Reference

- **Check testnet wallet balance:**
  ```bash
  npm run check-balance
### 1. Verify Payment
- **Method**: `POST`
- **Route**: `/api/tx`
- **Payload**:
  ```json
  {
    "txHash": "0x5a2d8f9b...",
    "amount": 0.001,
    "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965"
  }
  ```
- **Send a test payment on Sepolia:**
  ```bash
  npm run send-payment
- **Response (`200 OK`)**:
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
      "confirmations": 1,
      "timestamp": "2026-09-20T15:20:00.000Z",
      "status": "confirmed"
    }
  }
  ```

---
### 2. View Settled Payments
- **Method**: `GET`
- **Route**: `/api/payments`
- Returns the list of all verified payments recorded during the server runtime.

## 🏗️ Architecture & Philosophy
### 3. Node & Network Health
- **Method**: `GET`
- **Route**: `/api/health`
- Returns network name, current block height, chain ID, and RPC status.

The architecture of ChainPay is built upon the principles outlined in John Ousterhout’s **A Philosophy of Software Design**:

1. **Deep Modules**: `PaymentService` hides all blockchain complexities (JSON-RPC requests, checksum normalization, BigInt Wei conversions, block confirmation polling) behind an intuitive 2-method API.
2. **No "Classitis"**: Avoids redundant pass-through layers, mapper classes, or bloated abstractions.
3. **Pull Complexity Downward**: The caller (HTTP controllers or Web3 UI) does not manage retry intervals, Wei conversions, or address casing. The underlying service handles all edge cases cleanly.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full architectural rationale.

---

## ☁️ Deployment (Render / Railway)
## 💡 Why ChainPay? Who is this for?

### Deploying to Render.com in 3 minutes:
| Target Audience | Why They Care |
| :--- | :--- |
| **Indie Hackers & Solo SaaS** | Want to accept payments worldwide without opening a registered company or paying 3% Stripe fees. |
| **P2P Creators & Donors** | Free, open-source alternative to "Buy Me a Coffee" or Patreon with zero platform cuts. |
| **Web3 Developers & Recruiters** | Clean, production-grade example of Ethers.js v6, JSON-RPC queries, precision math, and Ousterhout software architecture. |

1. Push this repository to your GitHub account.
2. Log into [Render.com](https://render.com/) and click **New + > Web Service**.
3. Select this repository.
4. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add:
   - `RPC_URL`: Your Alchemy / Infura Sepolia endpoint.
   - `DEFAULT_RECIPIENT`: Your merchant wallet address.
6. Click **Deploy Web Service** — your API and Web3 Dashboard are instantly live in HTTPS!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
Distributed under the MIT License. Built with ❤️ by [baptiste1307](https://github.com/baptiste1307).
