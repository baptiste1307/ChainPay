/**
 * ChainPay Web3 Dashboard Frontend Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const networkNameEl = document.getElementById("networkName");
  const statNetworkEl = document.getElementById("statNetwork");
  const statBlockEl = document.getElementById("statBlock");
  const statPaymentsCountEl = document.getElementById("statPaymentsCount");
  const merchantAddressInput = document.getElementById("merchantAddress");
  const btnCopyMerchant = document.getElementById("btnCopyMerchant");
  const btnConnectWallet = document.getElementById("btnConnectWallet");
  const walletBtnText = document.getElementById("walletBtnText");
  const payAmountInput = document.getElementById("payAmount");
  const btnSendWeb3 = document.getElementById("btnSendWeb3");
  const btnSendText = document.getElementById("btnSendText");
  const sendFeedback = document.getElementById("sendFeedback");

  const verifyForm = document.getElementById("verifyForm");
  const verifyTxHash = document.getElementById("verifyTxHash");
  const verifyAmount = document.getElementById("verifyAmount");
  const verifyTo = document.getElementById("verifyTo");
  const btnVerify = document.getElementById("btnVerify");
  const verifySpinner = document.getElementById("verifySpinner");
  const verifyBtnText = document.getElementById("verifyBtnText");
  const verifyFeedback = document.getElementById("verifyFeedback");

  const paymentsTableBody = document.getElementById("paymentsTableBody");
  const btnRefreshLedger = document.getElementById("btnRefreshLedger");
  const presetButtons = document.querySelectorAll(".btn-preset");
  const codeTabs = document.querySelectorAll(".code-tab");
  const codeSnippet = document.getElementById("codeSnippet");
  const btnCopyCode = document.getElementById("btnCopyCode");

  let userWalletAddress = null;
  let activeMerchant = "0x445Aaae218d736acD1658c31B09Fe0263f466965";

  // 1. Initialize Network & Health
  async function fetchHealth() {
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error("Health check failed");
      const data = await res.json();

      if (networkNameEl) networkNameEl.textContent = data.network || "Sepolia";

      if (data.defaultRecipient && merchantAddressInput && verifyTo) {
        activeMerchant = data.defaultRecipient;
        merchantAddressInput.value = activeMerchant;
        verifyTo.value = activeMerchant;
      }
    } catch (err) {
      if (networkNameEl) networkNameEl.textContent = "Sepolia (Connecting...)";
    }
  }

  // 2. Fetch Settled Payments
  async function fetchPayments() {
    try {
      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      const payments = await res.json();

      if (statPaymentsCountEl)
        statPaymentsCountEl.textContent = payments.length;

      if (!payments || payments.length === 0) {
        paymentsTableBody.innerHTML = `
          <tr class="table-empty-row">
            <td colspan="6">No settled payments yet. Initiate a test transaction above!</td>
          </tr>
        `;
        return;
      }

      paymentsTableBody.innerHTML = payments
        .map((p) => {
          const shortHash = p.txHash
            ? `${p.txHash.slice(0, 10)}...${p.txHash.slice(-8)}`
            : "N/A";
          const shortFrom = p.from
            ? `${p.from.slice(0, 8)}...${p.from.slice(-6)}`
            : "N/A";
          const timeAgo = p.timestamp
            ? new Date(p.timestamp).toLocaleTimeString()
            : "Just now";
          const explorerUrl = `https://sepolia.etherscan.io/tx/${p.txHash}`;

          return `
          <tr>
            <td>
              <span class="badge-confirmed">
                <span class="pulse-dot"></span>
                Confirmed
              </span>
            </td>
            <td><strong>${p.amount} ETH</strong></td>
            <td>
              <a href="${explorerUrl}" target="_blank" rel="noreferrer" class="tx-link" title="View on Etherscan">
                ${shortHash} ↗
              </a>
            </td>
            <td class="font-mono" style="font-size: 12px; color: #94a3b8;">${shortFrom}</td>
            <td><span class="font-mono">#${p.blockNumber || "Pending"}</span></td>
            <td style="color: #64748b; font-size: 12px;">${timeAgo}</td>
          </tr>
        `;
        })
        .join("");
    } catch (err) {
      console.error("Ledger error:", err);
    }
  }

  // 3. Preset Buttons
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const amt = btn.dataset.amount;
      payAmountInput.value = amt;
      verifyAmount.value = amt;
    });
  });

  payAmountInput.addEventListener("input", () => {
    verifyAmount.value = payAmountInput.value;
  });

  // 4. Copy Merchant Address
  btnCopyMerchant.addEventListener("click", () => {
    navigator.clipboard.writeText(merchantAddressInput.value);
    const original = btnCopyMerchant.innerHTML;
    btnCopyMerchant.innerHTML = "✓";
    setTimeout(() => {
      btnCopyMerchant.innerHTML = original;
    }, 1500);
  });

  const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

  // Ensure user is on Sepolia testnet to prevent real money loss
  async function ensureSepoliaNetwork() {
    if (typeof window.ethereum === "undefined") return false;
    try {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (currentChainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          return true;
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: "Sepolia Test Network",
                  nativeCurrency: {
                    name: "Sepolia ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.sepolia.org"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
            return true;
          }
          throw switchError;
        }
      }
      return true;
    } catch (err) {
      console.warn("Network switch refused:", err);
      return false;
    }
  }

  // 5. Connect MetaMask
  async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask or an EVM Web3 wallet was not detected in this browser.");
      return;
    }
    try {
      await ensureSepoliaNetwork();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts.length > 0) {
        userWalletAddress = accounts[0];
        walletBtnText.textContent = `${userWalletAddress.slice(0, 6)}...${userWalletAddress.slice(-4)}`;
        btnSendText.textContent = `Pay ${payAmountInput.value} ETH`;
      }
    } catch (err) {
      console.error("Wallet connection rejected:", err);
    }
  }

  btnConnectWallet.addEventListener("click", connectWallet);

  // 6. Pay with MetaMask
  btnSendWeb3.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      sendFeedback.className = "alert-box alert-error";
      sendFeedback.textContent =
        "MetaMask is required to send directly from the browser. You can also run: node scripts/sendPayment.js";
      sendFeedback.classList.remove("hidden");
      return;
    }

    try {
      const isSepolia = await ensureSepoliaNetwork();
      if (!isSepolia) {
        sendFeedback.className = "alert-box alert-error";
        sendFeedback.textContent =
          "Please switch your wallet to Sepolia Testnet to make test transactions safely.";
        sendFeedback.classList.remove("hidden");
        return;
      }

      if (!userWalletAddress) {
        await connectWallet();
      }

      sendFeedback.classList.add("hidden");
      btnSendText.textContent = "Confirming in wallet...";

      const amountEther = payAmountInput.value;
      // Convert ether to wei hex
      const weiMultiplier = 1000000000000000000n;
      const weiAmount = BigInt(Math.floor(parseFloat(amountEther) * 1e18));
      const hexValue = "0x" + weiAmount.toString(16);

      const txParams = {
        from: userWalletAddress,
        to: activeMerchant,
        value: hexValue,
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });

      sendFeedback.className = "alert-box alert-success";
      sendFeedback.innerHTML = `Transaction broadcasted! Hash: <strong class="font-mono">${txHash.slice(0, 16)}...</strong>. Starting verification...`;
      sendFeedback.classList.remove("hidden");

      // Autofill verifier form and trigger
      verifyTxHash.value = txHash;
      verifyAmount.value = amountEther;
      verifyTo.value = activeMerchant;

      // Automatically verify!
      setTimeout(() => {
        verifyTransaction(txHash, amountEther, activeMerchant);
      }, 1500);
    } catch (err) {
      console.error("Transaction failed:", err);
      sendFeedback.className = "alert-box alert-error";
      sendFeedback.textContent =
        err.message || "Transaction was canceled or failed.";
      sendFeedback.classList.remove("hidden");
    } finally {
      btnSendText.textContent = "Pay with MetaMask";
    }
  });

  // 7. Verify Transaction Flow
  async function verifyTransaction(txHash, amount, to) {
    verifyFeedback.classList.add("hidden");
    verifySpinner.classList.remove("hidden");
    verifyBtnText.textContent = "Awaiting Confirmation...";
    btnVerify.disabled = true;

    try {
      const res = await fetch("/api/tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash, amount: Number(amount), to }),
      });

      const data = await res.json();

      if (res.ok && data.status === "confirmed") {
        verifyFeedback.className = "alert-box alert-success";
        verifyFeedback.innerHTML = `🎉 <strong>Payment Confirmed!</strong> Settled in block #${data.payment.blockNumber}.`;
        fetchPayments();
      } else {
        verifyFeedback.className = "alert-box alert-error";
        verifyFeedback.textContent = `❌ Verification failed: ${data.message || "Transaction not valid"}`;
      }
    } catch (err) {
      verifyFeedback.className = "alert-box alert-error";
      verifyFeedback.textContent = `Network error: ${err.message}`;
    } finally {
      verifyFeedback.classList.remove("hidden");
      verifySpinner.classList.add("hidden");
      verifyBtnText.textContent = "Verify On-Chain";
      btnVerify.disabled = false;
    }
  }

  verifyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    verifyTransaction(
      verifyTxHash.value.trim(),
      verifyAmount.value.trim(),
      verifyTo.value.trim(),
    );
  });

  btnRefreshLedger.addEventListener("click", () => {
    btnRefreshLedger.classList.add("active");
    fetchPayments().then(() => {
      setTimeout(() => btnRefreshLedger.classList.remove("active"), 400);
    });
  });

  // 8. Code Snippet Tabs
  const snippets = {
    curl: `curl -X POST http://localhost:3001/api/tx \\
  -H "Content-Type: application/json" \\
  -d '{
    "txHash": "0xabc...",
    "amount": 0.0001,
    "to": "${activeMerchant}"
  }'`,
    js: `const response = await fetch("http://localhost:3001/api/tx", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    txHash: "0xabc...",
    amount: 0.0001,
    to: "${activeMerchant}"
  })
});
const data = await response.json();
console.log(data);`,
    py: `import requests

url = "http://localhost:3001/api/tx"
payload = {
    "txHash": "0xabc...",
    "amount": 0.0001,
    "to": "${activeMerchant}"
}

res = requests.post(url, json=payload)
print(res.json())`,
  };

  codeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      codeTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const lang = tab.dataset.lang;
      codeSnippet.textContent = snippets[lang];
    });
  });

  btnCopyCode.addEventListener("click", () => {
    navigator.clipboard.writeText(codeSnippet.textContent);
    btnCopyCode.textContent = "Copied!";
    setTimeout(() => {
      btnCopyCode.textContent = "Copy Snippet";
    }, 1500);
  });

  // Initial load & periodic polling
  fetchHealth();
  fetchPayments();
  setInterval(fetchPayments, 8000);
});
