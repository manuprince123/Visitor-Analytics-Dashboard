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
 * Helper: get all dates between start and today
 */
const getDateRange = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

/**
 * @desc    Get breakdown analytics (browser, device, OS, page, traffic hours)
 * @route   GET /api/analytics
 * @access  Private
 */
const getAnalytics = async (req, res, next) => {
  try {
    const [browsers, devices, osSystems, topPages, peakHours] = await Promise.all([
      // Browser breakdown
      Visitor.aggregate([
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      // Device breakdown
      Visitor.aggregate([
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // OS breakdown
      Visitor.aggregate([
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      // Top pages
      Visitor.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Peak traffic hours (extract hour from visitTime)
      Visitor.aggregate([
        {
          $addFields: {
            hour: { $toInt: { $substr: ['$visitTime', 0, 2] } },
          },
        },
        { $group: { _id: '$hour', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Calculate bounce rate (visitors who only visited 1 page)
    const [totalSessions, bounceSessions] = await Promise.all([
      Visitor.distinct('sessionId').then((ids) => ids.length),
      Visitor.aggregate([
        { $group: { _id: '$sessionId', pageCount: { $sum: 1 } } },
        { $match: { pageCount: 1 } },
        { $count: 'bounced' },
      ]),
    ]);

    const bounceRate =
      totalSessions > 0
        ? ((bounceSessions[0]?.bounced || 0) / totalSessions) * 100
        : 0;

    // Format peak hours to include all 24 hours
    const hoursMap = {};
    peakHours.forEach((h) => {
      hoursMap[h._id] = h.count;
    });
    const allHours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      visitors: hoursMap[i] || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        browsers: browsers.map((b) => ({ name: b._id || 'Unknown', value: b.count })),
        devices: devices.map((d) => ({ name: d._id || 'Unknown', value: d.count })),
        osSystems: osSystems.map((o) => ({ name: o._id || 'Unknown', value: o.count })),
        topPages: topPages.map((p) => ({ page: p._id || '/', count: p.count })),
        peakHours: allHours,
        bounceRate: Math.round(bounceRate * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Daily report — hourly breakdown for today
 * @route   GET /api/reports/daily
 * @access  Private
 */
const getDailyReport = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const hourlyData = await Visitor.aggregate([
      { $match: { visitDate: today } },
      {
        $addFields: {
          hour: { $toInt: { $substr: ['$visitTime', 0, 2] } },
        },
      },
      { $group: { _id: '$hour', visitors: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const hoursMap = {};
    hourlyData.forEach((h) => {
      hoursMap[h._id] = h.visitors;
    });

    const report = Array.from({ length: 24 }, (_, i) => ({
      label: `${String(i).padStart(2, '0')}:00`,
      visitors: hoursMap[i] || 0,
    }));

    const totalToday = await Visitor.countDocuments({ visitDate: today });

    res.status(200).json({
      success: true,
      data: { report, total: totalToday, date: today },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Weekly report — daily totals for last 7 days
 * @route   GET /api/reports/weekly
 * @access  Private
 */
const getWeeklyReport = async (req, res, next) => {
  try {
    const startDate = getDaysAgo(6); // Last 7 days including today
    const dates = getDateRange(startDate);

    const data = await Visitor.aggregate([
      { $match: { visitDate: { $gte: startDate } } },
      { $group: { _id: '$visitDate', visitors: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const dataMap = {};
    data.forEach((d) => {
      dataMap[d._id] = d.visitors;
    });

    const report = dates.map((date) => ({
      label: date,
      visitors: dataMap[date] || 0,
    }));

    const total = report.reduce((sum, d) => sum + d.visitors, 0);

    res.status(200).json({
      success: true,
      data: { report, total },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Monthly report — daily totals for last 30 days
 * @route   GET /api/reports/monthly
 * @access  Private
 */
const getMonthlyReport = async (req, res, next) => {
  try {
    const startDate = getDaysAgo(29); // Last 30 days
    const dates = getDateRange(startDate);

    const data = await Visitor.aggregate([
      { $match: { visitDate: { $gte: startDate } } },
      { $group: { _id: '$visitDate', visitors: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const dataMap = {};
    data.forEach((d) => {
      dataMap[d._id] = d.visitors;
    });

    const report = dates.map((date) => ({
      label: date,
      visitors: dataMap[date] || 0,
    }));

    const total = report.reduce((sum, d) => sum + d.visitors, 0);

    res.status(200).json({
      success: true,
      data: { report, total },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Yearly report — monthly totals for last 12 months
 * @route   GET /api/reports/yearly
 * @access  Private
 */
const getYearlyReport = async (req, res, next) => {
  try {
    const data = await Visitor.aggregate([
      {
        $addFields: {
          yearMonth: { $substr: ['$visitDate', 0, 7] }, // YYYY-MM
        },
      },
      { $group: { _id: '$yearMonth', visitors: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const report = data.map((d) => ({
      label: d._id,
      visitors: d.visitors,
    }));

    const total = report.reduce((sum, d) => sum + d.visitors, 0);

    res.status(200).json({
      success: true,
      data: { report, total },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getYearlyReport,
};
