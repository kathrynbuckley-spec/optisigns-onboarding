# OptiSigns Onboarding Questionnaire - Project 1

A full-stack onboarding questionnaire application built with **Angular**, **Express.js**, and **MongoDB**. This application demonstrates a complete user registration flow, multi-step form handling, authentication, and admin dashboard capabilities.

## Features

- ✅ User registration and authentication (JWT-based)
- ✅ Protected routes with route guards
- ✅ 5-step interactive questionnaire with progress tracking
- ✅ Form validation and error handling
- ✅ Admin dashboard with filtering and CSV export
- ✅ Role-based access control (User/Admin)
- ✅ RESTful API with Express.js
- ✅ MongoDB database integration
- ✅ Responsive design

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **Angular 17** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Styling
- **RxJS** - Reactive programming
- **Standalone Components** - Modern Angular architecture

## Project Structure

```
optisigns-onboarding/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── isAdmin.js            # Admin role check
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Response.js           # Questionnaire response schema
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints (register, login)
│   │   ├── responses.js          # Questionnaire endpoints
│   │   └── admin.js              # Admin endpoints
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── seed.js                   # Database seeding script
│   └── server.js                 # Express server
│
├── frontend/
│   └── src/
│       └── app/
│           ├── components/
│           │   ├── auth/         # Login & Register components
│           │   ├── questionnaire/ # Multi-step questionnaire
│           │   └── admin/        # Admin dashboard
│           ├── guards/
│           │   └── auth.guard.ts # Route protection
│           ├── interceptors/
│           │   └── auth.interceptor.ts # JWT attachment
│           ├── models/           # TypeScript interfaces
│           ├── services/         # API & Auth services
│           └── environments/     # Environment config
│
└── PLAN.md                       # Detailed implementation plan
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the Repository

```bash
cd optisigns-onboarding
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file with your MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/optisigns-onboarding

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/optisigns-onboarding

# Seed the database with demo data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:4200`

## Demo Credentials

After seeding the database, you can login with:

**Admin Account:**
- Email: `admin@optisigns.com`
- Password: `admin123`

**User Account:**
- Email: `user@acmecoffee.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Questionnaire (Protected)
- `POST /api/responses` - Submit questionnaire response
- `GET /api/responses/me` - Get current user's response

### Admin (Protected - Admin Only)
- `GET /api/admin/responses` - Get all responses
- `GET /api/admin/stats` - Get statistics
- `DELETE /api/admin/responses/:id` - Delete a response

## Usage

### User Flow

1. **Register/Login**: Create an account or login
2. **Questionnaire**: Complete the 5-step questionnaire
   - Step 1: Company Information
   - Step 2: Primary Use Case
   - Step 3: Screen Setup
   - Step 4: Technical Profile
   - Step 5: Feature Interests
3. **Thank You**: View confirmation page
4. **Logout**: End session

### Admin Flow

1. **Login**: Use admin credentials
2. **Dashboard**: View all submitted responses
3. **Filter**: Search and filter by industry, company size
4. **Export**: Download responses as CSV
5. **Delete**: Remove individual responses

## Development

### Backend Development

```bash
cd backend

# Run with nodemon (auto-restart on changes)
npm run dev

# Run in production mode
npm start

# Re-seed database
npm run seed
```

### Frontend Development

```bash
cd frontend

# Serve with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Testing

### Backend Testing with Postman/cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Submit questionnaire (requires JWT token):**
```bash
curl -X POST http://localhost:3000/api/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "companyName": "Test Company",
    "companySize": "11-50",
    "industry": "retail",
    "primaryUseCase": "menu-boards",
    "numberOfScreens": "1-5",
    "technicalProficiency": "intermediate",
    "featureInterests": ["scheduling", "analytics"]
  }'
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ HTTP security headers (Helmet)
- ✅ NoSQL injection prevention
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Role-based access control

## Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin']),
  hasCompletedQuestionnaire: Boolean,
  createdAt: Date
}
```

### Responses Collection
```javascript
{
  userId: ObjectId (ref: User),
  email: String,
  companyName: String,
  companySize: String,
  industry: String,
  primaryUseCase: String,
  useCaseDescription: String,
  numberOfScreens: String,
  screenLocations: String,
  technicalProficiency: String,
  currentPlatform: String,
  featureInterests: [String],
  additionalComments: String,
  submittedAt: Date
}
```

## Deployment

### Backend Deployment (Digital Ocean, Heroku, etc.)

1. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
   - `CORS_ORIGIN`

2. Update start script in package.json
3. Deploy backend
4. Note the deployed backend URL

### Frontend Deployment

1. Update `frontend/src/environments/environment.prod.ts` with backend URL
2. Build for production:
   ```bash
   npm run build
   ```
3. Deploy the `dist/` folder to hosting service

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally: `mongod`
- For Atlas: Check IP whitelist and credentials
- Verify MONGODB_URI in .env file

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4200
lsof -ti:4200 | xargs kill -9
```

### CORS Errors
- Ensure backend CORS_ORIGIN matches frontend URL
- Check that both servers are running

### JWT Token Issues
- Clear localStorage in browser dev tools
- Re-login to get new token

## Future Enhancements

- [ ] Email notifications on submission
- [ ] Multi-language support
- [ ] Progress auto-save (localStorage)
- [ ] Analytics dashboard with charts
- [ ] A/B testing for questions
- [ ] Integration with CRM systems
- [ ] Two-factor authentication
- [ ] Password reset functionality

## License

MIT License - feel free to use this project for learning or portfolio purposes.

## Contributing

This is a portfolio/example project. Feel free to fork and customize for your needs!

## Contact

For questions or feedback about this implementation, please refer to the PLAN.md file for detailed architecture and design decisions.

---

**Built with ❤️ using Angular + Express + MongoDB**
