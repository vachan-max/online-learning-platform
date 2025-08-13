# CareerCycle - Any Course Under ₹19

A revolutionary online learning platform that makes quality education accessible to everyone at an affordable price of just ₹19 per course.

## 🚀 Features

### Core Features
- **Affordable Learning**: Any course for just ₹19
- **Quality Content**: High-quality courses from industry experts
- **Progress Tracking**: Monitor your learning progress with video tracking
- **Certificates**: Earn certificates upon 30% course completion
- **Startup Connect**: Connect with startups for internships and jobs

### Authentication
- User registration and login
- Google OAuth integration
- JWT-based authentication
- Profile management

### Course Management
- Video-based courses with progress tracking
- Course categories and search
- Featured courses
- Course duration and completion tracking

### Payment System
- Razorpay integration
- Secure payment processing
- Payment history tracking
- Course access management

### Certificate System
- PDF certificate generation
- 30% completion requirement
- Unique certificate IDs
- Professional certificate design

### Startup Connect
- Partner startup listings
- Job and internship postings
- Application management
- Company profiles and descriptions

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google OAuth** integration
- **Razorpay** payment gateway
- **PDFKit** for certificate generation

### Frontend
- **React.js** 18
- **TailwindCSS** for styling
- **React Router** for navigation
- **Framer Motion** for animations
- **Axios** for API calls
- **React Player** for video playback

### Database Schema
- **Users**: Authentication, profile, payment history
- **Courses**: Course details, videos, pricing
- **Progress**: User progress tracking, completion
- **Startups**: Company profiles, job listings

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Online-learning-platform
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Environment Setup
Create environment files for both backend and frontend:

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/careercycle
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend
The frontend will automatically proxy to the backend on port 5000.

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
mongod
```

### 5. Run the application
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run server    # Backend only
npm run client    # Frontend only
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Available Routes

### Frontend Routes
- `/` - Landing Page
- `/signup` - User Registration
- `/signin` - User Login
- `/dashboard` - User Dashboard
- `/course/:courseId` - Course Player
- `/certificates` - Certificate Management
- `/startup-connect` - Startup Connect
- `/payment/:courseId` - Payment Page

### Backend API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/courses/*` - Course management
- `/api/progress/*` - Progress tracking
- `/api/payments/*` - Payment processing
- `/api/startups/*` - Startup connect
- `/api/certificates/*` - Certificate generation

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and Secret to `.env`

### Razorpay Setup
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from dashboard
3. Add keys to `.env` file

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create database named `careercycle`
3. Update connection string in `.env`

## 🎯 Key Features Implementation

### Video Progress Tracking
- Real-time progress updates
- Resume from last watched position
- Completion percentage calculation
- Watch history tracking

### Certificate Generation
- PDF certificate creation
- 30% completion requirement
- Unique UUID generation
- Professional certificate design

### Payment Integration
- Razorpay payment gateway
- Secure payment verification
- Payment history tracking
- Course access management

### Startup Connect
- Partner startup listings
- Job and internship postings
- Application management system
- Company profile management

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Build for Production

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- JWT token authentication
- Password validation
- CORS configuration
- Input sanitization
- Payment signature verification

## 📊 Database Collections

### Users Collection
- User authentication details
- Profile information
- Payment history
- Google OAuth integration

### Courses Collection
- Course metadata
- Video URLs
- Pricing information
- Category and instructor details

### Progress Collection
- User progress tracking
- Video completion status
- Watch history
- Completion timestamps

### Startups Collection
- Company information
- Job listings
- Application tracking
- Partnership status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables
- Ensure MongoDB connection

### Frontend Deployment
- Build the project: `npm run build`
- Deploy to platforms like Vercel, Netlify, or AWS S3
- Update API endpoints for production

---

**CareerCycle** - Making quality education accessible to everyone! 🎓✨

