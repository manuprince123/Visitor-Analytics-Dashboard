const { v4: uuidv4 } = require('uuid');
const Visitor = require('../models/Visitor');

/**
 * Get real IP address from request (handles proxies)
 */
const getIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'Unknown'
  );
};

/**
 * @desc    Record a new visitor visit
 * @route   POST /api/visit
 * @access  Public
 */
const recordVisit = async (req, res, next) => {
  try {
    const {
      visitorId,
      sessionId,
      browser,
      os,
      device,
      screenResolution,
      language,
      timezone,
      page,
      referrer,
    } = req.body;

    const ip = getIp(req);
    const now = new Date();

    // Format date as YYYY-MM-DD
    const visitDate = now.toISOString().split('T')[0];

    // Format time as HH:MM:SS
    const visitTime = now.toTimeString().split(' ')[0];

    // Check if this visitorId has visited before
    const existingVisitor = await Visitor.findOne({ visitorId });
    const firstVisit = !existingVisitor;

    // Create visitor record
    const visitor = await Visitor.create({
      visitorId: visitorId || uuidv4(),
      sessionId: sessionId || uuidv4(),
      browser: browser || 'Unknown',
      os: os || 'Unknown',
      device: device || 'Desktop',
      screenResolution: screenResolution || 'Unknown',
      language: language || 'Unknown',
      timezone: timezone || 'Unknown',
      page: page || '/',
      referrer: referrer || 'Direct',
      ip,
      visitDate,
      visitTime,
      firstVisit,
      lastVisit: now,
    });

    res.status(201).json({
      success: true,
      data: { id: visitor._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all visitors with pagination, search, filter, sort
 * @route   GET /api/visitors
 * @access  Private
 */
const getVisitors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      browser,
      device,
      os,
      startDate,
      endDate,
      page: pagePath,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build filter query
    const query = {};

    // Date range filter
    if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) query.visitDate.$gte = startDate;
      if (endDate) query.visitDate.$lte = endDate;
    }

    if (browser) query.browser = new RegExp(browser, 'i');
    if (device) query.device = device;
    if (os) query.os = new RegExp(os, 'i');
    if (pagePath) query.page = new RegExp(pagePath, 'i');

    // Search across multiple fields
    if (search) {
      query.$or = [
        { visitorId: new RegExp(search, 'i') },
        { browser: new RegExp(search, 'i') },
        { os: new RegExp(search, 'i') },
        { ip: new RegExp(search, 'i') },
        { page: new RegExp(search, 'i') },
        { device: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [visitors, total] = await Promise.all([
      Visitor.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Visitor.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: visitors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single visitor by ID
 * @route   GET /api/visitor/:id
 * @access  Private
 */
const getVisitorById = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete visitor record
 * @route   DELETE /api/visitor/:id
 * @access  Private
 */
const deleteVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Visitor record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export visitors as CSV data
 * @route   GET /api/visitors/export
 * @access  Private
 */
const exportVisitors = async (req, res, next) => {
  try {
    const { startDate, endDate, browser, device } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) query.visitDate.$gte = startDate;
      if (endDate) query.visitDate.$lte = endDate;
    }
    if (browser) query.browser = new RegExp(browser, 'i');
    if (device) query.device = device;

    const visitors = await Visitor.find(query).sort({ createdAt: -1 }).lean();

    // Build CSV content
    const headers = [
      'ID', 'Visitor ID', 'Session ID', 'Date', 'Time',
      'Browser', 'OS', 'Device', 'Screen', 'Language',
      'Timezone', 'Page', 'Referrer', 'IP', 'First Visit',
    ];

    const rows = visitors.map((v) => [
      v._id, v.visitorId, v.sessionId, v.visitDate, v.visitTime,
      v.browser, v.os, v.device, v.screenResolution, v.language,
      v.timezone, v.page, v.referrer, v.ip, v.firstVisit ? 'Yes' : 'No',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell || ''}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="visitors.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordVisit,
  getVisitors,
  getVisitorById,
  deleteVisitor,
  exportVisitors,
};
