# Northman Gaming Corporation Website

![Northman Gaming Corporation](assets/images/main_logo.jpg)

A comprehensive corporate website and employee management system for Northman Gaming Corporation, a PCSO-authorized gaming services provider in Davao del Norte, Philippines.

## 🌟 Features

### 🏢 Corporate Website
- **Professional Landing Page** with company information
- **PCSO Compliance** information and licensing details
- **Service Offerings** (STL Retail Solutions, Distribution & Logistics, Community Support)
- **Contact Information** and business hours
- **SEO Optimized** with structured data and meta tags

### 👥 Employee Management System
- **Role-based Authentication** (Employee, IT Manager, Admin Head)
- **Interactive Dashboards** for different user roles
- **Request Management System** for various business processes
- **Real-time Data Synchronization** with Firebase Firestore

### 📋 Business Process Forms
- **IT Service Orders** - Hardware/software requests and technical support
- **Travel Orders** - Business travel and transportation requests
- **Driver Trip Tickets** - Departure/arrival approvals and route documentation

### 🔧 Technical Features
- **Progressive Web App** capabilities
- **Offline Support** with local data caching
- **Backup & Recovery System** for data protection
- **Performance Monitoring** and error tracking
- **Accessibility Compliant** (WCAG AA standards)
- **Mobile Responsive** design

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for Firebase services
- Local web server (optional, for development)

### Installation

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Access** the application at your local server or file path

### For Development
```bash
# If using a local server (recommended)
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server

# Then open http://localhost:8000
```

## 📁 Project Structure

```
NorthmanWebsite/
├── index.html                 # Main entry point
├── README.md                  # Project documentation
├── API_DOCUMENTATION.md       # Comprehensive API docs
├── tailwind.config.js        # Tailwind CSS configuration
│
├── assets/
│   ├── css/
│   │   ├── style.css         # Main stylesheet with enhancements
│   │   └── it_dashboardStyle.css
│   ├── js/
│   │   ├── index.js          # Main application logic
│   │   ├── loading_modal.js  # Loading states
│   │   ├── request_modal.js  # Request management
│   │   └── 404page.js        # Error handling
│   ├── images/
│   │   └── main_logo.jpg     # Company logo
│   └── forms/                # Form modules
│       ├── it_service_order_form_modal.js
│       ├── travel_order_form_modal.js
│       ├── drivers_trip_ticket_form_*.js
│       └── admin/            # Admin-specific forms
│
├── pages/
│   ├── login.js              # Authentication
│   ├── signin.js             # User registration
│   ├── dashboard.js          # Main dashboard
│   ├── forgetpassword.js     # Password recovery
│   └── admin/                # Admin dashboards
│       ├── admin_dashboard.js
│       └── it_dashboard.js
│
└── database/
    ├── databaseConnect.js    # Enhanced Firebase integration
    └── telegramConnect.js    # Telegram notifications
```

## 🔐 Authentication & User Roles

### User Roles
- **Employee**: Basic dashboard access, request submission
- **IT Manager**: IT service management, technical oversight
- **Admin Head**: Full system administration, user management

### Test Credentials
```
Username: testuser
Password: testpass
```

## 🛠️ Configuration

### Firebase Setup
The application is pre-configured with Firebase. For your own deployment:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Update the configuration in `database/databaseConnect.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

### Telegram Integration
Update `database/telegramConnect.js` with your bot credentials for notifications.

## 📊 Database Collections

### Core Collections
- **`users`** - User accounts and authentication data
- **`employees`** - Employee information and profiles
- **`itServiceOrders`** - IT service requests and tickets
- **`travelOrders`** - Travel requests and approvals
- **`tripTickets`** - Driver trip documentation

### Data Structure Example
```javascript
// Employee Document
{
  id: "emp001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@northmangaming.com",
  department: "IT",
  role: "Developer",
  dateHired: "2024-01-15",
  status: "active"
}
```

## 🎨 Customization

### Styling
- **CSS Variables** in `assets/css/style.css` for easy theme customization
- **Responsive Design** with mobile-first approach
- **Dark Mode Support** with `prefers-color-scheme`
- **High Contrast Mode** for accessibility

### Branding
- Update logo in `assets/images/main_logo.jpg`
- Modify company information in `assets/js/index.js`
- Customize colors using CSS custom properties

## 🔧 API Reference

### Database Functions
```javascript
// Create/Update document
await setDoc('collection', 'docId', data);

// Get single document
const doc = await getDoc('collection', 'docId');

// Get collection with sorting
const docs = await getCollection('collection', 'sortField', true);

// Update document
await updateDoc('collection', 'docId', updateData);

// Delete document
await deleteDoc('collection', 'docId');
```

### Backup & Recovery
```javascript
// Create backup
const backup = await backupData(['users', 'employees']);

// Restore from backup
await restoreData(backup.backupKey);

// Get system status
const status = getDatabaseStatus();
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

## 🚀 Performance Features

### Optimization Techniques
- **Resource Preloading** for critical assets
- **Image Lazy Loading** for better performance
- **Local Caching** with 5-minute TTL
- **Offline Support** with localStorage fallback
- **Performance Monitoring** with Web APIs

### Performance Metrics
- Page Load Time tracking
- Database operation monitoring
- Error rate tracking
- User interaction analytics

## ♿ Accessibility Features

### WCAG AA Compliance
- **Color Contrast** ratios meet accessibility standards
- **Keyboard Navigation** for all interactive elements
- **Screen Reader Support** with semantic HTML and ARIA labels
- **Focus Management** with visible focus indicators
- **Skip Links** for main content navigation

### Responsive Design
- **Mobile-First** approach
- **Touch-Friendly** buttons (44px minimum)
- **Flexible Layouts** for all screen sizes
- **Print Styles** for document printing

## 🔒 Security Features

### Data Protection
- **Input Validation** and sanitization
- **XSS Protection** through proper encoding
- **Secure Session Management**
- **Role-Based Access Control**

### Firebase Security
- **Authentication Required** for database access
- **Firestore Security Rules** enforcement
- **Encrypted Data Transmission**

## 🐛 Troubleshooting

### Common Issues

#### Connection Problems
- Check internet connectivity
- Verify Firebase configuration
- Review browser console for errors

#### Authentication Issues
- Clear browser cache and cookies
- Check user credentials
- Verify Firebase Auth configuration

#### Performance Issues
- Clear localStorage cache
- Check network speed
- Review browser developer tools

### Debug Mode
Enable debug logging by opening browser console and running:
```javascript
localStorage.setItem('debug', 'true');
```

## 📈 Monitoring & Analytics

### Built-in Monitoring
- **Error Tracking** with detailed logging
- **Performance Metrics** collection
- **User Interaction** tracking
- **Database Operation** monitoring

### System Status
Check system health with:
```javascript
const status = getDatabaseStatus();
console.log('System Status:', status);
```

## 🔄 Updates & Maintenance

### Regular Maintenance
- Monitor error logs in browser console
- Review performance metrics
- Update dependencies as needed
- Test backup/restore procedures
- Clean up old cached data

### Version Updates
- Check for updates in this repository
- Review changelog for breaking changes
- Test thoroughly before deploying
- Backup data before major updates

## 📞 Support

### Getting Help
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for technical details
- Check browser console for error messages
- Verify Firebase configuration and connectivity
- Test with different browsers and devices

### Reporting Issues
When reporting issues, please include:
- Browser version and operating system
- Steps to reproduce the problem
- Error messages from browser console
- Screenshots if applicable

## 📄 License

This project is proprietary software of Northman Gaming Corporation. All rights reserved.

## 🏢 About Northman Gaming Corporation

Northman Gaming Corporation is a PCSO-authorized agent corporation established in September 2024, providing premier gaming services in Davao del Norte, Philippines. We are committed to quality, innovation, and community growth through sustainable business practices and community engagement initiatives.

### Our Services
- **STL Retail Solutions** - Small Town Lottery operations
- **Distribution & Logistics** - Gaming equipment and supplies
- **Community Support** - Local community development programs
- **Compliance Management** - Regulatory compliance and reporting

### Contact Information
- **Location**: Davao del Norte, Philippines
- **Business Hours**: Monday - Sunday, 24/7 Support Available
- **Compliance**: Fully licensed and regulated by PCSO

---

**Built with ❤️ by the Northman Gaming Corporation Development Team**

*Last Updated: December 2024*
