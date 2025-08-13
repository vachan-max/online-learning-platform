const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .select('title price duration description category instructor thumbnail')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isActive) {
      return res.status(404).json({ message: 'Course not available' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search courses
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const courses = await Course.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { instructor: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('title price duration description category instructor thumbnail');

    res.json(courses);
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.find({
      category: { $regex: category, $options: 'i' },
      isActive: true
    }).select('title price duration description category instructor thumbnail');

    res.json(courses);
  } catch (error) {
    console.error('Get courses by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured courses (most recent)
router.get('/featured/limit/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 6;
    const courses = await Course.find({ isActive: true })
      .select('title price duration description category instructor thumbnail')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(courses);
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course duration in readable format
router.get('/:id/duration', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('duration');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const hours = Math.floor(course.duration / 60);
    const minutes = course.duration % 60;
    
    let durationText = '';
    if (hours > 0) {
      durationText += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (durationText) durationText += ' ';
      durationText += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    res.json({ duration: durationText, minutes: course.duration });
  } catch (error) {
    console.error('Get course duration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

