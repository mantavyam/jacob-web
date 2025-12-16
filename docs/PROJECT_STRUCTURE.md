# Women Education Awareness and Support Portal - Project Structure

## Overview
This project has been reorganized for better clarity, maintainability, and scalability. The new structure follows web development best practices with clear separation of concerns.

## Directory Structure

```
jacob-web/
├── pages/                          # All HTML pages organized by functionality
│   ├── home/
│   │   └── index.html              # Main landing page
│   ├── education/
│   │   ├── education.html          # Educational content and government schemes
│   │   └── education-charts.html   # Educational data visualization (formerly dataviz.html)
│   ├── entrepreneurship/
│   │   └── entrepreneurship.html   # Business opportunities for women (formerly entre.html)
│   ├── protection/
│   │   └── protection.html         # Safety and legal protection info (formerly prot.html)
│   ├── registration/
│   │   ├── complaint-form.html     # Complaint registration form (formerly register.html)
│   │   └── user-registration.html  # User registration form (formerly i1st.html)
│   └── dashboard/
│       └── dashboard.html          # Main data dashboard (formerly visualisation.html)
├── backend/                        # Server-side PHP files
│   ├── database/
│   │   └── database-connection.php # Database connection (formerly dbconnect.php)
│   └── forms/
│       ├── complaint-handler.php   # Complaint form processing (formerly regform.php)
│       ├── user-registration-handler.php # User registration processing (formerly db.php)
│       ├── output.php              # Output page for successful submissions
│       └── formregister.php        # Additional form processing
├── assets/                         # Static resources
│   ├── css/                        # All stylesheets
│   │   ├── aos.css                 # Animation library styles
│   │   ├── bootstrap.min.css       # Bootstrap framework
│   │   ├── custom.css              # Custom project styles
│   │   └── forms.css               # Form-specific styles (formerly style.css)
│   ├── js/                         # JavaScript files
│   │   └── aos.js                  # Animation library
│   ├── images/                     # All image files (formerly assets/img/)
│   │   ├── banner-bk.jpg
│   │   ├── edu.png
│   │   ├── logo.png
│   │   └── ... (all other images)
│   └── fonts/                      # Font files
│       └── font-awesome-4.7.0/     # Font Awesome icons
└── data/                           # Data and datasets
    └── ... (dataset files)
```

## Key Improvements

### 1. **Logical Organization**
- **Pages**: HTML files grouped by functionality (education, entrepreneurship, protection, etc.)
- **Backend**: PHP files separated into database and form handling
- **Assets**: All static resources (CSS, JS, images, fonts) in one place
- **Data**: Datasets and data-related files isolated

### 2. **Clear File Naming**
- Descriptive names that reflect file purpose
- Consistent naming conventions
- Easier to understand file functionality at a glance

### 3. **Updated File References**
- All asset paths updated to work with new structure
- Form actions point to correct backend handlers
- Navigation links updated throughout the site

## Navigation Flow

1. **Home Page** (`pages/home/index.html`)
   - Main entry point with overview of platform
   - Navigation to all major sections

2. **Education Section** (`pages/education/`)
   - Educational content, government schemes
   - Data visualization and charts

3. **Entrepreneurship Section** (`pages/entrepreneurship/`)
   - Business opportunities for women
   - Entrepreneurship resources

4. **Protection Section** (`pages/protection/`)
   - Safety information and legal protection
   - Links to complaint registration

5. **Registration Forms** (`pages/registration/`)
   - User registration
   - Complaint filing system

6. **Dashboard** (`pages/dashboard/`)
   - Data visualization and analytics

## Technical Details

### Asset Loading
All pages now use relative paths to load assets:
- CSS: `../../assets/css/filename.css`
- Images: `../../assets/images/filename.jpg`
- JavaScript: `../../assets/js/filename.js`

### Form Processing
- Forms now point to organized backend handlers
- Database connections use centralized connection file
- Proper separation of database logic and form handling

### Benefits of New Structure
- **Maintainability**: Easier to find and edit specific components
- **Scalability**: Simple to add new sections or pages
- **Collaboration**: Clear structure for team development
- **Performance**: Optimized asset organization
- **SEO-Friendly**: Logical URL structure

## Getting Started

1. Start with the home page: `pages/home/index.html`
2. All assets are automatically loaded from the `assets/` directory
3. Backend functionality accessible through forms
4. Easy navigation between different sections