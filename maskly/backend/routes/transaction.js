const express = require('express');
const router = express.Router();

// Mock transaction data
const transactions = {};

// Create transaction route
router.post('/create', (req, res) => {
  const { userId, amount, type } = req.body;

  if (!userId || !amount || !type) {
    return res.status(400).json({ message: 'User ID, amount, and type are required' });
  }

  const transactionId = `tx${Date.now()}`;
  transactions[transactionId] = { userId, amount, type, timestamp: new Date() };
  res.json({ message: 'Transaction created', transaction: { id: transactionId, ...transactions[transactionId] } });
});

// Get transaction history route
router.get('/history/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const userTransactions = Object.entries(transactions)
    .filter(([_, tx]) => tx.userId === userId)
    .map(([id, tx]) => ({ id, ...tx }));

  res.json({ transactions: userTransactions });
});

module.exports = router;

