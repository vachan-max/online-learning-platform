const express = require('express');
const Startup = require('../models/Startup');
const User = require('../models/User');

const router = express.Router();

// Get all partnered startups
router.get('/partnered', async (req, res) => {
  try {
    const startups = await Startup.find({ isPartnered: true })
      .select('companyName description logo website industry foundedYear teamSize location')
      .sort({ companyName: 1 });

    res.json(startups);
  } catch (error) {
    console.error('Get partnered startups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all startups with job listings
router.get('/with-jobs', async (req, res) => {
  try {
    const startups = await Startup.find({
      'jobListings.0': { $exists: true },
      'jobListings.isActive': true
    })
    .select('companyName description logo website industry jobListings')
    .populate('jobListings.applications.userId', 'name email college');

    res.json(startups);
  } catch (error) {
    console.error('Get startups with jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get startup by ID
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('jobListings.applications.userId', 'name email college');

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.json(startup);
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job listings by category
router.get('/jobs/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const startups = await Startup.find({
      'jobListings.type': category,
      'jobListings.isActive': true
    })
    .select('companyName logo jobListings')
    .populate('jobListings.applications.userId', 'name email college');

    const jobs = [];
    startups.forEach(startup => {
      startup.jobListings.forEach(job => {
        if (job.type === category && job.isActive) {
          jobs.push({
            id: job._id,
            title: job.title,
            companyName: startup.companyName,
            companyLogo: startup.logo,
            type: job.type,
            location: job.location,
            salary: job.salary,
            requirements: job.requirements,
            applications: job.applications.length
          });
        }
      });
    });

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search job listings
router.get('/jobs/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const startups = await Startup.find({
      $or: [
        { 'jobListings.title': { $regex: query, $options: 'i' } },
        { 'jobListings.description': { $regex: query, $options: 'i' } },
        { companyName: { $regex: query, $options: 'i' } },
        { industry: { $regex: query, $options: 'i' } }
      ],
      'jobListings.isActive': true
    })
    .select('companyName logo jobListings')
    .populate('jobListings.applications.userId', 'name email college');

    const jobs = [];
    startups.forEach(startup => {
      startup.jobListings.forEach(job => {
        if (job.isActive) {
          jobs.push({
            id: job._id,
            title: job.title,
            companyName: startup.companyName,
            companyLogo: startup.logo,
            type: job.type,
            location: job.location,
            salary: job.salary,
            requirements: job.requirements,
            applications: job.applications.length
          });
        }
      });
    });

    res.json(jobs);
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for a job
router.post('/jobs/:startupId/:jobId/apply', async (req, res) => {
  try {
    const { startupId, jobId } = req.params;
    const { userId, name, email, college } = req.body;

    if (!userId || !name || !email || !college) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const job = startup.jobListings.id(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ message: 'Job is not active' });
    }

    // Check if user already applied
    const alreadyApplied = job.applications.some(
      app => app.userId.toString() === userId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // Add application
    job.applications.push({
      userId,
      appliedAt: new Date(),
      status: 'pending'
    });

    await startup.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's job applications
router.get('/applications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const startups = await Startup.find({
      'jobListings.applications.userId': userId
    })
    .select('companyName logo jobListings')
    .populate('jobListings.applications.userId', 'name email college');

    const applications = [];
    startups.forEach(startup => {
      startup.jobListings.forEach(job => {
        const userApplication = job.applications.find(
          app => app.userId._id.toString() === userId
        );
        if (userApplication) {
          applications.push({
            jobId: job._id,
            jobTitle: job.title,
            companyName: startup.companyName,
            companyLogo: startup.logo,
            appliedAt: userApplication.appliedAt,
            status: userApplication.status
          });
        }
      });
    });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get startup statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalStartups = await Startup.countDocuments();
    const partneredStartups = await Startup.countDocuments({ isPartnered: true });
    const startupsWithJobs = await Startup.countDocuments({
      'jobListings.0': { $exists: true }
    });

    const totalJobs = await Startup.aggregate([
      { $unwind: '$jobListings' },
      { $match: { 'jobListings.isActive': true } },
      { $count: 'total' }
    ]);

    const totalApplications = await Startup.aggregate([
      { $unwind: '$jobListings' },
      { $unwind: '$jobListings.applications' },
      { $count: 'total' }
    ]);

    res.json({
      totalStartups,
      partneredStartups,
      startupsWithJobs,
      totalJobs: totalJobs.length > 0 ? totalJobs[0].total : 0,
      totalApplications: totalApplications.length > 0 ? totalApplications[0].total : 0
    });
  } catch (error) {
    console.error('Get startup stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

