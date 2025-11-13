require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Response = require('./models/Response');

// Sample data for seeding
const sampleUsers = [
  {
    email: 'admin@optisigns.com',
    password: 'admin123',
    role: 'admin',
    hasCompletedQuestionnaire: false
  },
  {
    email: 'user@acmecoffee.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'contact@techcorp.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'info@healthplus.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'manager@retailstore.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'director@university.edu',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'owner@restaurant.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'it@corporateoffice.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'facilities@airport.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'communications@city.gov',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'marketing@fashionbrand.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  }
];

const sampleResponses = [
  {
    email: 'user@acmecoffee.com',
    companyName: 'Acme Coffee Shop',
    companySize: '1-10',
    industry: 'retail',
    primaryUseCase: 'menu-boards',
    useCaseDescription: '',
    numberOfScreens: '1-5',
    screenLocations: 'Main counter, Drive-through',
    technicalProficiency: 'beginner',
    currentPlatform: 'Currently using printed menus',
    featureInterests: ['scheduling', 'mobile-app'],
    additionalComments: 'Looking for an easy-to-use solution for digital menu boards',
    submittedAt: new Date('2024-11-01T10:30:00Z')
  },
  {
    email: 'contact@techcorp.com',
    companyName: 'TechCorp Industries',
    companySize: '201-500',
    industry: 'corporate',
    primaryUseCase: 'corporate-comms',
    useCaseDescription: '',
    numberOfScreens: '21-50',
    screenLocations: 'Lobby, Conference rooms, Cafeteria, Hallways',
    technicalProficiency: 'advanced',
    currentPlatform: 'Custom internal system',
    featureInterests: ['data-integration', 'analytics', 'collaboration', 'emergency-alerts'],
    additionalComments: 'Need API integration with our HR system for employee announcements',
    submittedAt: new Date('2024-11-03T14:15:00Z')
  },
  {
    email: 'info@healthplus.com',
    companyName: 'HealthPlus Medical Center',
    companySize: '51-200',
    industry: 'healthcare',
    primaryUseCase: 'wayfinding',
    useCaseDescription: '',
    numberOfScreens: '6-20',
    screenLocations: 'Main entrance, Each floor, Waiting areas',
    technicalProficiency: 'intermediate',
    currentPlatform: 'Static directional signs',
    featureInterests: ['scheduling', 'multi-zone', 'emergency-alerts'],
    additionalComments: 'Priority is helping patients navigate our facility easily',
    submittedAt: new Date('2024-11-05T09:45:00Z')
  },
  {
    email: 'manager@retailstore.com',
    companyName: 'Fashion Forward Retail',
    companySize: '11-50',
    industry: 'retail',
    primaryUseCase: 'advertising',
    useCaseDescription: '',
    numberOfScreens: '6-20',
    screenLocations: 'Storefront, Sales floor, Fitting rooms',
    technicalProficiency: 'beginner',
    currentPlatform: 'No digital signage currently',
    featureInterests: ['scheduling', 'social-feeds', 'mobile-app'],
    additionalComments: 'Want to showcase promotions and social media content',
    submittedAt: new Date('2024-11-06T16:20:00Z')
  },
  {
    email: 'director@university.edu',
    companyName: 'Springfield University',
    companySize: '500+',
    industry: 'education',
    primaryUseCase: 'information-display',
    useCaseDescription: '',
    numberOfScreens: '100+',
    screenLocations: 'All buildings across campus',
    technicalProficiency: 'advanced',
    currentPlatform: 'Legacy system from 2010',
    featureInterests: ['scheduling', 'data-integration', 'analytics', 'emergency-alerts', 'collaboration'],
    additionalComments: 'Need to display class schedules, campus events, and emergency notifications',
    submittedAt: new Date('2024-11-07T11:00:00Z')
  },
  {
    email: 'owner@restaurant.com',
    companyName: 'Bella Vista Restaurant',
    companySize: '1-10',
    industry: 'hospitality',
    primaryUseCase: 'menu-boards',
    useCaseDescription: '',
    numberOfScreens: '1-5',
    screenLocations: 'Bar area, Entrance',
    technicalProficiency: 'beginner',
    currentPlatform: 'Chalkboard menus',
    featureInterests: ['scheduling', 'mobile-app'],
    additionalComments: 'Want to easily update daily specials',
    submittedAt: new Date('2024-11-08T13:30:00Z')
  },
  {
    email: 'it@corporateoffice.com',
    companyName: 'Global Finance Corp',
    companySize: '500+',
    industry: 'corporate',
    primaryUseCase: 'corporate-comms',
    useCaseDescription: '',
    numberOfScreens: '51-100',
    screenLocations: 'All office floors, Trading floor, Executive suite',
    technicalProficiency: 'advanced',
    currentPlatform: 'Yodeck',
    featureInterests: ['data-integration', 'analytics', 'emergency-alerts', 'multi-zone'],
    additionalComments: 'Need real-time stock market data integration',
    submittedAt: new Date('2024-11-09T08:15:00Z')
  },
  {
    email: 'facilities@airport.com',
    companyName: 'Metro City Airport',
    companySize: '201-500',
    industry: 'transportation',
    primaryUseCase: 'wayfinding',
    useCaseDescription: '',
    numberOfScreens: '51-100',
    screenLocations: 'Terminals, Gates, Baggage claim, Parking',
    technicalProficiency: 'intermediate',
    currentPlatform: 'Mix of different systems',
    featureInterests: ['data-integration', 'multi-zone', 'emergency-alerts'],
    additionalComments: 'Need to integrate with flight information system',
    submittedAt: new Date('2024-11-10T12:00:00Z')
  },
  {
    email: 'communications@city.gov',
    companyName: 'City of Springfield',
    companySize: '500+',
    industry: 'government',
    primaryUseCase: 'information-display',
    useCaseDescription: '',
    numberOfScreens: '21-50',
    screenLocations: 'City Hall, Library, Community centers, Parks',
    technicalProficiency: 'intermediate',
    currentPlatform: 'Bulletin boards',
    featureInterests: ['scheduling', 'emergency-alerts', 'social-feeds'],
    additionalComments: 'Want to keep citizens informed about events and services',
    submittedAt: new Date('2024-11-11T10:45:00Z')
  },
  {
    email: 'marketing@fashionbrand.com',
    companyName: 'Urban Style Brand',
    companySize: '51-200',
    industry: 'retail',
    primaryUseCase: 'event-signage',
    useCaseDescription: '',
    numberOfScreens: '6-20',
    screenLocations: 'Pop-up stores, Fashion shows, Trade shows',
    technicalProficiency: 'intermediate',
    currentPlatform: 'Printed banners',
    featureInterests: ['scheduling', 'mobile-app', 'social-feeds', 'collaboration'],
    additionalComments: 'Need portable solution for events and temporary installations',
    submittedAt: new Date('2024-11-12T15:30:00Z')
  }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Response.deleteMany({});
    console.log('Existing data cleared');

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    }

    // Create responses and link them to users
    console.log('\nCreating questionnaire responses...');
    for (const responseData of sampleResponses) {
      const user = createdUsers.find(u => u.email === responseData.email);
      if (user) {
        const response = new Response({
          ...responseData,
          userId: user._id
        });
        await response.save();
        console.log(`Created response for: ${responseData.email}`);
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Admin: admin@optisigns.com / admin123');
    console.log('User: user@acmecoffee.com / password123');
    console.log('\nTotal users created:', createdUsers.length);
    console.log('Total responses created:', sampleResponses.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
