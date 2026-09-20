require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const recipient = "0x445Aaae218d736acD1658c31B09Fe0263f466965"; // wallet test “client”
    const amount = "0.0000001"; // montant en ETH testnet

    console.log(`Envoi de ${amount} ETH testnet à ${recipient}...`);

    try {
        const tx = await wallet.sendTransaction({
            to: recipient,
            value: ethers.parseEther(amount)
        });

        console.log("Transaction envoyée ! Hash :", tx.hash);

        // Attendre la confirmation
        await tx.wait();
        console.log("Transaction confirmée !");
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
    }
}

main();