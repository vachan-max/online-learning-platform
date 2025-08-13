const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship'],
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  requirements: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  applications: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
});

const startupSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: String,
  website: String,
  industry: String,
  foundedYear: Number,
  teamSize: String,
  location: String,
  jobListings: [jobListingSchema],
  isPartnered: {
    type: Boolean,
    default: false
  },
  contactEmail: String,
  contactPhone: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Startup', startupSchema);

