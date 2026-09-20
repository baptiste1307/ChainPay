# ChainPay Software Architecture & Design Principles

This document explains the structural decisions and code organization of **ChainPay**, directly inspired by the guidelines in `nala app/docs/software-design.md` and John Ousterhout's *A Philosophy of Software Design* (2nd Edition).

---

## 1. Core Principles Applied

### A. Deep Modules (Rule 3)
A good module is "deep": it has a simple interface that hides substantial implementation complexity.

In ChainPay, **`PaymentService`** is our canonical deep module:
* **Interface**:
  ```javascript
  paymentService.verifyPayment({ txHash, amount, to })
  paymentService.getAllPayments()
  paymentService.getHealth()
  ```
* **Hidden Complexity**:
  - Connection management with the EVM JSON-RPC provider.
  - Parsing address checksums via `ethers.getAddress` (preventing case-sensitivity bugs).
  - Accurate conversion between IEEE-754 floating point numbers and `BigInt` 256-bit Wei (preventing rounding theft or precision loss).
  - Polling and block confirmation resolution (`waitForTransaction`).
  - Ledger deduplication and state updates.

The caller (HTTP route handlers, CLI scripts, tests) does not know or care how any of this is accomplished.

---

### B. Avoiding "Classitis" (Rule 4)
Creating endless single-method classes (`PaymentValidator`, `PaymentMapper`, `PaymentDTO`, `TransactionFetcher`) introduces cognitive load without providing real abstraction. 

ChainPay avoids classitis:
- We do not create classes that merely pass data from one layer to another.
- HTTP routing in `src/routes/paymentRoutes.js` delegates straight to `PaymentService` methods in 2-3 lines per endpoint.
- Domain logic is kept unified and cohesive.

---

### C. Information Hiding & No Leakage (Rules 6 & 7)
* **Configuration**: `src/config.js` is the sole source of truth for runtime parameters and environment variables. Other files never read `process.env` directly.
* **Storage Abstraction**: The in-memory ledger is encapsulated within `PaymentService`. If we later swap in-memory storage for PostgreSQL, Redis, or SQLite, **zero lines of code outside `PaymentService` need to change**.

---

### D. Pulling Complexity Downward (Rule 12)
It is always preferable to make a core module slightly more capable so that all its callers remain extraordinarily simple:
* The HTTP controller does not calculate Wei or validate hex casing.
* The frontend UI does not implement fallback RPC retries.
* The service accepts either numbers or strings for amount and normalizes them safely.

---

### E. Defining Errors Out of Existence (Rule 14)
* Instead of throwing cryptic RPC errors that crash Node.js or require fragile `try/catch` cascades in every caller, `verifyPayment` returns structured operational results:
  ```json
  { "success": false, "message": "Transaction not found on chain." }
  ```
* Only invalid invocation signatures (e.g. malformed hash parameters) raise true exceptions, separating developer contract errors from expected blockchain delays.

---

## 2. Directory Layout & Roles

```text
src/
├── config.js               # Centralized configuration & environment resolution
├── services/
│   └── paymentService.js   # Deep domain logic (RPC, verification, ledger)
├── routes/
│   └── paymentRoutes.js    # REST endpoints mapping HTTP to service calls
├── app.js                  # Express middleware, CORS, static GUI hosting
└── server.js               # HTTP listener and process lifecycle management

public/                     # Frontend dashboard (HTML, CSS, JS, SVG assets)
scripts/                    # Developer CLI scripts (checkBalance, sendPayment)
docs/                       # Architectural and API documentation
```
