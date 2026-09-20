<p align="center">
  <img src="public/assets/logo.svg" alt="ChainPay Logo" width="380" />
</p>

<p align="center">
  <strong>Lightweight EVM crypto payment gateway and transaction verification API.</strong>
</p>

<p align="center">
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
  <a href="https://chainpay-xhl0.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-chainpay--xhl0.onrender.com-00DC82?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo on Render" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-black?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-v5-black?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Ethers.js-v6-black?style=flat-square" alt="Ethers.js" />
  <img src="https://img.shields.io/badge/Network-EVM%20%2F%20Sepolia-black?style=flat-square&logo=ethereum" alt="Ethereum" />
  <img src="https://img.shields.io/badge/License-MIT-black?style=flat-square" alt="License" />
</p>

---

## 💡 Explain Like I'm 5 (ELI5)

### The Problem With Traditional Online Payments

When you buy something online with a credit card or services like PayPal, Stripe, or Coinbase Commerce:

1. **Middlemen take a cut**: Usually 1.5% to 3% + fixed fees per transaction.
2. **Account risk**: Intermediaries can freeze your funds, block your account, or charge back payments without notice.
3. **Bureaucracy**: You must submit IDs, company papers, and wait days for KYC approval.

### How ChainPay Solves This

Imagine handing physical cash directly to a store cashier: **no middlemen, zero commission, and nobody can stop or reverse the exchange**.

**ChainPay brings that same peer-to-peer simplicity to the internet using blockchain technology:**

- **Direct P2P**: The buyer sends cryptocurrency straight from their personal wallet (e.g. MetaMask) into your personal wallet.
- **Automatic Truth-Checking**: ChainPay doesn't hold your money. Instead, it acts like an automated auditor: it checks the public blockchain ledger in real-time to answer:
  - _“Did the customer actually send the crypto?”_
  - _“Was it sent to the right merchant wallet?”_
  - _“Was the exact expected amount delivered?”_
- **Instant Order Fulfillment**: As soon as the blockchain confirms the transaction, ChainPay validates the order in 1 second.

---

## 🧰 Prerequisites

You do not need any real money to test and run ChainPay! Everything runs on the **Sepolia EVM testnet** using free test tokens.

| Prerequisite              | Purpose                                                  | Where to get it (100% Free)                                                                                                                                                             |
| :------------------------ | :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js (v18+)**        | Runtime to execute the server.                           | [nodejs.org](https://nodejs.org/)                                                                                                                                                       |
| **MetaMask Wallet**       | Browser extension to hold test tokens and sign payments. | [metamask.io](https://metamask.io/)                                                                                                                                                     |
| **Free Sepolia Test ETH** | Fictional test currency used to make test payments.      | • [Google Cloud Web3 Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)<br>• [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) |
| **RPC Endpoint**          | API URL allowing your server to query the blockchain.    | Free accounts at [Alchemy.com](https://www.alchemy.com/) or [Infura.io](https://infura.io/)                                                                                             |

---

## 🚦 Quick Start (Local)

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

# Merchant recipient wallet address (where payments are sent)
DEFAULT_RECIPIENT="0x445Aaae218d736acD1658c31B09Fe0263f466965"

# Server Port (defaults to 3001)
PORT=3001
```

### 3. Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload on code change)
npm run dev
```

Open your browser at **[http://localhost:3001](http://localhost:3001)** to see the Web3 Dashboard!

---

## 🌐 Deploy Online in 3 Minutes (Free)

> **You do NOT need to keep this running only on your computer!**  
> Anyone on the internet can test your live Web3 payment dashboard by deploying it to a free cloud hosting provider like [Render](https://render.com/).

### Step-by-Step Deployment on Render.com:

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

Render will build and serve your app with a free HTTPS URL: **[https://chainpay-xhl0.onrender.com](https://chainpay-xhl0.onrender.com)**, making your payment dashboard accessible to anyone in the world!

---

## 🖥️ Web Dashboard Tour

When navigating to the dashboard, users and merchants have access to:

1. **Live Network Pulse**: Real-time Sepolia block height indicator and health check status.
2. **1-Click MetaMask Checkout**: Preset amount chips (0.001 ETH, 0.005 ETH, etc.) and instant transaction broadcast via window.ethereum.
3. **Automatic Inspector**: Automatically fills the transaction hash upon broadcast and queries the verification endpoint.
4. **Settled Payments Ledger**: Real-time table displaying recent payments with timestamps, block numbers, and direct links to Sepolia Etherscan.

---

## 🛠️ Deep-Dive for Developers

ChainPay is built adhering to the principles in John Ousterhout’s _A Philosophy of Software Design_ (2nd Edition):

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

### 1. Deep Module Architecture (`PaymentService`)

All RPC communication, hex parsing, block polling, and mathematical validations are encapsulated inside `src/services/paymentService.js`. The HTTP controllers and UI remain featherweight and completely decoupled from blockchain intricacies.

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

### 3. EIP-55 Address Checksum Normalization

Ethereum addresses can be formatted in lower case, uppercase, or mixed-case checksums. ChainPay passes all addresses through `ethers.getAddress` prior to comparison, preventing address spoofing and casing mismatch bugs.

### 4. Reorg & Double-Spending Protection

A transaction in the mempool can be cancelled or speed-run. `PaymentService` leverages `provider.waitForTransaction(txHash, confirmations)` to guarantee:

- The transaction has been included in a finalized block.
- The EVM execution receipt status is strictly `1` (Success), preventing reverted calls from registering as valid payments.

---

## 📡 API Reference

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

### 2. View Settled Payments

- **Method**: `GET`
- **Route**: `/api/payments`
- Returns the list of all verified payments recorded during the server runtime.

### 3. Node & Network Health

- **Method**: `GET`
- **Route**: `/api/health`
- Returns network name, current block height, chain ID, and RPC status.

---

## 💡 Why ChainPay? Who is this for?

| Target Audience                  | Why They Care                                                                                                            |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **Indie Hackers & Solo SaaS**    | Want to accept payments worldwide without opening a registered company or paying 3% Stripe fees.                         |
| **P2P Creators & Donors**        | Free, open-source alternative to "Buy Me a Coffee" or Patreon with zero platform cuts.                                   |
| **Web3 Developers & Recruiters** | Clean, production-grade example of Ethers.js v6, JSON-RPC queries, precision math, and Ousterhout software architecture. |

---

## 📄 License

Distributed under the MIT License. Built with ❤️ by [baptiste1307](https://github.com/baptiste1307).
