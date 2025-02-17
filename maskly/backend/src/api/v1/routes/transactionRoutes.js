const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../controllers/transactionController');

// Create a new transaction
router.post('/transactions', createTransaction);

// Get all transactions for a user
router.get('/transactions/:userId', getTransactions);

module.exports = router;

