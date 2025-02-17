const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/auth/jwtAuth');
const matchController = require('../src/api/v1/controllers/matchController');

// Match routes
router.post('/start', jwtAuth, matchController.startMatchmaking);
router.post('/skip', jwtAuth, matchController.skipMatch);
router.get('/history', jwtAuth, matchController.getMatches);

module.exports = router;

