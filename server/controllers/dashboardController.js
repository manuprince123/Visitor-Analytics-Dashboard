const Visitor = require('../models/Visitor');

/**
 * Helper: get date string N days ago (YYYY-MM-DD)
 */
const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

/**
 * @desc    Get dashboard summary stats
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = getDaysAgo(7);
    const monthAgo = getDaysAgo(30);

    // Visitors considered "active" if visited in last 15 minutes
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    const [
      totalVisitors,
      todayVisitors,
      weekVisitors,
      monthVisitors,
      activeUsers,
      returningVisitors,
      newVisitors,
    ] = await Promise.all([
      Visitor.countDocuments({}),
      Visitor.countDocuments({ visitDate: today }),
      Visitor.countDocuments({ visitDate: { $gte: weekAgo } }),
      Visitor.countDocuments({ visitDate: { $gte: monthAgo } }),
      Visitor.countDocuments({ lastVisit: { $gte: fifteenMinsAgo } }),
      Visitor.countDocuments({ firstVisit: false }),
      Visitor.countDocuments({ firstVisit: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        activeUsers,
        returningVisitors,
        newVisitors,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
