# WomenRise Backend - Setup & Usage Guide

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Gmail App Password Setup (for email notifications)

1. Go to [Google Account](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-digit password to `.env` file

### 3. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=3000

# Admin Dashboard Password
ADMIN_PASSWORD=your_secure_password_here

# Email Configuration (for Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
EMAIL_FROM=WomenRise Support <your-email@gmail.com>
```

### 4. Initialize Database

```bash
npm run init-db
```

This will create the SQLite database with all necessary tables.

### 5. Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

Server will start at: `http://localhost:3000`

## 📚 API Endpoints

### Health Check
```
GET /api/health
```

### Submit Complaint
```
POST /api/complaints
Content-Type: application/json

{
  "username": "Full Name",
  "date": "1990-01-01",
  "address": "Complete Address",
  "state": "State Name",
  "district": "District Name",
  "pin": "123456",
  "email": "email@example.com",
  "mob": "9876543210",
  "gender": "Female",
  "religion": "Optional",
  "caste": "Optional",
  "complaint": "Detailed complaint text"
}
```

### Get Recent Complaints (Admin)
```
GET /api/complaints/recent?limit=50&offset=0&status=Pending&state=Maharashtra
Headers:
  X-Admin-Password: your_admin_password
```

### Get Statistics (Admin)
```
GET /api/complaints/stats
Headers:
  X-Admin-Password: your_admin_password
```

### Update Complaint Status (Admin)
```
PATCH /api/complaints/:id/status
Headers:
  X-Admin-Password: your_admin_password
Content-Type: application/json

{
  "status": "Resolved"
}
```

## 🌐 Frontend Integration

### Contact Form
The contact form at `/contact.html` is now configured to submit to the backend API.

### Admin Dashboard
Access the admin dashboard at: `http://localhost:3000/complaints-dashboard.html`

Default password: Set in `.env` file (`ADMIN_PASSWORD`)

## 📁 Project Structure

```
backend/
├── server.js              # Express server with all API routes
├── package.json           # Dependencies and scripts
├── .env                   # Environment configuration (not in git)
├── .env.example          # Example environment file
├── .gitignore            # Git ignore rules
└── database/
    ├── schema.sql        # Database schema
    ├── init-db.js        # Database initialization script
    └── complaints.db     # SQLite database (created after init)
```

## 🔐 Security Notes

1. **Change the default admin password** in `.env` file
2. **Never commit `.env`** file to version control
3. **Use app-specific passwords** for Gmail, not your actual password
4. **Use HTTPS** in production
5. Database file is excluded from git via `.gitignore`

## 🐛 Troubleshooting

### Email not sending
- Verify Gmail app password is correct
- Check if 2FA is enabled on Google account
- Ensure EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASSWORD are set in `.env`

### Database errors
- Run `npm run init-db` to reinitialize database
- Check if `database/` folder exists
- Verify file permissions

### CORS errors
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart the server after changing `.env`

### Port already in use
- Change PORT in `.env` file
- Kill the process using port 3000: `lsof -ti:3000 | xargs kill`

## 📊 Database Schema

### complaints table
- `id` - Auto-incrementing primary key
- `username` - Full name
- `date_of_birth` - Date of birth
- `address` - Complete address
- `state` - State name
- `district` - District name
- `pin` - PIN code
- `email` - Email address
- `mobile` - Mobile number
- `gender` - Gender
- `religion` - Religion (optional)
- `caste` - Caste (optional)
- `complaint` - Complaint details
- `status` - Status (Pending/In Progress/Resolved/Closed)
- `submission_date` - Auto-generated timestamp
- `created_at` - Auto-generated timestamp

## 🎯 Features

- RESTful API with Express.js  
- SQLite database for local storage  
- Email confirmations via Nodemailer  
- Input validation and sanitization  
- Admin authentication  
- CORS support  
- Error handling  
- Statistics dashboard  
- Status management  
- Filtering and pagination  

## 📝 License

This project is part of the WomenRise initiative.
