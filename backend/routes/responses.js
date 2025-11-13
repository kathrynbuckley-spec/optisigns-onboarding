const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Response = require('../models/Response');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

// @route   POST /api/responses
// @desc    Submit questionnaire response
// @access  Protected (requires JWT)
router.post('/', authenticateToken, [
  // Validation middleware
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('companySize').isIn(['1-10', '11-50', '51-200', '201-500', '500+']).withMessage('Invalid company size'),
  body('industry').isIn(['retail', 'healthcare', 'education', 'hospitality', 'corporate', 'transportation', 'government', 'other']).withMessage('Invalid industry'),
  body('primaryUseCase').isIn(['menu-boards', 'wayfinding', 'corporate-comms', 'advertising', 'information-display', 'event-signage', 'other']).withMessage('Invalid primary use case'),
  body('numberOfScreens').isIn(['1-5', '6-20', '21-50', '51-100', '100+']).withMessage('Invalid number of screens'),
  body('technicalProficiency').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid technical proficiency'),
  body('featureInterests').optional().isArray().withMessage('Feature interests must be an array'),
  body('additionalComments').optional().isLength({ max: 500 }).withMessage('Additional comments cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    // Check if user has already submitted a response
    const existingResponse = await Response.findOne({ userId: req.user._id });
    if (existingResponse) {
      return res.status(400).json({
        success: false,
        error: 'User has already completed the questionnaire'
      });
    }

    // Extract validated data from request body
    const {
      companyName,
      companySize,
      industry,
      primaryUseCase,
      useCaseDescription,
      numberOfScreens,
      screenLocations,
      technicalProficiency,
      currentPlatform,
      featureInterests,
      additionalComments,
      referralSource
    } = req.body;

    // Create new response
    const response = new Response({
      userId: req.user._id,
      email: req.user.email,
      companyName,
      companySize,
      industry,
      primaryUseCase,
      useCaseDescription,
      numberOfScreens,
      screenLocations,
      technicalProficiency,
      currentPlatform,
      featureInterests: featureInterests || [],
      additionalComments,
      ipAddress: req.ip,
      referralSource
    });

    await response.save();

    // Update user's hasCompletedQuestionnaire flag
    await User.findByIdAndUpdate(req.user._id, {
      hasCompletedQuestionnaire: true
    });

    res.status(201).json({
      success: true,
      responseId: response._id,
      message: 'Thank you for completing the questionnaire!'
    });
  } catch (error) {
    console.error('Response submission error:', error);

    // Handle duplicate key error (should not happen due to check above, but just in case)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'User has already completed the questionnaire'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during response submission'
    });
  }
});

// @route   GET /api/responses/me
// @desc    Get current user's questionnaire response
// @access  Protected (requires JWT)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const response = await Response.findOne({ userId: req.user._id });

    if (!response) {
      return res.status(404).json({
        success: false,
        error: 'No questionnaire response found for this user'
      });
    }

    res.status(200).json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Get response error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching response'
    });
  }
});

module.exports = router;
