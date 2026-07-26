/**
 * Admin Seed Script
 * Run: node utils/seedAdmin.js
 * Creates the default admin account if it doesn't exist.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: 'admin@analytics.com' });

    if (existingAdmin) {
      console.log('ℹ️  Admin account already exists:');
      console.log('   Email:    admin@analytics.com');
      console.log('   Password: Admin@123');
    } else {
      await Admin.create({
        name: 'Admin',
        email: 'admin@analytics.com',
        password: 'Admin@123',
      });

      console.log('✅ Admin account created successfully!');
      console.log('   Email:    admin@analytics.com');
      console.log('   Password: Admin@123');
      console.log('');
      console.log('⚠️  Please change your password after first login.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
