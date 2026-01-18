# HR System Setup Guide

Complete step-by-step guide to set up the HR Management System.

## Step 1: Install Dependencies

```bash
cd hr-system
npm install
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "Skellio HR" (or similar)
4. Disable Google Analytics (optional)
5. Create project

### Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Save

### Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click **Web** icon (</>)
4. Register app (name: "HR System")
5. Copy the config values

## Step 3: Create MongoDB Database

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (or use existing)
3. Click **Connect** → **Connect your application**
4. Copy connection string
5. Replace `<password>` with your password
6. Change database name to `hr_skellio`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/hr_skellio
```

### Option B: Local MongoDB

```bash
# Start MongoDB locally
mongod

# Connection string:
mongodb://localhost:27017/hr_skellio
```

## Step 4: Configure Environment Variables

1. Copy example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local`:
```bash
# MongoDB
MONGODB_HR_URI=mongodb+srv://user:pass@cluster.mongodb.net/hr_skellio

# Firebase (from Step 2)
NEXT_PUBLIC_FIREBASE_HR_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_HR_AUTH_DOMAIN=hr-skellio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_HR_PROJECT_ID=hr-skellio
NEXT_PUBLIC_FIREBASE_HR_STORAGE_BUCKET=hr-skellio.appspot.com
NEXT_PUBLIC_FIREBASE_HR_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_HR_APP_ID=1:123456789:web:abc123
```

## Step 5: Create Initial Data

### Create Company

Connect to MongoDB and run:

```javascript
use hr_skellio

db.companies.insertOne({
  name: "My Company",
  industry: "Technology",
  size: "51-200",
  address: "123 Business Street, City, Country",
  phone: "+1234567890",
  email: "info@mycompany.com",
  website: "https://mycompany.com",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Save the company _id for next step
```

### Create Firebase User

1. Go to Firebase Console → Authentication
2. Click **Add User**
3. Enter email: `hr@mycompany.com`
4. Enter password (remember this!)
5. Save the UID

### Create HR User Record

In MongoDB:

```javascript
db.hrusers.insertOne({
  firebaseUid: "PASTE_FIREBASE_UID_HERE",
  email: "hr@mycompany.com",
  displayName: "HR Admin",
  role: "hr_admin",
  companyId: ObjectId("PASTE_COMPANY_ID_HERE"),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Step 6: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3001

## Step 7: Test Login

1. Go to http://localhost:3001
2. You'll be redirected to login
3. Enter the email and password you created
4. You should see the dashboard

## Step 8: Deploy to Vercel

### Prepare Repository

```bash
# From project root (not hr-system folder)
git add .
git commit -m "Add HR management system"
git push
```

### Deploy

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **New Project**
3. Import your repository
4. **Important**: Set **Root Directory** to `hr-system`
5. Add all environment variables from `.env.local`
6. Click **Deploy**

### Add Custom Domain

1. In Vercel project settings, go to **Domains**
2. Click **Add Domain**
3. Enter: `hr.skellio.com`
4. Follow DNS instructions

### Update DNS

In your domain provider (e.g., Namecheap, GoDaddy):

1. Add CNAME record:
   - Name: `hr`
   - Value: `cname.vercel-dns.com`
   - TTL: Automatic

2. Wait for DNS propagation (can take up to 48 hours)

### Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Scroll to **Authorized domains**
3. Add: `hr.skellio.com`
4. Add: `your-vercel-url.vercel.app` (for preview deployments)

## Step 9: Verify Production

1. Visit https://hr.skellio.com
2. Login with your credentials
3. Check all features work

## Troubleshooting

### Can't login

- Check Firebase credentials in Vercel environment variables
- Verify authorized domains in Firebase
- Check browser console for errors

### Database connection error

- Verify MongoDB connection string
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Ensure database name is `hr_skellio`

### User not found

- Verify HR user exists in MongoDB
- Check firebaseUid matches Firebase Authentication UID
- Ensure companyId is valid ObjectId

### Build errors

- Run `npm run build` locally first
- Check all imports are correct
- Verify all dependencies are installed

## Next Steps

1. **Add more HR users**: Repeat Step 5 for additional users
2. **Create employees**: Use the dashboard to add employees
3. **Set up roles**: Assign appropriate roles (admin/manager/staff)
4. **Configure permissions**: Implement role-based access control
5. **Customize**: Modify branding, colors, and features as needed

## Security Checklist

- [ ] Environment variables set in Vercel
- [ ] MongoDB Network Access configured
- [ ] Firebase authorized domains updated
- [ ] Strong passwords for all users
- [ ] Regular backups configured
- [ ] SSL/HTTPS enabled (automatic with Vercel)

## Support

If you encounter issues:
1. Check the README.md
2. Review Firebase and MongoDB logs
3. Check Vercel deployment logs
4. Verify all environment variables

---

🎉 Congratulations! Your HR Management System is now set up!
