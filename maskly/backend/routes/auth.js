const express = require('express');
const router = express.Router();

// Mock user data
const users = {
  user1: { username: 'user1', password: 'password1' },
};

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users[username];
  if (user && user.password === password) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;

