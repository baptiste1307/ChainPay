/**
 * Check Wallet Balance Utility
 * Queries the JSON-RPC provider to inspect wallet balance and network connectivity.
 */

const { ethers } = require("ethers");
const config = require("../src/config");

async function main() {
  if (!config.privateKey) {
    console.error("❌ Error: PRIVATE_KEY is not defined in your .env file.");
    process.exit(1);
  }

  try {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.privateKey, provider);
    const balance = await provider.getBalance(wallet.address);
    const network = await provider.getNetwork();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  🔍 ChainPay — Wallet Inspector");
    console.log(
      `  🌐 Network: ${config.networkName} (Chain ID: ${network.chainId})`,
    );
    console.log(`  💼 Wallet Address: ${wallet.address}`);
    console.log(`  💰 Available Balance: ${ethers.formatEther(balance)} ETH`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Error querying wallet balance:", error.message);
    process.exit(1);
  }
}

main();
