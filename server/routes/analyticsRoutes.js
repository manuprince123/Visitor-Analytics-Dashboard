const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getYearlyReport,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAnalytics);
router.get('/reports/daily', protect, getDailyReport);
router.get('/reports/weekly', protect, getWeeklyReport);
router.get('/reports/monthly', protect, getMonthlyReport);
router.get('/reports/yearly', protect, getYearlyReport);

module.exports = router;
