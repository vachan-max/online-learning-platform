const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completionPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  lastWatchedPosition: {
    type: Number, // in seconds
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  watchHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    position: Number
  }]
}, {
  timestamps: true
});

// Compound index to ensure unique user-course combinations
progressSchema.index({ userID: 1, courseID: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);

