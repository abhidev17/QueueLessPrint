# 🖨️ QueueLess Print - Advanced Print Management System

![QueueLess Print](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v16%2B-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Welcome!

QueueLess Print is a modern, full-stack print management system designed to streamline the printing process with an intuitive interface, secure authentication, and real-time job tracking.

---

## ✨ Key Features

- **Secure Authentication** 🔐 - JWT-based login/registration with password hashing
- **Modern UI/UX** 🎨 - Beautiful design built with Tailwind CSS
- **Responsive Design** 📱 - Works perfectly on desktop, tablet, and mobile
- **Real-time Slot Management** ⏱️ - View and manage print slot availability
- **Admin Dashboard** 📊 - Comprehensive dashboard for print job management
- **Job Tracking** 📋 - Track print job status from submission to completion
- **Toast Notifications** 🔔 - Real-time notifications for user actions
- **File Upload** 📁 - Drag & drop file upload with validation

---

## 🎯 Quick Start

### Option 1: Automatic Setup (Recommended for Windows)
```bash
# Run the setup script
setup.bat
```

### Option 2: Automatic Setup (For Mac/Linux)
```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

### Option 3: Manual Setup
```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd frontend
npm install
```

---

## 📋 Prerequisites

- Node.js v16 or higher
- MongoDB running on localhost:27017
- npm or yarn

---

## 🔧 Configuration

1. **Backend Environment Variables**
   - Create `backend/.env` file (or use setup script)
   - Update `JWT_SECRET` with a strong random string
   - Configure `MONGODB_URI` if needed

   ```env
   JWT_SECRET=your_super_secret_key_here
   MONGODB_URI=mongodb://127.0.0.1:27017/queuelessprint
   PORT=5000
   NODE_ENV=development
   ```

2. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

---

## 🚀 Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Demo Credentials

```
Email: demo@student.com
Password: password123
```

Or create a new account using the registration page.

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions and troubleshooting
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Complete list of improvements and features

---

## 🏗️ Project Structure

```
QueueLessPrint/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/      # Business logic
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files
│   ├── .env             # Environment variables
│   └── server.js        # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── api.js       # API client
│   │   ├── App.jsx      # Main app component
│   │   └── index.css    # Styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── SETUP_GUIDE.md       # Setup documentation
├── IMPROVEMENTS.md      # Improvements overview
├── setup.sh            # Setup script (Mac/Linux)
├── setup.bat           # Setup script (Windows)
└── README.md           # This file
```

---

## 🎨 Tech Stack

### Backend
- ⚙️ Express.js - Web framework
- 🗄️ MongoDB - NoSQL database
- 🔐 JWT - Authentication
- 🔒 Bcrypt - Password hashing
- 📁 Multer - File uploads
- 🌍 CORS - Cross-origin support

### Frontend
- ⚛️ React 19 - UI library
- 🎨 Tailwind CSS - Styling
- 📦 Vite - Build tool
- 🔗 Axios - HTTP client
- 🎯 Lucide React - Icons
- 🔔 React Toastify - Notifications

---

## 📱 Screenshots Overview

### Login & Registration
- Beautiful card-based design
- Tab switching between login/register
- Form validation
- Demo credentials display

### Print Submission
- Drag & drop file upload
- Date/time slot selection
- Customizable print preferences
- Real-time slot availability

### Job Tracking
- Grid view of all jobs
- Status indicators
- Detailed job information
- Responsive card layout

### Admin Dashboard
- Statistics overview
- Status filter tabs
- Desktop table view
- Mobile card view
- Quick action buttons

---

## 🔐 Security Features

- ✅ JWT-based authentication with expiration
- ✅ Bcrypt password hashing
- ✅ Protected API routes with middleware
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Secure token storage
- ✅ Auto-logout on token expiration

---

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Print Jobs
- `POST /api/print/create` - Submit print job
- `GET /api/print/all` - Get all jobs (admin)
- `GET /api/print/user-jobs` - Get user's jobs
- `PUT /api/print/status/:id` - Update job status
- `GET /api/print/slots` - Get available slots

---

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, etc.)
1. Push to git repository
2. Configure environment variables
3. Update MONGODB_URI for production database
4. Set NODE_ENV=production
5. Deploy using platform-specific instructions

### Frontend Deployment (Vercel, Netlify, etc.)
1. Run `npm run build`
2. Deploy the `dist` folder
3. Configure API base URL for production

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
Change the port in `backend/.env`:
```env
PORT=3001
```

### CORS Errors
Ensure frontend URL matches CORS configuration in `backend/server.js`

### JWT Errors
Clear browser storage and log in again:
```javascript
localStorage.removeItem("token");
localStorage.removeItem("user");
```

---

## 📝 Environment Variables Reference

```env
# Backend (.env)
JWT_SECRET=your_secret_key_here
MONGODB_URI=mongodb://127.0.0.1:27017/queuelessprint
PORT=5000
NODE_ENV=development
```

---

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs/)
- [JWT Basics](https://jwt.io/introduction)

---

## 💡 Tips & Best Practices

1. **Security**: Always use strong JWT_SECRET in production
2. **Database**: Set up MongoDB backups before production
3. **Performance**: Use MongoDB indexes for frequently queried fields
4. **Monitoring**: Set up error logging and monitoring
5. **Scaling**: Consider load balancing for high traffic

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 Success!

You're all set! 🚀

```
1. Start MongoDB
2. Run: npm start (backend)
3. Run: npm run dev (frontend in another terminal)
4. Open: http://localhost:5173
5. Login with demo credentials or create an account
```

**Enjoy using QueueLess Print!** 🖨️

---

## 📞 Support & Questions

For detailed setup help and troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

For a complete list of improvements, see [IMPROVEMENTS.md](./IMPROVEMENTS.md)

---

<div align="center">

Made with ❤️ for better printing management

⭐ If you like this project, please give it a star!

</div>
