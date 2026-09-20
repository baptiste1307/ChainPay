/**
 * Send Test Payment Utility
 * Broadcasts an on-chain transfer to test transaction settlement and verification.
 */

const { ethers } = require("ethers");
const config = require("../src/config");

async function main() {
  if (!config.privateKey) {
    console.error("❌ Error: PRIVATE_KEY is not defined in your .env file.");
    process.exit(1);
  }

  const recipient = process.env.PAYMENT_RECIPIENT || config.defaultRecipient;
  const amount = process.env.PAYMENT_AMOUNT || "0.0000001";

  try {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.privateKey, provider);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  🚀 ChainPay — Broadcasting Test Payment");
    console.log(`  👤 Sender:    ${wallet.address}`);
    console.log(`  🎯 Recipient: ${recipient}`);
    console.log(`  💎 Amount:    ${amount} ETH`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⏳ Signing & broadcasting transaction...");

    const tx = await wallet.sendTransaction({
      to: recipient,
      value: ethers.parseEther(amount),
    });

    console.log("✅ Transaction broadcasted!");
    console.log(`🔗 Transaction Hash: ${tx.hash}`);
    console.log("⏳ Waiting for block confirmation...");

    const receipt = await tx.wait();
    console.log(`🎉 Transaction confirmed in block #${receipt.blockNumber}!`);
    console.log("\n💡 To verify via ChainPay API, execute:");
    console.log(`curl -X POST http://localhost:${config.port}/api/tx \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(
      `  -d '{"txHash":"${tx.hash}","amount":${amount},"to":"${recipient}"}'\n`,
    );
  } catch (error) {
    console.error("❌ Failed to send transaction:", error.message);
    process.exit(1);
  }
}

main();
