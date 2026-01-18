# Deployment Guide for HR System

## Quick Deployment Checklist

- [ ] Firebase project created and configured
- [ ] MongoDB database created (`hr_skellio`)
- [ ] Environment variables prepared
- [ ] Initial company and HR user created
- [ ] Code pushed to GitHub
- [ ] Vercel project configured
- [ ] Custom domain added
- [ ] DNS records updated
- [ ] Production tested

## Vercel Deployment Steps

### 1. Prepare for Deployment

```bash
# Make sure you're in the project root (not hr-system)
cd ..

# Add and commit
git add hr-system/
git commit -m "Add HR management system"
git push origin main
```

### 2. Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **IMPORTANT**: Configure project settings:
   - **Root Directory**: `hr-system`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Add Environment Variables

In Vercel project settings, add these variables:

```
MONGODB_HR_URI=mongodb+srv://...
NEXT_PUBLIC_FIREBASE_HR_API_KEY=...
NEXT_PUBLIC_FIREBASE_HR_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_HR_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_HR_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_HR_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_HR_APP_ID=...
```

For each variable:
- ✅ Check **Production**
- ✅ Check **Preview**
- ⬜ Leave **Development** unchecked (use local .env.local)

### 4. Deploy

Click **"Deploy"** and wait for build to complete.

### 5. Add Custom Domain

1. In Vercel project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `hr.skellio.com`
4. Vercel will provide DNS instructions

### 6. Configure DNS

In your domain registrar (Namecheap, GoDaddy, etc.):

**Add CNAME Record:**
```
Type: CNAME
Name: hr
Value: cname.vercel-dns.com
TTL: Automatic (or 3600)
```

**Or A Record (alternative):**
```
Type: A
Name: hr
Value: 76.76.21.21
TTL: Automatic
```

### 7. Update Firebase Settings

1. Go to Firebase Console → Authentication → Settings
2. Under **Authorized domains**, add:
   - `hr.skellio.com`
   - `your-project.vercel.app` (your Vercel preview URL)

### 8. Test Production

1. Wait for DNS propagation (5-30 minutes usually)
2. Visit https://hr.skellio.com
3. Test login with your HR user credentials
4. Verify all features work

## MongoDB Atlas Configuration

### Network Access

1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. This is required for Vercel's dynamic IPs

### Database User

Ensure your database user has:
- Read and write permissions
- Access to `hr_skellio` database

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_HR_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/hr_skellio` |
| `NEXT_PUBLIC_FIREBASE_HR_API_KEY` | Firebase API key | `AIzaSyXXXXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_FIREBASE_HR_AUTH_DOMAIN` | Firebase auth domain | `hr-skellio.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_HR_PROJECT_ID` | Firebase project ID | `hr-skellio` |
| `NEXT_PUBLIC_FIREBASE_HR_STORAGE_BUCKET` | Firebase storage bucket | `hr-skellio.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_HR_MESSAGING_SENDER_ID` | Firebase messaging ID | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_HR_APP_ID` | Firebase app ID | `1:123456789012:web:abc123` |

## Troubleshooting

### Build Fails

**Error: Cannot find module**
```bash
# Solution: Check package.json dependencies
cd hr-system
npm install
npm run build  # Test locally first
```

**Error: Environment variable not defined**
- Verify all variables are set in Vercel
- Check variable names match exactly
- Redeploy after adding variables

### Runtime Errors

**Firebase: auth/configuration-not-found**
- Check Firebase config in environment variables
- Verify Firebase project exists
- Ensure authorized domains include your domain

**MongoDB: Connection timeout**
- Check MongoDB URI is correct
- Verify Network Access allows 0.0.0.0/0
- Test connection string locally

**User not found**
- Ensure HR user exists in MongoDB
- Verify firebaseUid matches Firebase Authentication
- Check companyId is valid

### DNS Issues

**Domain not resolving**
- Wait up to 48 hours for DNS propagation
- Use https://dnschecker.org to check status
- Verify CNAME record is correct

**SSL certificate pending**
- Vercel automatically provisions SSL
- Usually takes 5-10 minutes
- Check Vercel domain settings

## Continuous Deployment

After initial setup, any push to your repository will automatically:
1. Trigger a new build
2. Deploy to preview URL
3. Deploy to production (if pushed to main branch)

### Preview Deployments

Every pull request gets a unique preview URL:
```
https://hr-system-git-branch-name-your-username.vercel.app
```

## Monitoring

### Vercel Dashboard

Monitor:
- Build logs
- Runtime logs
- Performance metrics
- Error tracking

### MongoDB Atlas

Monitor:
- Database connections
- Query performance
- Storage usage
- Network traffic

### Firebase Console

Monitor:
- Authentication events
- User sign-ins
- Error rates

## Backup Strategy

### Database Backups

1. **MongoDB Atlas** (Recommended):
   - Automatic backups enabled by default
   - Point-in-time recovery available
   - Configure backup schedule in Atlas

2. **Manual Backups**:
```bash
mongodump --uri="mongodb+srv://..." --db=hr_skellio --out=./backup
```

### Code Backups

- Code is backed up in GitHub
- Vercel keeps deployment history
- Can rollback to previous deployments

## Scaling Considerations

### Database

- MongoDB Atlas auto-scales
- Monitor connection limits
- Add indexes for better performance

### Vercel

- Automatically scales with traffic
- No configuration needed
- Monitor usage in dashboard

## Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Rotate credentials regularly
   - Use strong passwords

2. **Database**
   - Enable MongoDB authentication
   - Use strong passwords
   - Regular security updates

3. **Firebase**
   - Enable MFA for admin accounts
   - Review security rules
   - Monitor suspicious activity

4. **Vercel**
   - Enable Vercel Authentication (optional)
   - Use preview deployments for testing
   - Review access logs

## Support

If you need help:
1. Check Vercel deployment logs
2. Review MongoDB Atlas logs
3. Check Firebase Console errors
4. Contact support team

---

🚀 Your HR System is now deployed and ready to use!
