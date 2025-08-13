const express = require('express');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get user's progress for all courses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const progress = await Progress.find({ userID: req.user.userId })
      .populate('courseID', 'title thumbnail duration')
      .sort({ updatedAt: -1 });

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get progress for a specific course
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    let progress = await Progress.findOne({ userID: userId, courseID: courseId })
      .populate('courseID', 'title thumbnail duration');

    if (!progress) {
      // Check if user has purchased the course
      const user = await User.findById(userId);
      const hasPurchased = user.paymentHistory.some(
        payment => payment.courseId.toString() === courseId && payment.status === 'completed'
      );

      if (!hasPurchased) {
        return res.status(403).json({ message: 'Course not purchased' });
      }

      // Create new progress entry
      progress = new Progress({
        userID: userId,
        courseID: courseId,
        completionPercentage: 0,
        lastWatchedPosition: 0
      });
      await progress.save();
      progress = await progress.populate('courseID', 'title thumbnail duration');
    }

    res.json(progress);
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update video progress
router.put('/course/:courseId', authenticateToken, [
  require('express-validator').body('position').isNumeric().withMessage('Position must be a number'),
  require('express-validator').body('completionPercentage').isNumeric().withMessage('Completion percentage must be a number')
], async (req, res) => {
  try {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.params;
    const { position, completionPercentage } = req.body;
    const userId = req.user.userId;

    // Check if user has purchased the course
    const user = await User.findById(userId);
    const hasPurchased = user.paymentHistory.some(
      payment => payment.courseId.toString() === courseId && payment.status === 'completed'
    );

    if (!hasPurchased) {
      return res.status(403).json({ message: 'Course not purchased' });
    }

    // Get course duration
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update or create progress
    let progress = await Progress.findOne({ userID: userId, courseID: courseId });

    if (!progress) {
      progress = new Progress({
        userID: userId,
        courseID: courseId,
        completionPercentage: 0,
        lastWatchedPosition: 0
      });
    }

    // Update progress
    progress.lastWatchedPosition = position;
    progress.completionPercentage = Math.min(completionPercentage, 100);

    // Check if course is completed (>= 30% as per requirements)
    if (progress.completionPercentage >= 30 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    // Add to watch history
    progress.watchHistory.push({
      timestamp: new Date(),
      position: position
    });

    // Keep only last 10 watch history entries
    if (progress.watchHistory.length > 10) {
      progress.watchHistory = progress.watchHistory.slice(-10);
    }

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get completion statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalCourses = await Progress.countDocuments({ userID: userId });
    const completedCourses = await Progress.countDocuments({ 
      userID: userId, 
      isCompleted: true 
    });
    const inProgressCourses = totalCourses - completedCourses;

    const totalProgress = await Progress.aggregate([
      { $match: { userID: new require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: null, avgProgress: { $avg: '$completionPercentage' } } }
    ]);

    const averageProgress = totalProgress.length > 0 ? Math.round(totalProgress[0].avgProgress) : 0;

    res.json({
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
      completionRate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset progress for a course
router.delete('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const progress = await Progress.findOne({ userID: userId, courseID: courseId });
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // Reset progress
    progress.completionPercentage = 0;
    progress.lastWatchedPosition = 0;
    progress.isCompleted = false;
    progress.completedAt = undefined;
    progress.watchHistory = [];

    await progress.save();

    res.json({ message: 'Progress reset successfully' });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

