const express = require('express');
const Razorpay = require('razorpay');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

// Create payment order
router.post('/create-order', authenticateToken, [
  body('courseId').isMongoId().withMessage('Valid course ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.body;
    const userId = req.user.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user has already purchased this course
    const user = await User.findById(userId);
    const alreadyPurchased = user.paymentHistory.some(
      payment => payment.courseId.toString() === courseId && payment.status === 'completed'
    );

    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    // Create Razorpay order
    const options = {
      amount: course.price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `course_${courseId}_${userId}`,
      notes: {
        courseId: courseId,
        userId: userId,
        courseTitle: course.title
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      course: {
        id: course._id,
        title: course.title,
        price: course.price
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify payment
router.post('/verify', authenticateToken, [
  body('orderId').notEmpty().withMessage('Order ID required'),
  body('paymentId').notEmpty().withMessage('Payment ID required'),
  body('signature').notEmpty().withMessage('Signature required'),
  body('courseId').isMongoId().withMessage('Valid course ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentId, signature, courseId } = req.body;
    const userId = req.user.userId;

    // Verify payment signature
    const text = orderId + '|' + paymentId;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update user payment history
    const user = await User.findById(userId);
    user.paymentHistory.push({
      courseId: courseId,
      amount: course.price,
      date: new Date(),
      status: 'completed'
    });
    await user.save();

    res.json({
      message: 'Payment verified successfully',
      course: {
        id: course._id,
        title: course.title,
        price: course.price
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('paymentHistory.courseId', 'title price');

    res.json(user.paymentHistory);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course purchase status
router.get('/status/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    const purchase = user.paymentHistory.find(
      payment => payment.courseId.toString() === courseId
    );

    res.json({
      purchased: purchase ? purchase.status === 'completed' : false,
      status: purchase ? purchase.status : 'not_purchased'
    });
  } catch (error) {
    console.error('Purchase status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

