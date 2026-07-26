const express = require('express');
const router = express.Router();
const {
  recordVisit,
  getVisitors,
  getVisitorById,
  deleteVisitor,
  exportVisitors,
} = require('../controllers/visitorController');
const { protect } = require('../middleware/auth');

// Public route — record visitor (no auth required)
router.post('/', recordVisit);

// Protected routes — require JWT
router.get('/', protect, getVisitors);
router.get('/export', protect, exportVisitors);
router.get('/:id', protect, getVisitorById);
router.delete('/:id', protect, deleteVisitor);

module.exports = router;
