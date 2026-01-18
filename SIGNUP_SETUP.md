# HR System - Signup Feature Setup

## ✅ Features Added

1. **Google Sign-In** - Login with Google account
2. **Email/Password Signup** - Create new HR accounts
3. **Company Selection** - Users select their company during signup
4. **Automatic Role Assignment** - New users get 'hr_staff' role by default

## 🔧 Firebase Configuration Required

### Enable Google Sign-In

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **skelliohr** project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google**
5. Click **Enable**
6. Add your support email
7. Click **Save**

### Add Authorized Domains

Still in Authentication settings:
1. Go to **Settings** tab
2. Scroll to **Authorized domains**
3. Add these domains:
   - `localhost` (already there)
   - `hr.skellio.com` (for production)
   - Your Vercel preview domain (e.g., `skellio-hr-*.vercel.app`)

## 📝 Setup Steps

### 1. Create a Company First

Before users can sign up, you need at least one company in the database.

Connect to MongoDB and run:

```javascript
use skelliohr

db.companies.insertOne({
  name: "Your Company Name",
  industry: "Technology",
  size: "51-200",
  address: "123 Business Street, City, Country",
  phone: "+1234567890",
  email: "info@company.com",
  website: "https://company.com",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Save the company _id for reference
```

### 2. Test the Signup Flow

1. **Start the development server:**
```bash
cd hr-system
npm run dev
```

2. **Visit signup page:**
   - Go to http://localhost:3001/signup

3. **Fill in the form:**
   - Full Name: Your name
   - Email: your@email.com
   - Company: Select from dropdown
   - Password: At least 6 characters
   - Confirm Password: Same as password

4. **Or use Google Sign-In:**
   - Click "Sign up with Google"
   - Select your Google account
   - You'll need to manually add the user to database (see below)

### 3. Manual Setup for Google Sign-In Users

When a user signs in with Google for the first time, you need to create their HR user record:

```javascript
// Get the Firebase UID from Firebase Console → Authentication
// Then create the HR user:

db.hrusers.insertOne({
  firebaseUid: "PASTE_FIREBASE_UID_HERE",
  email: "user@gmail.com",
  displayName: "User Name",
  role: "hr_staff", // or "hr_admin", "hr_manager"
  companyId: ObjectId("PASTE_COMPANY_ID_HERE"),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🎯 User Roles

When users sign up, they get the default role:
- **hr_staff** - Basic access

Admins can change roles in MongoDB:

```javascript
// Promote user to admin
db.hrusers.updateOne(
  { email: "user@company.com" },
  { $set: { role: "hr_admin" } }
)

// Available roles:
// - hr_admin: Full access
// - hr_manager: Manager access
// - hr_staff: Basic access
```

## 🔐 Security Notes

1. **Email Verification**: Consider enabling email verification in Firebase
2. **Password Requirements**: Minimum 6 characters (Firebase default)
3. **Company Validation**: Users can only select existing companies
4. **Default Role**: New users get 'hr_staff' role for security

## 📱 Pages Available

- **Login**: `/login`
  - Email/Password login
  - Google Sign-In
  - Link to signup

- **Signup**: `/signup`
  - Full name
  - Email
  - Company selection
  - Password
  - Google Sign-In option
  - Link to login

- **Dashboard**: `/dashboard`
  - Protected route
  - Redirects to login if not authenticated

## 🧪 Testing

### Test Email/Password Signup

1. Go to http://localhost:3001/signup
2. Fill in all fields
3. Submit form
4. Should redirect to dashboard
5. Check MongoDB to verify user was created

### Test Google Sign-In

1. Go to http://localhost:3001/login
2. Click "Sign in with Google"
3. Select Google account
4. First time: Will fail (user not in database)
5. Add user to database manually
6. Try again - should work

### Test Login

1. Go to http://localhost:3001/login
2. Enter credentials
3. Should redirect to dashboard

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Enable Google Sign-In in Firebase
- [ ] Add production domain to Firebase authorized domains
- [ ] Create at least one company in production database
- [ ] Test signup flow in production
- [ ] Test Google Sign-In in production
- [ ] Set up email verification (optional)
- [ ] Configure password reset (optional)

## 🐛 Troubleshooting

### "Failed to sign in with Google"

**Solution:**
1. Check Firebase Console → Authentication → Sign-in method
2. Ensure Google is enabled
3. Check authorized domains include your domain

### "Invalid company ID"

**Solution:**
1. Ensure companies exist in database
2. Check company dropdown is populated
3. Verify company _id is valid ObjectId

### "User already exists"

**Solution:**
1. User already registered
2. Use login page instead
3. Or delete user from database and try again

### "Passwords do not match"

**Solution:**
1. Ensure password and confirm password are identical
2. Check for extra spaces

## 📚 API Endpoints

### POST /api/auth/register
Create new HR user account

**Request:**
```json
{
  "firebaseUid": "firebase_uid",
  "email": "user@company.com",
  "displayName": "User Name",
  "companyId": "company_object_id"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "email": "user@company.com",
    "displayName": "User Name",
    "role": "hr_staff",
    "companyId": "company_id"
  }
}
```

### POST /api/auth/sync
Sync Firebase user with database (used for login)

### GET /api/companies
Get all companies (used in signup form)

## 🎉 Success!

Your HR system now has:
- ✅ Email/Password signup
- ✅ Google Sign-In
- ✅ Company selection
- ✅ Role-based access
- ✅ Secure authentication

Users can now create accounts and join your HR system!
