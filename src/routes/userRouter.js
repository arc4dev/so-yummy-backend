const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Auth before all requests
router.use(authController.auth);

router.get('/current', userController.getCurrentUser);

router.get('/transactions', userController.getUserTransactions);

router.get('/user-monthly-stats', userController.getUserMonthlyStats);

router.get('/user-yearly-stats', userController.getUserYearlyStats);

module.exports = router;
