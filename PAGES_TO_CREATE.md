# HR System - Pages Implementation Guide

## ✅ Completed Pages

### 1. Dashboard (`/dashboard`) ✅
- Statistics cards
- Quick actions
- Recent activity
- Collapsible sidebar

### 2. Login (`/login`) ✅
- Email/Password login
- Google Sign-In
- Error handling

### 3. Signup (`/signup`) ✅
- Company creation
- User registration
- Google Sign-In

### 4. Employees List (`/employees`) ✅
- Employee table with search
- Status filters
- Add/Edit/Delete actions
- Statistics cards

## 🚧 Pages to Create

### 5. Add Employee (`/employees/new`)
**Features:**
- Form with fields:
  - Employee ID (auto-generate option)
  - First Name, Last Name
  - Email, Phone
  - Department, Position
  - Date of Joining, Date of Birth
  - Address
  - Salary
  - Emergency Contact (name, relationship, phone)
- File upload for documents
- Submit button
- Cancel button

**API:** POST `/api/employees`

### 6. View Employee (`/employees/[id]`)
**Features:**
- Employee details display
- Personal information
- Employment details
- Documents list
- Attendance summary
- Leave history
- Edit button
- Back button

**API:** GET `/api/employees/[id]`

### 7. Edit Employee (`/employees/[id]/edit`)
**Features:**
- Pre-filled form with employee data
- All fields editable
- Save changes button
- Cancel button

**API:** PUT `/api/employees/[id]`

### 8. Attendance (`/attendance`)
**Features:**
- Calendar view of current month
- Mark attendance form:
  - Select employee
  - Select date
  - Check-in time
  - Check-out time
  - Status (present/absent/late/half_day)
  - Notes
- Today's attendance list
- Attendance statistics
- Export to CSV

**API:** 
- GET `/api/attendance`
- POST `/api/attendance`

### 9. Leave Management (`/leaves`)
**Features:**
- Tabs: Pending, Approved, Rejected, All
- Leave request cards showing:
  - Employee name
  - Leave type
  - Start date - End date
  - Days count
  - Reason
  - Status
- Actions: Approve, Reject (for pending)
- Add leave request button
- Filter by employee, date range

**API:**
- GET `/api/leaves`
- POST `/api/leaves`
- PUT `/api/leaves/[id]/approve`
- PUT `/api/leaves/[id]/reject`

### 10. Payroll (`/payroll`)
**Features:**
- Monthly payroll table
- Select month/year
- Employee list with:
  - Employee name
  - Base salary
  - Allowances
  - Deductions
  - Bonus
  - Total salary
  - Status (pending/paid)
- Generate payroll button
- Mark as paid button
- Export payslips
- Payment history

**API:**
- GET `/api/payroll`
- POST `/api/payroll`
- PUT `/api/payroll/[id]`

### 11. Recruitment (`/recruitment`)
**Features:**
- Job postings list
- Add job posting form:
  - Job title
  - Department
  - Position type (full-time/part-time/contract)
  - Salary range
  - Description
  - Requirements
  - Status (open/closed)
- Applicants list per job
- Application status tracking
- Interview scheduling

**API:**
- GET `/api/recruitment/jobs`
- POST `/api/recruitment/jobs`
- GET `/api/recruitment/applicants`
- POST `/api/recruitment/applicants`

### 12. Performance (`/performance`)
**Features:**
- Performance review list
- Create review form:
  - Select employee
  - Review period
  - Rating (1-5)
  - Goals achieved
  - Areas of improvement
  - Comments
- Review history
- Performance metrics dashboard
- Export reports

**API:**
- GET `/api/performance`
- POST `/api/performance`

### 13. Company (`/companies`)
**Features:**
- Company profile display
- Edit company information:
  - Company name
  - Industry
  - Size
  - Address
  - Phone
  - Email
  - Website
  - Logo upload
- Department management
- Office locations

**API:**
- GET `/api/companies/[id]`
- PUT `/api/companies/[id]`

### 14. Settings (`/settings`)
**Features:**
- Tabs: Profile, Security, Notifications, System
- **Profile Tab:**
  - User name
  - Email
  - Role
  - Avatar upload
- **Security Tab:**
  - Change password
  - Two-factor authentication
  - Active sessions
- **Notifications Tab:**
  - Email notifications toggle
  - Leave request notifications
  - Attendance notifications
- **System Tab:**
  - Date format
  - Time format
  - Currency
  - Language

**API:**
- GET `/api/settings`
- PUT `/api/settings`

## 📊 Additional API Endpoints Needed

### Employee APIs
```typescript
GET    /api/employees              // List all
GET    /api/employees/[id]         // Get one
POST   /api/employees              // Create
PUT    /api/employees/[id]         // Update
DELETE /api/employees/[id]         // Delete
```

### Attendance APIs
```typescript
GET    /api/attendance             // List with filters
POST   /api/attendance             // Mark attendance
PUT    /api/attendance/[id]        // Update
GET    /api/attendance/stats       // Statistics
```

### Leave APIs
```typescript
GET    /api/leaves                 // List with filters
POST   /api/leaves                 // Create request
PUT    /api/leaves/[id]/approve    // Approve
PUT    /api/leaves/[id]/reject     // Reject
```

### Payroll APIs
```typescript
GET    /api/payroll                // List with filters
POST   /api/payroll                // Generate
PUT    /api/payroll/[id]           // Update status
POST   /api/payroll/generate       // Auto-generate for month
```

### Recruitment APIs
```typescript
GET    /api/recruitment/jobs       // List jobs
POST   /api/recruitment/jobs       // Create job
PUT    /api/recruitment/jobs/[id]  // Update job
GET    /api/recruitment/applicants // List applicants
POST   /api/recruitment/applicants // Add applicant
```

### Performance APIs
```typescript
GET    /api/performance            // List reviews
POST   /api/performance            // Create review
PUT    /api/performance/[id]       // Update review
```

## 🎨 Design Guidelines

All pages should follow:
- **Green theme** (#22c55e) matching main Skellio
- **Responsive design** (mobile, tablet, desktop)
- **Loading states** for async operations
- **Error handling** with user-friendly messages
- **Success notifications** after actions
- **Confirmation dialogs** for destructive actions
- **Form validation** with clear error messages
- **Empty states** with helpful CTAs
- **Consistent spacing** and typography
- **Accessible** (ARIA labels, keyboard navigation)

## 🔐 Security Considerations

- All pages check authentication
- Role-based access control
- CSRF protection
- Input sanitization
- SQL injection prevention
- XSS prevention

## 📱 Mobile Responsiveness

- Hamburger menu for navigation
- Stacked layouts on mobile
- Touch-friendly buttons (min 44px)
- Horizontal scrolling for tables
- Bottom navigation for key actions

## 🚀 Next Steps

1. Create remaining page files
2. Implement API routes
3. Add form validation
4. Add loading states
5. Add error handling
6. Test all functionality
7. Add unit tests
8. Deploy to production

---

**Note:** This is a comprehensive guide. Start with the most critical pages (Employees, Attendance, Leaves) and build from there.
