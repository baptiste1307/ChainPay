# ChainPay — API Reference

All requests must use `Content-Type: application/json`.
CORS is enabled by default across all origins.

---

## Base URLs

- Local: `http://localhost:3001`
- Production: `https://chainpay-xhl0.onrender.com`

---

## Endpoints

### 1. Health & Node Status

Returns the operational status of the service, current blockchain block height, and network details.

- **Method**: `GET`
- **Route**: `/api/health` _(alias: `/health`)_

#### Success Response (`200 OK`)

```json
{
  "status": "healthy",
  "network": "Sepolia (EVM Testnet)",
  "chainId": 11155111,
  "currentBlock": 5839210,
  "defaultRecipient": "0x445Aaae218d736acD1658c31B09Fe0263f466965"
}
```

---

### 2. Verify On-Chain Transaction

Validates that a given transaction hash has been broadcasted, targets the expected recipient address, meets or exceeds the required amount, and has been included in a mined block.

- **Method**: `POST`
- **Route**: `/api/tx` _(alias: `/tx`)_

#### Request Body

```json
{
  "txHash": "0x5a2d8f9b7c3e1a4d8f9b7c3e1a4d8f9b7c3e1a4d8f9b7c3e1a4d8f9b7c3e1a4d",
  "amount": 0.0001,
  "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965"
}
```

| Field    | Type               | Description                                                                     |
| :------- | :----------------- | :------------------------------------------------------------------------------ |
| `txHash` | `string`           | 66-character 0x-prefixed EVM transaction hash.                                  |
| `amount` | `number \| string` | Expected value in ETH.                                                          |
| `to`     | `string`           | Expected recipient address. Case-insensitive (normalized with EIP-55 checksum). |

#### Success Response (`200 OK`)

```json
{
  "status": "confirmed",
  "message": "Payment verified and confirmed on-chain.",
  "payment": {
    "txHash": "0x5a2d8f9b7c3e1a4d8f9b7c3e1a4d8f9b7c3e1a4d8f9b7c3e1a4d8f9b7c3e1a4d",
    "from": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "to": "0x445Aaae218d736acD1658c31B09Fe0263f466965",
    "amount": "0.0001",
    "blockNumber": 5839210,
    "confirmations": 1,
    "timestamp": "2026-09-20T15:20:00.000Z",
    "status": "confirmed"
  }
}
```

#### Rejection Response (`400 Bad Request`)

```json
{
  "status": "rejected",
  "message": "Recipient mismatch. Expected: 0x445Aaae218d736acD1658c31B09Fe0263f466965, Actual: 0x90F79bf6EB2c4f870365E785982E1f101E93b906"
}
```

---

### 3. List Confirmed Payments

Retrieves all settled payments recorded during the current service lifecycle.

- **Method**: `GET`
- **Route**: `/api/payments` _(alias: `/payments`)_

#### Success Response (`200 OK`)

```json
[
  {
    "txHash": "0x5a2d8f9b...",
    "from": "0x70997970...",
    "to": "0x445Aaae2...",
    "amount": "0.0001",
    "blockNumber": 5839210,
    "confirmations": 1,
    "timestamp": "2026-09-20T15:20:00.000Z",
    "status": "confirmed"
  }
]
```
