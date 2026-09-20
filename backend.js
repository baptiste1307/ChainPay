require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
app.use(bodyParser.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Base simple en mémoire pour les paiements
let payments = [];

app.post('/tx', async (req, res) => {
    const { txHash, amount, to } = req.body;
    try {
        const tx = await provider.getTransaction(txHash);
        if (!tx) return res.status(404).send("Transaction non trouvée");

        // Vérifie destinataire et montant
        if (tx.to.toLowerCase() !== to.toLowerCase() || Number(ethers.formatEther(tx.value)) !== amount) {
            return res.status(400).send("Transaction invalide");
        }

        // Attend confirmation
        await provider.waitForTransaction(txHash);

        payments.push({ txHash, amount, to, status: "confirmed" });
        res.send({ status: "confirmed" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get('/payments', (req, res) => {
    res.send(payments);
});

app.listen(3001, () => console.log("Backend listening on port 3001"));