const express = require('express');
const router = express.Router();

// Mock user data
const users = {};

// Registration route
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (users[username]) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users[username] = { username, password };
  res.json({ message: 'Registration successful', user: { username } });
});

module.exports = router;

