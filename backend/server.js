require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const dbPath = path.join(__dirname, process.env.DB_PATH || './database/complaints.db');
let db;

try {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Failed to connect to database:', err);
            process.exit(1);
        }
        console.log('✓ Connected to SQLite database');
    });
} catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
}

// Email transporter setup
let emailTransporter;
try {
    emailTransporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    console.log('✓ Email transporter configured');
} catch (error) {
    console.warn('⚠ Email configuration incomplete. Email notifications disabled.');
}

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Validation middleware for complaint submission
const validateComplaint = [
    body('username').trim().notEmpty().withMessage('Full name is required'),
    body('date').isDate().withMessage('Valid date of birth is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('district').trim().notEmpty().withMessage('District is required'),
    body('pin').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Valid 6-digit PIN code is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('mob').trim().isLength({ min: 10, max: 10 }).isNumeric().withMessage('Valid 10-digit mobile number is required'),
    body('gender').trim().notEmpty().withMessage('Gender is required'),
    body('complaint').trim().notEmpty().withMessage('Complaint details are required')
];

// Helper function to send email confirmation
async function sendEmailConfirmation(complaintData) {
    if (!emailTransporter || !process.env.EMAIL_USER) {
        console.log('Email notifications disabled - skipping');
        return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: complaintData.email,
        subject: 'Complaint Received - WomenRise',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff69b4;">WomenRise - Complaint Confirmation</h2>
                <p>Dear ${complaintData.username},</p>
                <p>Thank you for reaching out to us. We have successfully received your complaint.</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Complaint Details:</h3>
                    <p><strong>Submission Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
                    <p><strong>Reference ID:</strong> Will be provided shortly</p>
                    <p><strong>Status:</strong> Pending Review</p>
                </div>
                
                <p>Our team will review your complaint and get back to you within 2-3 business days.</p>
                
                <div style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Emergency Support:</strong> If you need immediate assistance, please call our helpline at <strong>14490</strong></p>
                </div>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This is an automated confirmation email. Please do not reply to this email.<br>
                    For any queries, contact us at himanijacob@gmail.com
                </p>
                
                <p style="margin-top: 30px;">
                    Regards,<br>
                    <strong>WomenRise Team</strong><br>
                    <em>Sabka Saath Sabka Vikaas</em>
                </p>
            </div>
        `
    };

    try {
        await emailTransporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, message: error.message };
    }
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: db ? 'Connected' : 'Disconnected',
        email: emailTransporter ? 'Configured' : 'Not Configured'
    });
});

// Submit complaint endpoint
app.post('/api/complaints', validateComplaint, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }

    const {
        username, date, address, state, district, pin,
        email, mob, gender, religion, caste, complaint
    } = req.body;

    try {
        // Insert into database
        const sql = `
            INSERT INTO complaints (
                username, date_of_birth, address, state, district, pin,
                email, mobile, gender, religion, caste, complaint
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(sql, [
            username, date, address, state, district, pin,
            email, mob, gender, religion || null, caste || null, complaint
        ], async function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to submit complaint. Please try again.'
                });
            }

            // Send email confirmation
            const emailResult = await sendEmailConfirmation({ username, email });

            res.status(201).json({
                success: true,
                message: 'Complaint submitted successfully',
                complaintId: this.lastID,
                emailSent: emailResult.success
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit complaint. Please try again.'
        });
    }
});

// Get recent complaints (for admin dashboard)
app.get('/api/complaints/recent', (req, res) => {
    const password = req.headers['x-admin-password'];
    
    // Basic password authentication
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }

    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const status = req.query.status;
        const state = req.query.state;

        let query = 'SELECT * FROM complaints WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (state) {
            query += ' AND state = ?';
            params.push(state);
        }

        query += ' ORDER BY submission_date DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        db.all(query, params, (err, complaints) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch complaints'
                });
            }

            // Get total count
            let countQuery = 'SELECT COUNT(*) as total FROM complaints WHERE 1=1';
            const countParams = [];
            
            if (status) {
                countQuery += ' AND status = ?';
                countParams.push(status);
            }
            if (state) {
                countQuery += ' AND state = ?';
                countParams.push(state);
            }

            db.get(countQuery, countParams, (err, row) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to fetch complaints'
                    });
                }

                const total = row.total;

                res.json({
                    success: true,
                    complaints,
                    pagination: {
                        total,
                        limit,
                        offset,
                        hasMore: offset + complaints.length < total
                    }
                });
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch complaints'
        });
    }
});

// Get complaint statistics (for admin dashboard)
app.get('/api/complaints/stats', (req, res) => {
    const password = req.headers['x-admin-password'];
    
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }

    try {
        const stats = {};
        
        // Get total count
        db.get('SELECT COUNT(*) as count FROM complaints', [], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch statistics'
                });
            }
            stats.total = row.count;
            
            // Get pending count
            db.get("SELECT COUNT(*) as count FROM complaints WHERE status = 'Pending'", [], (err, row) => {
                if (err) return res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
                stats.pending = row.count;
                
                // Get resolved count
                db.get("SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'", [], (err, row) => {
                    if (err) return res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
                    stats.resolved = row.count;
                    
                    // Get by state
                    db.all('SELECT state, COUNT(*) as count FROM complaints GROUP BY state ORDER BY count DESC', [], (err, rows) => {
                        if (err) return res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
                        stats.byState = rows;
                        
                        // Get recent 24h
                        db.get("SELECT COUNT(*) as count FROM complaints WHERE submission_date > datetime('now', '-1 day')", [], (err, row) => {
                            if (err) return res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
                            stats.recent24h = row.count;
                            
                            res.json({
                                success: true,
                                stats
                            });
                        });
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// Update complaint status (for admin dashboard)
app.patch('/api/complaints/:id/status', (req, res) => {
    const password = req.headers['x-admin-password'];
    
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status value'
        });
    }

    try {
        db.run('UPDATE complaints SET status = ? WHERE id = ?', [status, id], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update status'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Complaint not found'
                });
            }

            res.json({
                success: true,
                message: 'Status updated successfully'
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 WomenRise Backend Server Running`);
    console.log(`${'='.repeat(50)}`);
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`📝 API Base: http://localhost:${PORT}/api`);
    console.log(`${'='.repeat(50)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});
