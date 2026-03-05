# Debug Instructions

## Current Issue: "Invalid API Key" on Login

### What I've Done:
1. ✅ Verified .env file has correct keys
2. ✅ Restarted dev server to reload environment variables
3. ✅ Server now running on http://localhost:5173/

### Please Try These Steps:

#### Step 1: Clear Browser Cache and Storage
1. Open http://localhost:5173/ in your browser
2. Press **F12** to open DevTools
3. Go to **Application** tab (or **Storage** in Firefox)
4. Click **Clear site data** or **Clear storage**
5. **OR** Run this in the Console:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### Step 2: Check Environment Variables
Open the browser console (F12) and run:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Expected Output:**
- URL: `https://dqwdgntcdmraczlcxilt.supabase.co`
- Key: Should start with `eyJhbGciOiJIUzI1NiI...`

#### Step 3: If Still Showing "Invalid API Key"
Take a screenshot of:
1. The error message
2. The browser console (F12 → Console tab)
3. The Network tab showing the failed request

### Common Causes:
- **Browser cached old .env values** → Clear cache
- **Multiple dev servers running** → I've killed all Node processes
- **Wrong Supabase project** → Keys match the project URL
