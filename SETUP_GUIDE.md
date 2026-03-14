# QueueLess Print - Advanced Print Management System

## 🚀 Project Overview

QueueLess Print is a modern, full-stack print management system with advanced features including:

### ✨ Key Features
- **User Authentication**: Secure JWT-based login and registration with password hashing
- **Modern UI/UX**: Beautiful design built with Tailwind CSS and Lucide icons
- **Real-time Slot Management**: View and manage print slot availability
- **Admin Dashboard**: Comprehensive dashboard for print job management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Notifications**: Toast notifications for all user actions
- **Job Tracking**: Track print job status from submission to completion
- **Role-based Access**: Different interfaces for students and admin

---

## 📋 Table of Contents
- [Setup Instructions](#setup-instructions)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Tech Stack](#tech-stack)

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (running on localhost:27017)
- npm or yarn

### Quick Start

#### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

#### Step 2: Configure Environment Variables
Create a `.env` file in the backend directory:
```
JWT_SECRET=your_jwt_secret_key_change_in_production
MONGODB_URI=mongodb://127.0.0.1:27017/queuelessprint
PORT=5000
NODE_ENV=development
```

#### Step 3: Start Backend Server
```bash
npm start
# or with nodemon for development
npx nodemon server.js
```

The backend will run on `http://localhost:5000`

#### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### Step 5: Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 💻 Backend Setup

### Project Structure
```
backend/
├── config/
│   └── multerConfig.js        # File upload configuration
├── controllers/
│   ├── printController.js     # Print job logic
│   └── userController.js      # Authentication logic
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── models/
│   ├── PrintJob.js            # Print job schema
│   └── User.js                # User schema
├── routes/
│   ├── printRoutes.js         # Print job routes
│   └── userRoutes.js          # Auth routes
├── uploads/                   # Uploaded files directory
├── .env                       # Environment variables
├── package.json
└── server.js                  # Main server file
```

### New Backend Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt implementation for secure passwords
- **Input Validation**: Comprehensive validation for all endpoints
- **Error Handling**: Proper error responses with meaningful messages
- **User Registration**: New user registration with validation

---

## 🎨 Frontend Setup

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Enhanced navigation bar
│   ├── pages/
│   │   ├── LoginPageNew.jsx    # Modern login/register
│   │   ├── StudentPageNew.jsx  # Print submission form
│   │   ├── StudentJobsNew.jsx  # Job tracking
│   │   └── AdminPageNew.jsx    # Admin dashboard
│   ├── api.js                  # Axios instance with JWT
│   ├── index.css               # Tailwind CSS styles
│   ├── App.jsx                 # Main App component
│   └── main.jsx                # React entry point
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.js
├── package.json
└── index.html
```

### New Frontend Features
- **Tailwind CSS**: Modern utility-first CSS framework
- **Lucide Icons**: Beautiful, consistent icon set
- **React Toastify**: Toast notifications for user feedback
- **JWT Integration**: Automatic token handling in API requests
- **Responsive Design**: Mobile-first responsive layouts
- **Form Validation**: Client-side validation with helpful errors

---

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Print Jobs
- `POST /api/print/create` - Create new print job (requires auth)
- `GET /api/print/all` - Get all print jobs (admin only)
- `GET /api/print/user-jobs` - Get user's print jobs
- `PUT /api/print/status/:id` - Update job status
- `GET /api/print/slots?printDate=YYYY-MM-DD` - Get available slots

---

## 🎯 Features in Detail

### 1. **User Authentication**
- Secure registration with email validation
- Login with JWT token generation
- Password hashing with bcrypt
- Automatic logout on token expiration
- Remember me functionality

### 2. **Print Job Submission**
- File upload with drag-and-drop support
- Date picker for scheduling
- Customizable number of copies
- Page size options (A4, A3, Letter)
- Color/B&W selection
- Time slot availability display
- Real-time slot capacity tracking

### 3. **Job Tracking**
- View all submitted jobs
- Job status visualization
- Job filtering and sorting
- Detailed job information
- Status history

### 4. **Admin Dashboard**
- Overview statistics
- All jobs management
- Status update functionality
- Real-time job list
- Responsive table view (desktop)
- Card view (mobile)
- Job filtering by status

### 5. **UI/UX Enhancements**
- Modern gradient design
- Smooth animations
- Loading states
- Error handling
- Toast notifications
- Responsive layouts
- Dark mode ready

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcrypt
- **File Upload**: Multer
- **CORS**: Express CORS middleware
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **UI Components**: Custom with Tailwind

---

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Bcrypt with salt rounds
3. **Protected Routes**: Authentication middleware on protected endpoints
4. **CORS**: Properly configured for secure cross-origin requests
5. **Input Validation**: Server-side validation for all inputs
6. **Environment Variables**: Sensitive data in .env file
7. **Error Handling**: Safe error messages without exposing internals

---

## 📱 Responsive Design

The application is fully responsive and includes:
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Touch-friendly buttons
- Optimized layouts for all screen sizes

---

## 🚀 Deployment Checklist

Before deploying:
1. [ ] Update `JWT_SECRET` in .env with a strong secret
2. [ ] Configure MongoDB URI for production
3. [ ] Set `NODE_ENV` to production
4. [ ] Update CORS settings for production domains
5. [ ] Set up SSL/HTTPS
6. [ ] Configure file upload directory permissions
7. [ ] Set up backup for MongoDB

---

## 📝 Demo Credentials

For testing purposes:
- **Email**: demo@student.com
- **Password**: password123

---

## 🐛 Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# On Windows (if installed via installer)
net start MongoDB

# On Mac (if installed via Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Port Already in Use
If port 5000 is already in use, change it in the `.env` file:
```
PORT=3001
```

### CORS Error
Make sure the frontend URL matches the CORS configuration in `server.js`.

### JWT Errors
Clear localStorage and log in again:
```javascript
localStorage.removeItem("token");
localStorage.removeItem("user");
```

---

## 📞 Support

For issues or questions, check:
1. Console errors in browser dev tools
2. Backend server logs
3. MongoDB connection status
4. Environment variables configuration

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Congratulations!

You now have a fully functional, modern print management system! Enjoy QueueLess Print! 🖨️
