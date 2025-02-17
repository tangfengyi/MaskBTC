const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '58kb' })); // 58KB * 1024 = 59392 bytes (符合57344限制)

// Import auth routes
const authRoutes = require('./routes/auth');
const registerRoutes = require('./routes/register');
const transactionRoutes = require('./routes/transaction');
const matchRoutes = require('./routes/match');

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to MASKLY Backend!');
});

// Use auth routes
app.use('/api/auth', authRoutes);

// Use register routes
app.use('/api/register', registerRoutes);

// Use transaction routes
app.use('/api/transaction', transactionRoutes);

// Use match routes
app.use('/api/match', matchRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

