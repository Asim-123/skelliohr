# Testing Authentication Persistence Fix

## Quick Test Steps

### Test 1: Basic Login Persistence
1. Open your browser and navigate to the employee login page
2. Log in with valid credentials
3. **Reload the page (F5 or Ctrl+R)**
4. ✅ **Expected**: You should remain logged in and see your dashboard
5. ❌ **Before Fix**: You would be logged out and redirected to login

### Test 2: Multiple Reloads
1. While logged in, reload the page 5-10 times rapidly
2. ✅ **Expected**: You stay logged in every time
3. Check browser console - you should see cached user data being used

### Test 3: Browser Restart
1. Log in to the system
2. Close the browser completely (not just the tab)
3. Reopen the browser and navigate back to the HR system
4. ✅ **Expected**: You should still be logged in

### Test 4: Network Resilience
1. Log in successfully
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Set throttling to "Slow 3G" or "Offline"
5. Reload the page
6. ✅ **Expected**: You remain logged in using cached data
7. Check console for retry messages

### Test 5: Cache Validation
1. Log in as Employee A
2. Open DevTools → Application → Local Storage
3. Find `employee_user_cache` - note the user data
4. Log out
5. Log in as Employee B
6. Check `employee_user_cache` again
7. ✅ **Expected**: Should show Employee B's data (not A's)

## What to Look For

### In Browser Console
You should see messages like:
- ✅ `"Using cached user data"` - when loading from cache
- ✅ `"Retrying sync in Xms... (attempt Y/3)"` - when network is slow
- ✅ No errors about "user not found" or "auth state changed"

### In Network Tab
- The `/api/employee/auth/sync` or `/api/auth/sync` call should succeed
- If it fails, it should retry 3 times with delays
- Even if all retries fail, user should stay logged in with cached data

### In Local Storage
Check for these keys:
- `employee_user_cache` - for employee users
- `hr_user_cache` - for HR users
- Should contain user data with uid, email, role, etc.

## Common Issues

### Issue: Still getting logged out
**Check:**
1. Clear browser cache and cookies
2. Make sure MongoDB connection is working
3. Check if Firebase config is correct in `.env.local`
4. Look for errors in browser console

### Issue: "Using cached user data" but wrong user
**Solution:**
1. Log out completely
2. Clear Local Storage manually
3. Log in again

### Issue: Sync keeps retrying forever
**Check:**
1. MongoDB connection string in `.env.local`
2. API route `/api/employee/auth/sync` is accessible
3. Employee exists in database with correct firebaseUid

## Environment Check

Make sure these are set in `hr-system/.env.local`:

```env
# Firebase HR Config
NEXT_PUBLIC_FIREBASE_HR_API_KEY=...
NEXT_PUBLIC_FIREBASE_HR_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_HR_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_HR_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_HR_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_HR_APP_ID=...

# MongoDB
MONGODB_URI=...
```

## Success Criteria

✅ Users stay logged in after page reload
✅ Users stay logged in after browser restart  
✅ Users stay logged in even with slow network
✅ Cached data is user-specific (no data leaks)
✅ System retries failed syncs automatically
✅ No console errors during normal operation

## Rollback Plan

If issues occur, you can revert by:
1. `git checkout HEAD -- hr-system/lib/firebase-hr.ts`
2. `git checkout HEAD -- hr-system/contexts/EmployeeAuthContext.tsx`
3. `git checkout HEAD -- hr-system/contexts/HRAuthContext.tsx`
4. Restart the dev server

## Additional Notes

- The fix is entirely client-side, no database changes needed
- Cached data is stored in browser's localStorage
- Cache is automatically cleared on logout
- Firebase persistence is set to `browserLocalPersistence` (survives browser restarts)
