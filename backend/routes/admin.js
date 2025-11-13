const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// @route   GET /api/admin/responses
// @desc    Get all questionnaire responses (admin only)
// @access  Protected (requires JWT + admin role)
router.get('/responses', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get all responses, sorted by submission date (newest first)
    const responses = await Response.find()
      .sort({ submittedAt: -1 })
      .populate('userId', 'email role createdAt');

    res.status(200).json({
      success: true,
      count: responses.length,
      responses
    });
  } catch (error) {
    console.error('Get all responses error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching responses'
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get questionnaire statistics (admin only)
// @access  Protected (requires JWT + admin role)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResponses = await Response.countDocuments();
    const usersCompleted = await User.countDocuments({ hasCompletedQuestionnaire: true });

    // Get distribution of company sizes
    const companySizeDistribution = await Response.aggregate([
      {
        $group: {
          _id: '$companySize',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get distribution of industries
    const industryDistribution = await Response.aggregate([
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get most popular features
    const featurePopularity = await Response.aggregate([
      {
        $unwind: '$featureInterests'
      },
      {
        $group: {
          _id: '$featureInterests',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalResponses,
        usersCompleted,
        completionRate: totalUsers > 0 ? ((usersCompleted / totalUsers) * 100).toFixed(2) : 0,
        companySizeDistribution,
        industryDistribution,
        featurePopularity
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
});

// @route   DELETE /api/admin/responses/:id
// @desc    Delete a specific response (admin only)
// @access  Protected (requires JWT + admin role)
router.delete('/responses/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        error: 'Response not found'
      });
    }

    // Update user's hasCompletedQuestionnaire flag
    await User.findByIdAndUpdate(response.userId, {
      hasCompletedQuestionnaire: false
    });

    await Response.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Response deleted successfully'
    });
  } catch (error) {
    console.error('Delete response error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting response'
    });
  }
});

module.exports = router;
