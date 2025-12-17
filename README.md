# WomenRise - Women Empowerment Portal

A comprehensive web platform for women's empowerment with complaint submission and management system.

## Features

### Frontend
- Responsive website with multiple pages (Home, About, Services, Programs, Contact)
- Comprehensive complaint/contact form with 14 fields
- AJAX form submission with real-time validation
- Success/error feedback to users
- Email confirmation for complaint submissions
- Mobile-friendly design with Bootstrap 5
- "Track Your Complaint Status" section that allows users to check their complaint status by entering:- Reference ID, OR Email address, OR Mobile number

**Features:**
- Search by any one of the three criteria
- Displays complaint details including status, submission date, and location
- Color-coded status badges (Pending, In Progress, Resolved, Closed)
- Shows up to 10 matching complaints

### Backend
- RESTful API with Express.js
- SQLite database for local data storage
- Email notifications via Nodemailer
- Input validation and sanitization
- CORS support for cross-origin requests
- Comprehensive error handling

### Admin Dashboard
- Password-protected admin panel
- View all complaints with filtering (status, state)
- Real-time statistics and analytics
- Update complaint status (Pending, In Progress, Resolved, Closed)
- Pagination for large datasets
- Detailed complaint view modal

## Project Structure

```
jacob-web/
├── index.html                  # Homepage
├── about.html                  # About page
├── contact.html                # Complaint submission form
├── service.html                # Services overview
├── education.html              # Education programs
├── entrepreneurship.html       # Entrepreneurship programs
├── protection.html             # Protection services
├── complaints-dashboard.html   # Admin dashboard
│
├── css/
│   ├── bootstrap.min.css
│   └── style.css              # Custom styles
│
├── js/
│   ├── main.js                # Main JS functionality
│   ├── components.js          # Component loader
│   ├── form-handler.js        # Contact form AJAX handler
│   └── dashboard.js           # Admin dashboard JS
│
├── components/
│   ├── header.html
│   ├── footer.html
│   └── testimonials.html
│
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment configuration
│   ├── .env.example           # Environment template
│   ├── README.md              # Backend documentation
│   └── database/
│       ├── schema.sql         # Database schema
│       ├── init-db.js         # Database initialization
│       └── complaints.db      # SQLite database (created after init)
│
├── lib/                        # Third-party libraries
├── img/                        # Images
└── data/                       # Data files
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### 1. Clone or Download the Project

```bash
git clone https://github.com/mantavyam/jacob-web.git
cd /path/to/jacob-web
```

### 2. Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

#### 2. Gmail App Password Setup (for email notifications)

1. Go to [Google Account](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-digit password to `.env` file

#### 3. Configure Environment

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

#### 4. Initialize Database

```bash
npm run init-db
```

This will create the SQLite database with all necessary tables.

#### 5. Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

Server will start at: `http://localhost:3000`

## Admin Dashboard

1. Start the backend server (see above)
2. Open: `http://localhost:3000/complaints-dashboard.html`
3. Enter the admin password (set in `.env` file)
4. View and manage complaints

### Default Credentials
- Password: Set in `.env` file (`ADMIN_PASSWORD`)
- **Change this before deployment!**

## Usage

### Submitting a Complaint

1. Navigate to the Contact page
2. Fill in all required fields marked with *
3. Click "SUBMIT COMPLAINT"
4. You'll receive:
   - Immediate confirmation on screen
   - Email confirmation (if configured)
   - Reference ID for tracking

### Managing Complaints (Admin)

1. Login to admin dashboard
2. View statistics at the top
3. Filter complaints by status or state
4. Click on any complaint to view full details
5. Update status as needed

## API Endpoints

### Public Endpoints

```
POST /api/complaints
- Submit a new complaint
- Body: Form data (JSON)
- Returns: Complaint ID and confirmation
```

```
GET /api/complaints/check
```

**Query Parameters (at least one required):**
- `refId` - Complaint reference ID
- `email` - Email address
- `mobile` - Mobile number

**Response:**
```json
{
  "success": true,
  "complaints": [
    {
      "id": 1,
      "username": "John Doe",
      "email": "john@example.com",
      "mobile": "1234567890",
      "state": "Maharashtra",
      "complaint": "...",
      "status": "Pending",
      "submission_date": "2025-12-17T06:00:00.000Z"
    }
  ]
}

### Admin Endpoints (Require Password)

```
GET /api/complaints/recent
- Get recent complaints with pagination
- Headers: X-Admin-Password
- Query: limit, offset, status, state

GET /api/complaints/stats
- Get complaint statistics
- Headers: X-Admin-Password

PATCH /api/complaints/:id/status
- Update complaint status
- Headers: X-Admin-Password
- Body: { status: "Pending|In Progress|Resolved|Closed" }
```

## Security Features

- Password-protected admin dashboard
- Input validation and sanitization
- SQL injection prevention
- CORS protection
- Environment variable configuration
- Database file excluded from version control

## Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify Node.js is installed: `node --version`
- Check `.env` file exists and is configured

### Emails not sending
- Verify Gmail app password is correct
- Ensure 2FA is enabled on Google account
- Check EMAIL_* variables in `.env`

### CORS errors
- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart backend server after changing `.env`

### Form submission fails
- Ensure backend is running
- Check browser console for errors
- Verify API_BASE_URL in `form-handler.js`

## Database Schema

### complaints table
- `id` - Primary key
- `username` - Full name
- `date_of_birth` - Date of birth
- `address` - Complete address
- `state` - State name
- `district` - District
- `pin` - PIN code
- `email` - Email address
- `mobile` - Mobile number
- `gender` - Gender
- `religion` - Religion (optional)
- `caste` - Caste (optional)
- `complaint` - Complaint details
- `status` - Current status
- `submission_date` - Timestamp
- `created_at` - Creation timestamp

## License

This project is part of the WomenRise initiative for women empowerment.

## Support

For emergency assistance: **14490** (24/7 Helpline)

Email: himanijacob@gmail.com

---

**Built with ❤️ for Women's Safety and Empowerment**

*Sabka Saath Sabka Vikaas*
