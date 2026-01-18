# Skellio HR Management System

A complete HR management system for managing employees, attendance, leaves, and payroll. Deployed as a separate subdomain at **hr.skellio.com**.

## 🚀 Features

- **Employee Management**: Add, edit, and manage employee records
- **Attendance Tracking**: Record and monitor daily attendance
- **Leave Management**: Handle leave requests and approvals
- **Payroll Processing**: Manage salary payments and payroll records
- **Dashboard Analytics**: View key HR metrics and statistics
- **Role-Based Access**: Admin, Manager, and Staff roles
- **Separate Authentication**: Independent Firebase authentication system
- **Isolated Database**: Separate MongoDB database for HR data

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Firebase account (separate project for HR)
- Vercel account (for deployment)

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your credentials.

3. **Run development server**:
```bash
npm run dev
```

The app will run on http://localhost:3001

## 🔧 Configuration

### MongoDB Setup

1. Create a MongoDB Atlas cluster (or use local MongoDB)
2. Create a new database named `hr_skellio`
3. Get your connection string
4. Add to `.env.local` as `MONGODB_HR_URI`

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a **NEW** Firebase project (separate from main Skellio app)
3. Enable **Email/Password** authentication
4. Get your Firebase config
5. Add all Firebase credentials to `.env.local`

### Initial Setup

Before using the system, you need to create:

1. **Company Record**: Create a company in MongoDB
2. **HR User**: Create an HR user with Firebase UID and company reference

Example MongoDB commands:

```javascript
// Create a company
db.companies.insertOne({
  name: "Your Company Name",
  industry: "Technology",
  size: "51-200",
  address: "123 Main St",
  phone: "+1234567890",
  email: "hr@company.com",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create HR user (after creating Firebase user)
db.hrusers.insertOne({
  firebaseUid: "firebase_uid_here",
  email: "hr@company.com",
  displayName: "HR Manager",
  role: "hr_admin",
  companyId: ObjectId("company_id_here"),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 📦 Deployment

### Vercel Deployment

1. **Push to GitHub**:
```bash
git add .
git commit -m "HR System setup"
git push
```

2. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your repository
   - Set root directory to `hr-system`
   - Add all environment variables
   - Deploy

3. **Add Custom Domain**:
   - In Vercel project settings, go to Domains
   - Add `hr.skellio.com`
   - Update DNS records as instructed

4. **DNS Configuration**:
   - Add CNAME record: `hr` → `cname.vercel-dns.com`

## 🔐 Security

- Separate Firebase authentication from main app
- Isolated MongoDB database
- Role-based access control
- Secure API routes with authentication checks
- Environment variables for sensitive data

## 📁 Project Structure

```
hr-system/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   ├── employees/        # Employee management
│   ├── attendance/       # Attendance tracking
│   ├── leaves/           # Leave management
│   └── payroll/          # Payroll processing
├── components/           # React components
├── contexts/             # React contexts (Auth)
├── lib/                  # Database & Firebase config
├── models/               # Mongoose models
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## 🎯 Usage

### Creating HR Users

1. Create user in Firebase Authentication (Email/Password)
2. Add user record in MongoDB `hrusers` collection
3. Link to company using `companyId`
4. Assign role: `hr_admin`, `hr_manager`, or `hr_staff`

### Managing Employees

1. Navigate to Dashboard
2. Click "Add New Employee"
3. Fill in employee details
4. Submit to create employee record

### Tracking Attendance

1. Go to Attendance page
2. Select date and employee
3. Mark check-in/check-out times
4. Set status (present/absent/late/half_day)

### Processing Payroll

1. Navigate to Payroll section
2. Generate payroll for selected month
3. Review and approve
4. Mark as paid when processed

## 🔄 API Endpoints

- `POST /api/auth/sync` - Sync Firebase user with HR database
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Create payroll record
- `GET /api/dashboard` - Get dashboard statistics

## 🤝 Contributing

This is part of the Skellio platform. For contributions, please follow the main project guidelines.

## 📄 License

Same license as main Skellio project.

## 🆘 Support

For issues or questions:
- Check the main Skellio documentation
- Contact the development team
- Review Firebase and MongoDB documentation

## 🔗 Related

- Main Skellio App: https://skellio.com
- HR System: https://hr.skellio.com

---

Built with ❤️ using Next.js, MongoDB, and Firebase
