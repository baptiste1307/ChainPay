/**
 * PaymentService — Deep Module for EVM Payment Operations
 *
 * Implements core concepts from 'A Philosophy of Software Design':
 * 1. Deep Module: Hides RPC communication, wei/ether conversion math, and confirmation waiting
 *    behind a clear, clean public interface.
 * 2. Pull Complexity Downward: The HTTP layer and UI only ask to verify; all validation,
 *    checksum resolution, and polling logic happen inside this service.
 * 3. Define Errors Out of Existence: Normalizes inputs gracefully and returns explicit
 *    structured results rather than letting unhandled RPC exceptions crash the system.
 */

const { ethers } = require("ethers");
const config = require("../config");

class PaymentService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    // In-memory payment ledger (can be swapped for a database without changing the service interface)
    this.payments = [];
  }

  /**
   * Returns network status and provider connectivity
   */
  async getHealth() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      return {
        status: "healthy",
        network: config.networkName,
        chainId: Number(network.chainId),
        currentBlock: blockNumber,
        defaultRecipient: config.defaultRecipient,
      };
    } catch (err) {
      return {
        status: "degraded",
        network: config.networkName,
        error: err.message,
        defaultRecipient: config.defaultRecipient,
      };
    }
  }

  /**
   * Retrieves all verified payments from the ledger
   */
  getAllPayments() {
    return [...this.payments].reverse();
  }

  /**
   * Verifies an on-chain transaction against expected parameters.
   *
   * @param {Object} params
   * @param {string} params.txHash - 66-character 0x-prefixed transaction hash
   * @param {number|string} params.amount - Expected amount in Ether (e.g. "0.0001")
   * @param {string} params.to - Expected recipient address
   * @returns {Promise<{success: boolean, message: string, payment?: Object}>}
   */
  async verifyPayment({ txHash, amount, to }) {
    // 1. Syntactic parameter validation
    if (
      !txHash ||
      typeof txHash !== "string" ||
      !/^0x[a-fA-F0-9]{64}$/.test(txHash)
    ) {
      throw new Error(
        "Invalid transaction hash format. Expected 64-character hex string starting with 0x.",
      );
    }

    if (
      amount === undefined ||
      amount === null ||
      isNaN(Number(amount)) ||
      Number(amount) <= 0
    ) {
      throw new Error(
        "Invalid amount. Must be a positive numeric value in ETH.",
      );
    }

    if (!to || !ethers.isAddress(to)) {
      throw new Error("Invalid recipient address format.");
    }

    // 2. Query JSON-RPC for transaction data
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) {
      return {
        success: false,
        message:
          "Transaction not found on chain. It may still be propagating through the mempool.",
      };
    }

    // 3. Address comparison using normalized checksums
    const expectedTo = ethers.getAddress(to);
    const actualTo = tx.to ? ethers.getAddress(tx.to) : null;

    if (actualTo !== expectedTo) {
      return {
        success: false,
        message: `Recipient mismatch. Expected: ${expectedTo}, Actual: ${actualTo}`,
      };
    }

    // 4. Value comparison using BigInt wei to eliminate float rounding errors
    // (Ousterhout: Pull complexity downward — do precision arithmetic in the module)
    const expectedWei = ethers.parseEther(amount.toString());
    if (tx.value < expectedWei) {
      const actualEth = ethers.formatEther(tx.value);
      return {
        success: false,
        message: `Insufficient payment amount. Expected: ${amount} ETH, Received: ${actualEth} ETH`,
      };
    }

    // 5. Await block inclusion and receipt
    const receipt = await this.provider.waitForTransaction(
      txHash,
      config.confirmationsRequired,
    );
    if (!receipt || receipt.status === 0) {
      return {
        success: false,
        message: "Transaction was reverted on-chain by the EVM.",
      };
    }

    // 6. Record payment in the ledger (prevent duplicate records for same hash)
    const existingIndex = this.payments.findIndex(
      (p) => p.txHash.toLowerCase() === txHash.toLowerCase(),
    );
    const paymentRecord = {
      txHash,
      from: tx.from,
      to: actualTo,
      amount: ethers.formatEther(tx.value),
      blockNumber: receipt.blockNumber,
      confirmations: receipt.confirmations,
      timestamp: new Date().toISOString(),
      status: "confirmed",
    };

    if (existingIndex >= 0) {
      this.payments[existingIndex] = paymentRecord;
    } else {
      this.payments.push(paymentRecord);
    }

    return {
      success: true,
      message: "Payment verified and confirmed on-chain.",
      payment: paymentRecord,
    };
  }
}

// Export singleton instance
module.exports = new PaymentService();
