const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      enum: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
      default: 'Unknown',
    },
    screenResolution: {
      type: String,
      default: 'Unknown',
    },
    language: {
      type: String,
      default: 'Unknown',
    },
    timezone: {
      type: String,
      default: 'Unknown',
    },
    page: {
      type: String,
      default: '/',
    },
    referrer: {
      type: String,
      default: 'Direct',
    },
    ip: {
      type: String,
      default: 'Unknown',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    visitDate: {
      type: String, // Store as YYYY-MM-DD string for easy daily aggregation
      required: true,
      index: true,
    },
    visitTime: {
      type: String, // Store as HH:MM:SS string
      required: true,
    },
    firstVisit: {
      type: Boolean,
      default: true,
    },
    lastVisit: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient date-based queries
VisitorSchema.index({ createdAt: -1 });
VisitorSchema.index({ visitDate: 1, browser: 1 });
VisitorSchema.index({ visitorId: 1, visitDate: 1 });

module.exports = mongoose.model('Visitor', VisitorSchema);
