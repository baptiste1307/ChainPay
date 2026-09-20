/**
 * Payment Routes Controller
 *
 * Exposes clean REST endpoints for verifying and listing EVM payments.
 * Delegates domain complexity to PaymentService without pass-through bloat.
 */

const express = require("express");
const paymentService = require("../services/paymentService");

const router = express.Router();

/**
 * Health check & network status
 */
router.get("/health", async (req, res) => {
  const health = await paymentService.getHealth();
  res.json(health);
});

/**
 * List all verified payments
 */
router.get("/payments", (req, res) => {
  const payments = paymentService.getAllPayments();
  res.json(payments);
});

/**
 * Verify an on-chain transaction
 */
router.post("/tx", async (req, res) => {
  try {
    const { txHash, amount, to } = req.body;
    const result = await paymentService.verifyPayment({ txHash, amount, to });

    if (!result.success) {
      return res.status(400).json({
        status: "rejected",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "confirmed",
      message: result.message,
      payment: result.payment,
    });
  } catch (error) {
    console.error("[ChainPay] Verification error:", error.message);
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
