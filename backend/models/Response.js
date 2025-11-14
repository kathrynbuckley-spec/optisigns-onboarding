const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  // Link to user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  // Step 1: Company Information
  accountCountry: {
    type: String,
    required: [true, 'Company country is required'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  companySize: {
    type: String,
    required: [true, 'Company size is required'],
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: ['retail', 'healthcare', 'education', 'hospitality', 'corporate', 'professional-services', 'real-estate', 'technology']
  },

  // Step 2: Primary Use Case
  primaryUseCase: {
    type: String,
    required: [true, 'Primary use case is required'],
    enum: ['menu-boards', 'wayfinding', 'corporate-comms', 'advertising', 'information-display', 'event-signage', 'other']
  },
  useCaseDescription: {
    type: String,
    trim: true
  },

  // Step 3: Screen Setup
  numberOfScreens: {
    type: String,
    required: [true, 'Number of screens is required'],
    enum: ['1-5', '6-20', '21-50', '51-100', '100+']
  },
  screenLocations: {
    type: String,
    trim: true
  },

  // Step 4: Technical Profile
  technicalProficiency: {
    type: String,
    required: [true, 'Technical proficiency is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  currentPlatform: {
    type: String,
    trim: true,
    maxlength: [200, 'Current platform description cannot exceed 200 characters']
  },

  // Step 5: Feature Interests
  featureInterests: [{
    type: String,
    enum: ['scheduling', 'multi-zone', 'data-integration', 'mobile-app', 'analytics', 'collaboration', 'emergency-alerts', 'social-feeds']
  }],
  additionalComments: {
    type: String,
    trim: true,
    maxlength: [500, 'Additional comments cannot exceed 500 characters']
  },

  // Metadata
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  referralSource: String
});

// Index for sorting by submission date
responseSchema.index({ submittedAt: -1 });

// Ensure one response per user
responseSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Response', responseSchema);
