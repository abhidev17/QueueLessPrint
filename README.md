# QueueLess Print

A full-stack print job management system with role-based access (students & admins), real-time updates via Socket.IO, and seamless file upload.

## 🚀 Live Demo

- **Frontend**: https://queue-less-print-plwk.vercel.app
- **Backend**: https://queuelessprint-backend.onrender.com

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@print.com` | `admin123` |
| Student | `student@print.com` | `student123` |

## Features

✨ **Core Features:**
- 👤 User authentication (JWT + bcryptjs)
- 📄 File upload with multer support
- 🔄 Real-time updates (Socket.IO)
- 👥 Role-based access (Admin & Student)
- 📊 Print job management
- 🎨 Modern UI with Tailwind CSS
- 🔔 Toast notifications

## Tech Stack

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose (Cloud: Atlas)
- **Socket.IO** - Real-time updates
- **JWT** + bcryptjs - Authentication
- **Multer** - File uploads
- **Deployed on**: Render

### Frontend
- **React 18** + Vite
- **Tailwind CSS** - Styling
- **Axios** - API calls
- **Socket.IO Client** - Real-time events
- **React Toastify** - Notifications
- **Deployed on**: Vercel

## Repository Structure

```text
QueueLessPrint/
  backend/
    config/
      multerConfig.js
    controllers/
      printController.js
      userController.js
    middleware/
      authMiddleware.js
    models/
      PrintJob.js
      User.js
    routes/
      printRoutes.js
      userRoutes.js
    uploads/
    server.js
    package.json
  frontend/
    src/
      api.js
      socket.js
      components/
      pages/
      App.jsx
      main.jsx
    package.json
  .env (backend)
  .env (frontend)
  README.md
  SETUP_GUIDE.md
```

### 1) Prerequisites

- Node.js 16+
- npm
- MongoDB running locally (or a cloud MongoDB URI)

### 2) Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3) Configure Environment Variables

#### backend/.env

```env
JWT_SECRET=change_this_in_production
MONGODB_URI=mongodb://127.0.0.1:27017/queuelessprint
PORT=5000
NODE_ENV=development
```

#### frontend/.env

```env
VITE_API_URL=http://localhost:5000
```

For production frontend builds, set:

```env
VITE_API_URL=https://queuelessprint-backend.onrender.com
```

### 4) Run the App

Terminal 1 (backend):

```bash
cd backend
npm start
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Default local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Demo Accounts

These accounts are auto-created by the backend if they do not exist:

- Admin
  - Email: admin@print.com
  - Password: admin123
- Student
  - Email: student@print.com
  - Password: student123

## API Base and Endpoints

Frontend API client builds requests as:

- ${VITE_API_URL}/api

Common endpoints:

### Users
- POST /api/users/register
- POST /api/users/login

### Print
- POST /api/print/create (auth, multipart upload)
- GET /api/print/all (auth, admin)
- GET /api/print/user-jobs (auth)
- PUT /api/print/status/:id (auth)
- GET /api/print/slots

## Deployment Notes

### Backend (Render)

- Deploy from GitHub main branch.
- Set backend env vars in Render dashboard.
- Render auto-redeploys on push.

### Frontend (Vercel)

- Set VITE_API_URL in Vercel project environment variables.
- Redeploy after env var changes.

## CORS Configuration

Backend CORS is configured with a whitelist of allowed origins:

```js
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://queue-less-print-plwk.vercel.app"
  ],
  credentials: true
}));
```

## Demo Flow (Testing Guide)

### Step 1: Clean Test
Open the app in **Incognito Mode**: https://queue-less-print-plwk.vercel.app

### Step 2: Register or Login
Use demo credentials:
- **Admin**: admin@print.com / admin123
- **Student**: student@print.com / student123

Or create a new student account.

### Step 3: Submit a Print Job (Student)
1. Click "Submit Print Job"
2. Upload a PDF/document
3. Select preferences (copies, size, color, date, slot)
4. Click "Submit"
5. See real-time update in dashboard

### Step 4: Verify in MongoDB Atlas
- Go to MongoDB Atlas → cluster0 → queuelessprint collection
- Confirm new PrintJob document created
- Check user email matches

### Step 5: Admin Dashboard
1. Login as admin
2. View all print jobs
3. Update job status (Pending → Printing → Completed)
4. See real-time updates to students' dashboards

### Step 6: Real-Time Updates
- Socket.IO emits "new-print-job" when student submits
- Admins receive notification instantly
- Students see status changes in real-time

## Scripts

### backend/package.json
- npm start -> start server
- npm run dev -> run with nodemon

### frontend/package.json
- npm run dev -> start Vite dev server
- npm run build -> production build
- npm run preview -> preview production build
- npm run lint -> run ESLint

## Additional Docs -----

- SETUP_GUIDE.md
- IMPROVEMENTS.md
