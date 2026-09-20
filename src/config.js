/**
 * Centralized Configuration Module
 *
 * Implements Rule 6 (Information Hiding) from John Ousterhout's
 * 'A Philosophy of Software Design': all environment resolution and defaults
 * are encapsulated in this single place so that consumers do not access `process.env` directly.
 */

require("dotenv").config();

const config = {
  // HTTP server port (injected by host like Render/Railway or fallback to 3001)
  port: parseInt(process.env.PORT || "3001", 10),

  // JSON-RPC Provider URL (e.g. Infura, Alchemy, or public testnet node)
  rpcUrl: process.env.RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",

  // Wallet private key for automated script broadcasting (kept server-side only)
  privateKey: process.env.PRIVATE_KEY || "",

  // Fallback / default merchant recipient address for testing
  defaultRecipient:
    process.env.DEFAULT_RECIPIENT ||
    "0x445Aaae218d736acD1658c31B09Fe0263f466965",

  // Network identification for UI display
  networkName: process.env.NETWORK_NAME || "Sepolia (EVM Testnet)",

  // Required block confirmations before marking a transaction as permanently settled
  confirmationsRequired: parseInt(
    process.env.CONFIRMATIONS_REQUIRED || "1",
    10,
  ),
};

module.exports = config;
