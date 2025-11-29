# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running locally or MongoDB Atlas account
- Cloudinary account (optional, for file uploads)

## Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Frontend (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Server running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
✅ Frontend running on http://localhost:3000

### 4. Create Admin User

1. Register a user at http://localhost:3000/register
2. Open MongoDB and run:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 5. Access Features

- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Admin Dashboard**: http://localhost:3000/admin (admin only)

## Testing the Application

### Test User Flow
1. Register a new account
2. Login with credentials
3. Scroll to Contact section
4. Send a message (requires login)

### Test Admin Flow
1. Login as admin
2. Navigate to /admin
3. View messages in dashboard
4. Mark messages as read
5. Delete messages

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Or update MONGO_URI to use MongoDB Atlas

### CORS Error
- Check that backend CORS origin matches frontend URL
- Default: http://localhost:3000

### Port Already in Use
- Backend: Change PORT in server/.env
- Frontend: React will prompt to use different port

## Next Steps

1. ✅ Application is running
2. 📝 Review the [README.md](file:///c:/Users/Mohit%20Sharma/OneDrive/Desktop/3d-portfolio-website-master/3d-portfolio-website-master/README.md) for full documentation
3. 📖 Check [walkthrough.md](file:///C:/Users/Mohit%20Sharma/.gemini/antigravity/brain/aa4cf966-55fd-4dca-be0e-a3b7374d38cf/walkthrough.md) for detailed testing instructions
4. 🚀 Customize and deploy!

## Key Features Implemented

✅ User Authentication (Register/Login/Logout)  
✅ JWT with Refresh Tokens  
✅ Admin Dashboard  
✅ Message Management  
✅ Protected Contact Form  
✅ Project CRUD API  
✅ File Upload Support  
✅ Role-Based Access Control  

Enjoy your new MERN portfolio! 🎉
