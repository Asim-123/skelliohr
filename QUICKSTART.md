# Quick Start Guide

Get your HR Management System up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Firebase account
- Git installed

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
cd hr-system
npm install
```

### 2. Create Firebase Project (3 minutes)

1. Visit https://console.firebase.google.com/
2. Click "Add Project" → Name it "HR System"
3. Go to Authentication → Enable Email/Password
4. Go to Project Settings → Copy config values

### 3. Create MongoDB Database (2 minutes)

1. Visit https://cloud.mongodb.com/
2. Create cluster → Click "Connect"
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` and change DB to `hr_skellio`

### 4. Configure Environment (1 minute)

```bash
# Copy example file
cp env.example .env.local

# Edit with your values
# Use your favorite editor (nano, vim, vscode, etc.)
nano .env.local
```

### 5. Create Initial Data (2 minutes)

Connect to MongoDB (using MongoDB Compass or CLI):

```javascript
// Create company
db.companies.insertOne({
  name: "Test Company",
  industry: "Technology",
  size: "11-50",
  address: "123 Test St",
  phone: "+1234567890",
  email: "test@company.com",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Note the company _id
```

Create user in Firebase Console → Authentication → Add User:
- Email: `admin@company.com`
- Password: `Test123456`
- Note the UID

```javascript
// Create HR user in MongoDB
db.hrusers.insertOne({
  firebaseUid: "PASTE_FIREBASE_UID",
  email: "admin@company.com",
  displayName: "Admin",
  role: "hr_admin",
  companyId: ObjectId("PASTE_COMPANY_ID"),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 6. Run the App! (30 seconds)

```bash
npm run dev
```

Visit http://localhost:3001 and login with:
- Email: `admin@company.com`
- Password: `Test123456`

## What's Next?

✅ You're now logged into the HR Dashboard!

**Try these features:**
1. Add a new employee
2. Mark attendance
3. Create a leave request
4. View dashboard statistics

## Deploy to Production

Ready to deploy? Follow these guides:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions

## Need Help?

- Check [README.md](./README.md) for full documentation
- Review [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed steps
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Common Issues

**Can't login?**
- Check Firebase credentials in .env.local
- Verify HR user exists in MongoDB
- Ensure firebaseUid matches Firebase UID

**Database error?**
- Check MongoDB connection string
- Verify database name is `hr_skellio`
- Test connection in MongoDB Compass

**Build error?**
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Try `npm run build` to see detailed errors

---

🎉 Congratulations! Your HR System is running!
