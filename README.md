# QueueLess Print

QueueLess Print is a full-stack print job management app with role-based access for students and admins, file upload support, and real-time updates.

## Current Deployment

- Frontend (Vercel): https://queue-less-print-plwk.vercel.app
- Backend (Render): https://queuelessprint-backend.onrender.com
- Backend root health message: QueueLessPrint API running at /

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- bcryptjs
- multer
- socket.io

### Frontend
- React 18 + Vite
- Axios
- Tailwind CSS
- react-toastify
- socket.io-client

## Repository Structure

```text
QueueLessPrint/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    server.js
    package.json
  frontend/
    src/
    .env
    package.json
  README.md
  SETUP_GUIDE.md
  IMPROVEMENTS.md
```

## Local Setup

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

## CORS Status

Current backend Express CORS is temporarily configured to allow all origins for troubleshooting:

```js
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

For stricter production security, replace origin: "*" with an allowlist of trusted frontend domains.

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
