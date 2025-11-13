# OptiSigns Onboarding Questionnaire - Example Project

## Project Overview

A full-stack onboarding questionnaire application to demonstrate **Angular + Express + MongoDB** skills. This example project simulates collecting user preferences for a digital signage platform, showcasing form handling, API integration, and data persistence.

**MVP Scope (1 Week):**
- User registration & login (required to access questionnaire)
- 5-step questionnaire form with progress tracking
- Data stored in MongoDB (user accounts + responses)
- Admin view to review all responses
- Deployment: Standalone app (may or may not integrate later)

**Tech Stack:**
- Frontend: Angular with authentication guards
- Backend: Express.js with JWT authentication
- Database: MongoDB Atlas (users + responses collections)
- Deployment: Digital Ocean App Platform (optional)

---

## Project Purpose & Skills Demonstrated

**Primary Goal:** Create a portfolio-ready full-stack application showcasing:
- Multi-step form handling in Angular
- RESTful API development with Express
- MongoDB database integration
- Full-stack application deployment

**Use Case (Simulated):**
An onboarding questionnaire that would help a digital signage platform understand customer needs and personalize their experience. This demonstrates real-world business application development.

**Data Flow (Example Project):**
```
User Completes Questionnaire
         ↓
Stored in MongoDB (responses collection)
         ↓
Admin Dashboard displays all responses
         ↓
(In production: would feed into personalization engine)
```

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│        Digital Ocean App Platform                │
├───────────────────────┬──────────────────────────┤
│  Angular Frontend     │   Express.js Backend     │
│  - Login/Register     │   - JWT Auth             │
│  - Auth Guards        │   - Auth endpoints       │
│  - 5-step form        │   - Questionnaire API    │
│  - Admin dashboard    │   - Admin API            │
└───────────────────────┴──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │   MongoDB Atlas          │
                        │   - users collection     │
                        │   - responses collection │
                        └──────────────────────────┘
```

**API Endpoints:**

**Authentication:**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

**Questionnaire (Requires JWT):**
- `POST /api/responses` - Submit completed questionnaire
- `GET /api/responses/me` - Get current user's response

**Admin (Requires JWT + admin role):**
- `GET /api/admin/responses` - View all responses

---

## 1-Week Implementation Plan

### Day 1-2: Project Setup + Backend

**✅ Tasks:**
- [ ] Init Git repo
- [ ] Create Express.js server
- [ ] Connect to MongoDB Atlas
- [ ] Create Mongoose schemas (User + Response)
- [ ] Implement JWT authentication:
  - [ ] `POST /api/auth/register` - Hash password with bcrypt
  - [ ] `POST /api/auth/login` - Verify credentials, return JWT
  - [ ] Create auth middleware to verify JWT
- [ ] Implement questionnaire endpoints:
  - [ ] `POST /api/responses` (protected)
  - [ ] `GET /api/responses/me` (protected)
  - [ ] `GET /api/admin/responses` (protected, admin only)
- [ ] Test with Postman
- [ ] Add CORS, input sanitization, error handling

**🎯 Goal:** Working backend with authentication and questionnaire API

---

### Day 3-4: Angular Frontend

**✅ Tasks:**
- [ ] Generate Angular project (`ng new frontend --standalone --routing`)
- [ ] Create authentication components:
  - [ ] Login component
  - [ ] Register component
  - [ ] Auth service (store JWT, handle login/logout)
  - [ ] Auth guard (protect questionnaire routes)
  - [ ] HTTP interceptor (attach JWT to requests)
- [ ] Create questionnaire components:
  - [ ] 5 step components (company-info, use-case, screens, technical, features)
  - [ ] Progress indicator (1/5, 2/5, etc.)
  - [ ] Step navigation (next/back/submit)
  - [ ] Thank-you page
- [ ] Build reactive form with FormBuilder
- [ ] Add form validation
- [ ] Create API service
- [ ] Simple styling

**🎯 Goal:** Complete user flow (register → login → questionnaire → submit)

---

### Day 5: Integration + Admin View

**✅ Tasks:**
- [ ] Connect frontend to backend API
- [ ] Test full questionnaire flow end-to-end
- [ ] Fix bugs and validation issues
- [ ] Create simple admin view page (new Angular route `/admin`)
- [ ] Display all responses in a table with filtering
- [ ] Add export to CSV button (optional but nice-to-have)

**🎯 Goal:** End-to-end working application with admin panel

---

### Day 6-7: Deployment + Testing

**✅ Tasks:**
- [ ] Configure Digital Ocean App Platform
- [ ] Deploy backend app (set build/run commands)
- [ ] Deploy frontend app (Angular production build)
- [ ] Set environment variables in DO dashboard
- [ ] Configure MongoDB Atlas IP whitelist for Digital Ocean
- [ ] Test production deployment thoroughly
- [ ] Share link with team for feedback
- [ ] Fix any deployment issues
- [ ] (Optional) Set up custom domain

**🎯 Goal:** Live application accessible via URL

---

## Database Schema

### Collection 1: `users`

```javascript
{
  email: String,       // unique, required, lowercase
  password: String,    // hashed with bcrypt, required
  role: String,        // 'user' or 'admin', default: 'user'
  createdAt: Date,     // default: Date.now
  hasCompletedQuestionnaire: Boolean  // default: false
}
```

**Mongoose Schema:**
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  hasCompletedQuestionnaire: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Index for faster email lookups
userSchema.index({ email: 1 });
```

---

### Collection 2: `responses`

```javascript
{
  // Link to user
  userId: ObjectId,   // reference to users collection, required
  email: String,      // denormalized from user for convenience

  // Step 1: Company Information
  companyName: String,  // required
  companySize: String,  // required: '1-10' | '11-50' | '51-200' | '201-500' | '500+'
  industry: String,     // required: 'retail' | 'healthcare' | 'education' | 'hospitality' |
                        //           'corporate' | 'transportation' | 'government' | 'other'

  // Step 2: Primary Use Case
  primaryUseCase: String,      // required: 'menu-boards' | 'wayfinding' | 'corporate-comms' |
                               //           'advertising' | 'information-display' | 'event-signage' | 'other'
  useCaseDescription: String,  // optional, if user selects 'other'

  // Step 3: Screen Setup
  numberOfScreens: String,  // required: '1-5' | '6-20' | '21-50' | '51-100' | '100+'
  screenLocations: String,  // optional, e.g., "Lobby, Conference rooms, Cafeteria"

  // Step 4: Technical Profile
  technicalProficiency: String,  // required: 'beginner' | 'intermediate' | 'advanced'
  currentPlatform: String,       // optional, e.g., "Using PowerPoint", "No system yet"

  // Step 5: Feature Interests (multi-select checkboxes)
  featureInterests: [String],    // array of: 'scheduling' | 'multi-zone' | 'data-integration' |
                                 //           'mobile-app' | 'analytics' | 'collaboration' |
                                 //           'emergency-alerts' | 'social-feeds'
  additionalComments: String,    // optional, max 500 chars

  // Metadata (auto-populated)
  submittedAt: Date,      // default: Date.now
  ipAddress: String,      // optional, for analytics
  referralSource: String  // optional, e.g., "Email campaign", "Website signup"
}
```

**Mongoose Schema Example:**
```javascript
const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: { type: String, trim: true, lowercase: true },
  companyName: { type: String, required: true, trim: true },
  companySize: {
    type: String,
    required: true,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  industry: {
    type: String,
    required: true,
    enum: ['retail', 'healthcare', 'education', 'hospitality', 'corporate', 'transportation', 'government', 'other']
  },
  primaryUseCase: {
    type: String,
    required: true,
    enum: ['menu-boards', 'wayfinding', 'corporate-comms', 'advertising', 'information-display', 'event-signage', 'other']
  },
  useCaseDescription: { type: String, trim: true },
  numberOfScreens: {
    type: String,
    required: true,
    enum: ['1-5', '6-20', '21-50', '51-100', '100+']
  },
  screenLocations: { type: String, trim: true },
  technicalProficiency: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  currentPlatform: { type: String, trim: true },
  featureInterests: [{
    type: String,
    enum: ['scheduling', 'multi-zone', 'data-integration', 'mobile-app', 'analytics', 'collaboration', 'emergency-alerts', 'social-feeds']
  }],
  additionalComments: { type: String, trim: true, maxlength: 500 },
  submittedAt: { type: Date, default: Date.now },
  ipAddress: String,
  referralSource: String
});

// Index for sorting by submission date
responseSchema.index({ submittedAt: -1 });
```

---

## API Specification

### 1. Register New User

```http
POST /api/auth/register

Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (201 Created):
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user"
  }
}

Response (400 Bad Request):
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 2. Login

```http
POST /api/auth/login

Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user",
    "hasCompletedQuestionnaire": false
  }
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 3. Submit Questionnaire Response (Protected)

```http
POST /api/responses

Headers:
  Authorization: Bearer <jwt-token>

Content-Type: application/json

Body:
{
  "companyName": "Acme Corp",
  "companySize": "51-200",
  "industry": "retail",
  "primaryUseCase": "menu-boards",
  "useCaseDescription": "",
  "numberOfScreens": "6-20",
  "screenLocations": "Main lobby, Food court",
  "technicalProficiency": "intermediate",
  "currentPlatform": "Currently using PowerPoint",
  "featureInterests": ["scheduling", "analytics", "mobile-app"],
  "additionalComments": "Interested in trial period"
}

Response (201 Created):
{
  "success": true,
  "responseId": "507f1f77bcf86cd799439011",
  "message": "Thank you for completing the questionnaire!"
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "Invalid or missing token"
}

Response (400 Bad Request):
{
  "success": false,
  "error": "User has already completed the questionnaire"
}
```

**Validation Rules:**
- Requires valid JWT token
- User can only submit questionnaire once
- `companyName`, `companySize`, `industry`, `primaryUseCase`, `numberOfScreens`, `technicalProficiency` are required
- Enum values must match schema
- `additionalComments` max 500 characters
- Sanitize all string inputs to prevent XSS

---

### 4. Get My Response (Protected)

```http
GET /api/responses/me

Headers:
  Authorization: Bearer <jwt-token>

Response (200 OK):
{
  "success": true,
  "response": {
    "_id": "507f1f77bcf86cd799439011",
    "companyName": "Acme Corp",
    "companySize": "51-200",
    "industry": "retail",
    "primaryUseCase": "menu-boards",
    "numberOfScreens": "6-20",
    "technicalProficiency": "intermediate",
    "featureInterests": ["scheduling", "analytics"],
    "submittedAt": "2024-11-12T10:30:00.000Z"
  }
}

Response (404 Not Found):
{
  "success": false,
  "error": "No questionnaire response found for this user"
}
```

---

### 5. Get All Responses - Admin Only (Protected)

```http
GET /api/admin/responses

Headers:
  Authorization: Bearer <jwt-token>

Response (200 OK):
{
  "success": true,
  "count": 42,
  "responses": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "email": "user@acmecorp.com",
      "companyName": "Acme Corp",
      "companySize": "51-200",
      "industry": "retail",
      "primaryUseCase": "menu-boards",
      "numberOfScreens": "6-20",
      "technicalProficiency": "intermediate",
      "featureInterests": ["scheduling", "analytics"],
      "submittedAt": "2024-11-12T10:30:00.000Z"
    },
    ...
  ]
}

Response (403 Forbidden):
{
  "success": false,
  "error": "Admin access required"
}
```

**Auth Middleware:**
- Verify JWT token in Authorization header
- Check user role for admin endpoints
- Attach user object to request for downstream use

---

## Questionnaire Flow & Questions

### Step 1/5: Company Information
**Heading:** "Tell us about your organization"

**Fields:**
- Company Name (text input, required)
- Company Size (dropdown, required)
  - 1-10 employees
  - 11-50 employees
  - 51-200 employees
  - 201-500 employees
  - 500+ employees
- Industry (dropdown with search, required)
  - Retail
  - Healthcare
  - Education
  - Hospitality
  - Corporate/Office
  - Transportation
  - Government
  - Other

**Button:** "Next →"

---

### Step 2/5: Primary Use Case
**Heading:** "How do you plan to use OptiSigns?"

**Fields:**
- Primary Use Case (radio buttons with icons, required)
  - 📋 Menu Boards
  - 🗺️ Wayfinding & Directories
  - 💼 Corporate Communications
  - 📢 Advertising & Promotions
  - ℹ️ Information Display
  - 🎉 Event Signage
  - ✏️ Other (opens text input)
- Use Case Description (text input, conditional - only if "Other" selected)

**Buttons:** "← Back" | "Next →"

---

### Step 3/5: Screen Setup
**Heading:** "Tell us about your display setup"

**Fields:**
- Number of Screens (dropdown, required)
  - 1-5 screens
  - 6-20 screens
  - 21-50 screens
  - 51-100 screens
  - 100+ screens
- Screen Locations (text input, optional)
  - Placeholder: "e.g., Main lobby, Conference rooms, Cafeteria"

**Buttons:** "← Back" | "Next →"

---

### Step 4/5: Technical Profile
**Heading:** "Help us understand your technical background"

**Fields:**
- Technical Proficiency (radio buttons, required)
  - 🌱 Beginner - "I'm new to digital signage"
  - 🌿 Intermediate - "I have some experience with similar tools"
  - 🌳 Advanced - "I'm very comfortable with technology"
- Current Platform (text input, optional)
  - Placeholder: "e.g., PowerPoint, Google Slides, Another digital signage platform, or None"

**Buttons:** "← Back" | "Next →"

---

### Step 5/5: Feature Interests
**Heading:** "Which features are most important to you?"

**Fields:**
- Feature Interests (checkboxes - multi-select, at least 1 required)
  - ⏰ Content Scheduling
  - 🖼️ Multi-Zone Layouts
  - 🔗 Data Integration (RSS, APIs, etc.)
  - 📱 Mobile App Management
  - 📊 Analytics & Reporting
  - 👥 Team Collaboration
  - 🚨 Emergency Alerts
  - 📲 Social Media Feeds
- Additional Comments (textarea, optional, 500 char limit)
  - Placeholder: "Any specific needs, questions, or feedback?"

**Buttons:** "← Back" | "Submit ✓"

---

### Completion Page
**Heading:** "Thank you for completing the questionnaire!"

**Content:**
- "We've received your responses and will use them to personalize your OptiSigns experience."
- "Check your email for next steps to get started."
- (Optional) Show a summary of their responses
- CTA button: "Go to OptiSigns Dashboard" or "Close"

---

## Technology Stack & Dependencies

### Backend (Node.js + Express)

**package.json:**
```json
{
  "name": "optisigns-onboarding-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "express-mongo-sanitize": "^2.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Key Files:**
- `server.js` - Express app setup, routes, middleware
- `models/User.js` - User Mongoose schema
- `models/Response.js` - Response Mongoose schema
- `routes/auth.js` - Authentication routes (register, login)
- `routes/responses.js` - Questionnaire routes
- `routes/admin.js` - Admin routes
- `middleware/auth.js` - JWT verification middleware
- `middleware/isAdmin.js` - Admin role check middleware
- `.env` - Environment variables

**Environment Variables (.env):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/optisigns-onboarding
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:4200
```

---

### Frontend (Angular)

**Commands:**
```bash
ng new frontend --standalone --routing --style=scss
cd frontend
ng generate component components/questionnaire
ng generate component components/step-one
ng generate component components/step-two
ng generate component components/step-three
ng generate component components/step-four
ng generate component components/step-five
ng generate component components/thank-you
ng generate component components/admin-dashboard
ng generate service services/api
```

**Key Dependencies:**
- @angular/core, @angular/common, @angular/router (~17.0)
- @angular/forms (ReactiveFormsModule)
- @angular/common/http (HttpClient)

**Environment Config:**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.ondigitalocean.app/api'
};
```

---

## Security Considerations (MVP)

### Input Validation
- ✅ Validate all required fields on backend
- ✅ Sanitize inputs with `express-mongo-sanitize` to prevent NoSQL injection
- ✅ Use `express-validator` for schema validation
- ✅ Limit request body size to prevent DoS

### Authentication
- ✅ HTTP Basic Auth for admin endpoint (temporary for MVP)
- ⚠️ **TODO Post-MVP:** Implement JWT auth and integrate with main OptiSigns auth

### CORS
- ✅ Configure CORS to only allow frontend origin
- ✅ Enable credentials if needed

### Rate Limiting
- ⚠️ **Optional for MVP:** Add rate limiting to prevent spam submissions
- ✅ **Post-MVP:** Implement with `express-rate-limit`

### HTTPS
- ✅ Digital Ocean App Platform provides automatic HTTPS

---

## Deployment Configuration

### MongoDB Atlas Setup
1. Create free cluster (M0 tier)
2. Create database user with read/write permissions
3. Add Digital Ocean IP ranges to IP Access List (or allow all for MVP: 0.0.0.0/0)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/optisigns-onboarding`

### Digital Ocean App Platform

**Backend App Spec:**
```yaml
name: optisigns-onboarding-backend
services:
  - name: api
    source_dir: /backend
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs  # $5/month
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8080
      - key: MONGODB_URI
        value: ${MONGODB_URI}  # Set in DO dashboard as secret
        type: SECRET
      - key: ADMIN_USERNAME
        value: ${ADMIN_USERNAME}
        type: SECRET
      - key: ADMIN_PASSWORD
        value: ${ADMIN_PASSWORD}
        type: SECRET
      - key: CORS_ORIGIN
        value: ${FRONTEND_URL}
    http_port: 8080
```

**Frontend App Spec:**
```yaml
name: optisigns-onboarding-frontend
services:
  - name: web
    source_dir: /frontend
    build_command: npm install && npm run build -- --configuration production
    run_command: npx http-server -p 8080 dist/frontend/browser
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs  # $5/month
    envs:
      - key: API_URL
        value: ${BACKEND_URL}  # Auto-populated by DO
    http_port: 8080
```

**Estimated Cost:** $10/month total (2 apps at $5 each) + MongoDB Atlas free tier

---

## Success Criteria

**MVP is successful if:**
1. ✅ User can complete all 5 steps without errors
2. ✅ Data is correctly saved to MongoDB
3. ✅ Admin can view all submitted responses
4. ✅ Form has basic validation and error messages
5. ✅ Application is deployed and accessible via URL
6. ✅ No major security vulnerabilities (XSS, injection)

**Post-MVP Improvements:**
- Integrate with existing OptiSigns authentication
- Add email notifications on submission
- Implement analytics dashboard with charts
- A/B test different question phrasings
- Add progress auto-save (browser localStorage)
- Multi-language support
- Export responses to CSV/PDF
- Connect responses to user personalization engine

---

## Simplifications for Example Project

Since this is a portfolio/example project:

1. **Branding:** Use simple, clean design with placeholder colors (blue/white theme)
2. **Deployment:** Optional - can run locally and demo with screenshots, or deploy to DO
3. **Admin Credentials:** Use simple defaults (admin/admin123 - fine for demo)
4. **Email Field:** Make it optional
5. **Seed Data:** Include script to populate 10-15 sample responses for admin dashboard demo
6. **Integration:** Skip OptiSigns-specific integration points
7. **Analytics:** Skip for example project

## Demo-Ready Features to Highlight

This project showcases:
- ✅ **Frontend Skills:** Angular reactive forms, multi-step navigation, route guards, HTTP interceptors, JWT handling
- ✅ **Backend Skills:** RESTful API design, JWT authentication, MongoDB integration, password hashing, middleware
- ✅ **Authentication:** User registration/login, protected routes, role-based access control (admin)
- ✅ **Full-Stack Integration:** CORS, environment configuration, token-based auth
- ✅ **Security:** Password hashing (bcrypt), JWT tokens, input sanitization, protected endpoints
- ✅ **Deployment:** (Optional) Digital Ocean deployment, environment variables
- ✅ **Code Quality:** Clean structure, separation of concerns, reusable components

---

## Seed Data for Demo

Add a seed script (`backend/seed.js`) to populate sample users and responses:

```javascript
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const Response = require('./models/Response');

// Sample users
const sampleUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',  // Will be hashed
    role: 'admin',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'user1@acmecoffee.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  {
    email: 'user2@techcorp.com',
    password: 'password123',
    role: 'user',
    hasCompletedQuestionnaire: true
  },
  // ... more sample users
];

// Sample questionnaire responses (will be linked to users)
const sampleResponses = [
  {
    email: 'user1@acmecoffee.com',
    companyName: "Acme Coffee Shop",
    companySize: "1-10",
    industry: "retail",
    primaryUseCase: "menu-boards",
    numberOfScreens: "1-5",
    technicalProficiency: "beginner",
    featureInterests: ["scheduling", "mobile-app"],
    submittedAt: new Date('2024-11-01')
  },
  {
    email: 'user2@techcorp.com',
    companyName: "TechCorp Industries",
    companySize: "201-500",
    industry: "corporate",
    primaryUseCase: "corporate-comms",
    numberOfScreens: "21-50",
    technicalProficiency: "advanced",
    featureInterests: ["data-integration", "analytics", "collaboration"],
    submittedAt: new Date('2024-11-05')
  },
  // ... 10-15 more samples
];

// Seed function will:
// 1. Create users
// 2. Link responses to user IDs
```

**Run with:** `node seed.js` to populate MongoDB with:
- 1 admin user (admin@example.com / admin123)
- 10-15 regular users with completed questionnaires
- Demo data for admin dashboard

---

## Next Steps

**Option 1: Quick Start (Recommended for example project)**
1. Clone/start with backend first (Day 1-2)
2. Test backend with Postman
3. Build Angular frontend (Day 3-4)
4. Add seed data and admin view (Day 5)
5. Run locally and take screenshots for portfolio

**Option 2: Full Deployment**
1. Build complete app locally first
2. Deploy to Digital Ocean (Day 6-7)
3. Get live URLs for portfolio/resume

**Ready to start building?** Let me know if you want me to:
- Start implementing the backend
- Start implementing the frontend
- Set up the project structure
- Or make any other changes to the plan!
