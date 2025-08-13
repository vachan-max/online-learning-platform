const express = require('express');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
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

// Generate certificate for a course
router.get('/generate/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // Check if user has access to the course
    const progress = await Progress.findOne({ userID: userId, courseID: courseId })
      .populate('courseID', 'title duration')
      .populate('userID', 'name email college');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // Check if course is completed (>= 30% as per requirements)
    if (progress.completionPercentage < 30) {
      return res.status(400).json({ 
        message: 'Course must be at least 30% complete to generate certificate',
        currentProgress: progress.completionPercentage
      });
    }

    // Generate certificate ID
    const certificateId = uuidv4();
    const completionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${courseId}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add certificate content
    doc
      .fontSize(40)
      .font('Helvetica-Bold')
      .fill('#2C3E50')
      .text('Certificate of Completion', 0, 100, { align: 'center' });

    doc
      .fontSize(20)
      .font('Helvetica')
      .fill('#34495E')
      .text('This is to certify that', 0, 180, { align: 'center' });

    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .fill('#E74C3C')
      .text(progress.userID.name, 0, 220, { align: 'center' });

    doc
      .fontSize(18)
      .font('Helvetica')
      .fill('#34495E')
      .text('has successfully completed the course', 0, 270, { align: 'center' });

    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fill('#2980B9')
      .text(progress.courseID.title, 0, 310, { align: 'center' });

    doc
      .fontSize(16)
      .font('Helvetica')
      .fill('#7F8C8D')
      .text(`Completion Date: ${completionDate}`, 0, 370, { align: 'center' });

    doc
      .fontSize(14)
      .font('Helvetica')
      .fill('#7F8C8D')
      .text(`Certificate ID: ${certificateId}`, 0, 400, { align: 'center' });

    doc
      .fontSize(16)
      .font('Helvetica')
      .fill('#7F8C8D')
      .text(`Completion Rate: ${progress.completionPercentage}%`, 0, 430, { align: 'center' });

    // Add decorative elements
    doc
      .lineWidth(3)
      .strokeColor('#3498DB')
      .rect(50, 50, 700, 450)
      .stroke();

    // Add CareerCycle branding
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fill('#E74C3C')
      .text('CareerCycle', 50, 480, { align: 'left' });

    doc
      .fontSize(12)
      .font('Helvetica')
      .fill('#7F8C8D')
      .text('Any Course Under ₹19', 50, 500, { align: 'left' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certificate eligibility for a course
router.get('/eligibility/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const progress = await Progress.findOne({ userID: userId, courseID: courseId })
      .populate('courseID', 'title duration');

    if (!progress) {
      return res.json({
        eligible: false,
        message: 'No progress found for this course',
        currentProgress: 0,
        requiredProgress: 30
      });
    }

    const eligible = progress.completionPercentage >= 30;

    res.json({
      eligible,
      message: eligible 
        ? 'Certificate can be generated' 
        : 'Course must be at least 30% complete',
      currentProgress: progress.completionPercentage,
      requiredProgress: 30,
      course: {
        title: progress.courseID.title,
        duration: progress.courseID.duration
      }
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all certificates user is eligible for
router.get('/eligible', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const eligibleCourses = await Progress.find({
      userID: userId,
      completionPercentage: { $gte: 30 }
    })
    .populate('courseID', 'title duration thumbnail')
    .sort({ completionPercentage: -1 });

    const certificates = eligibleCourses.map(progress => ({
      courseId: progress.courseID._id,
      courseTitle: progress.courseID.title,
      completionPercentage: progress.completionPercentage,
      completedAt: progress.completedAt,
      duration: progress.courseID.duration,
      thumbnail: progress.courseID.thumbnail
    }));

    res.json(certificates);
  } catch (error) {
    console.error('Get eligible certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certificate preview data (without generating PDF)
router.get('/preview/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const progress = await Progress.findOne({ userID: userId, courseID: courseId })
      .populate('courseID', 'title duration')
      .populate('userID', 'name email college');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (progress.completionPercentage < 30) {
      return res.status(400).json({ 
        message: 'Course must be at least 30% complete',
        currentProgress: progress.completionPercentage
      });
    }

    const certificateData = {
      studentName: progress.userID.name,
      courseName: progress.courseID.title,
      completionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      certificateID: uuidv4(),
      completionPercentage: progress.completionPercentage,
      courseDuration: progress.courseID.duration
    };

    res.json(certificateData);
  } catch (error) {
    console.error('Get certificate preview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get certificate statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalEligible = await Progress.countDocuments({
      userID: userId,
      completionPercentage: { $gte: 30 }
    });

    const totalCompleted = await Progress.countDocuments({
      userID: userId,
      isCompleted: true
    });

    const averageCompletion = await Progress.aggregate([
      { $match: { userID: new require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: null, avgProgress: { $avg: '$completionPercentage' } } }
    ]);

    res.json({
      totalEligibleCertificates: totalEligible,
      totalCompletedCourses: totalCompleted,
      averageCompletionRate: averageCompletion.length > 0 ? Math.round(averageCompletion[0].avgProgress) : 0
    });
  } catch (error) {
    console.error('Get certificate stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

