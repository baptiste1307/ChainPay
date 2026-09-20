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

**ChainPay** is a minimalist, developer-friendly payment gateway and verification service for Ethereum and EVM-compatible networks (Base, Polygon, Arbitrum, Optimism, Sepolia).

It eliminates the need for expensive third-party payment gateways by verifying payments directly against the blockchain via JSON-RPC.

- **Zero Intermediaries**: Payments flow directly from the customer's wallet to yours.
- **Zero Processing Fees**: No percentage cuts; you only pay the native blockchain gas fees.
- **Real-Time Web3 UI**: Includes a responsive, dark-themed dashboard inspired by **Nala App** with MetaMask one-click checkout and instant on-chain transaction verification.

---

## 🚀 Key Features

* **Direct On-Chain Settlement (`POST /api/tx`)**: Queries raw JSON-RPC state to verify transaction existence, status, block inclusion, and actual Wei transferred.
* **Checksum & Amount Validation**: Robust address matching (via `ethers.getAddress`) and floating-point safe comparison using native `BigInt` Wei.
* **Block Confirmations Waiting**: Prevents double-spending by awaiting inclusion in mined blocks (`waitForTransaction`).
* **Settled Payments Ledger (`GET /api/payments`)**: In-memory payment ledger tracking verified orders, timestamps, sender addresses, and block numbers.
* **Modern Web3 GUI**: Single-page application served out-of-the-box on `/` featuring a live network pulse, MetaMask integration, and transaction inspector.
* **CLI Testing Tools**: Ready-to-use scripts to check balances (`npm run check-balance`) and broadcast testnet payments (`npm run send-payment`).

---

## 🖥️ Web Dashboard

When the server is running, navigating to `http://localhost:3001` launches the **ChainPay Dashboard**:

1. **Live Network Status**: Displays current EVM block height, connected network, and service health.
2. **MetaMask Checkout**: Connect any Web3 browser wallet, pick an amount, and initiate payment with one click.
3. **Transaction Inspector**: Paste any `txHash` to trigger real-time blockchain validation and view block settlement receipts.
4. **Live Payments Ledger**: Displays confirmed transactions in real-time with direct links to the Sepolia Etherscan explorer.

---

## 🚦 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/baptiste1307/Crypto_Payment_Integration.git chainpay
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
DEFAULT_RECIPIENT="0x445Aaae218d736acD1658c31B09Fe0263f466965"

# Server Port (optional, defaults to 3001)
PORT=3001
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (with file watching)
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser!

---

## 📡 API Reference

### 1. Verify Payment
* **URL**: `/api/tx` *(or `/tx`)*
* **Method**: `POST`
* **Content-Type**: `application/json`

**Request Body:**
```json
{
  "txHash": "0x5a2d8f9b...",
  "amount": 0.001,
  "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965"
}
```

**Successful Response (`200 OK`):**
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

**Rejection Response (`400 Bad Request`):**
```json
{
  "status": "rejected",
  "message": "Recipient mismatch. Expected: 0x445Aaae..., Actual: 0x981bc..."
}
```

---

### 2. Get Settled Payments
* **URL**: `/api/payments` *(or `/payments`)*
* **Method**: `GET`

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
```

---

### 3. Health & Network Check
* **URL**: `/api/health`
* **Method**: `GET`

**Response (`200 OK`):**
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

* **Check testnet wallet balance:**
  ```bash
  npm run check-balance
  ```
* **Send a test payment on Sepolia:**
  ```bash
  npm run send-payment
  ```

---

## 🏗️ Architecture & Philosophy

The architecture of ChainPay is built upon the principles outlined in John Ousterhout’s **A Philosophy of Software Design**:

1. **Deep Modules**: `PaymentService` hides all blockchain complexities (JSON-RPC requests, checksum normalization, BigInt Wei conversions, block confirmation polling) behind an intuitive 2-method API.
2. **No "Classitis"**: Avoids redundant pass-through layers, mapper classes, or bloated abstractions.
3. **Pull Complexity Downward**: The caller (HTTP controllers or Web3 UI) does not manage retry intervals, Wei conversions, or address casing. The underlying service handles all edge cases cleanly.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full architectural rationale.

---

## ☁️ Deployment (Render / Railway)

### Deploying to Render.com in 3 minutes:
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
