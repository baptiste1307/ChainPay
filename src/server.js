/**
 * Server Entry Point
 *
 * Boots the HTTP application and connects to the EVM network.
 */

const app = require("./app");
const config = require("./config");

const server = app.listen(config.port, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ⚡ ChainPay — EVM Payment Gateway & Verification API");
  console.log(`  🌐 Server running: http://localhost:${config.port}`);
  console.log(`  🔗 Network target: ${config.networkName}`);
  console.log(`  📋 Default Merchant: ${config.defaultRecipient}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("[ChainPay] SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

module.exports = server;
