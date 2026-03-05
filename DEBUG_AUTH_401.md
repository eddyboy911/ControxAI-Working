# Authentication 401 Error - Troubleshooting Guide

## Current Issue: 401 Unauthorized on Login

The user was created correctly but login fails with 401. This typically means Email/Password auth is disabled.

## ✅ SOLUTION - Enable Email Auth Provider

### Step 1: Go to Supabase Auth Settings
1. Open https://supabase.com/dashboard/project/dqwdgntcdmraczlcxilt
2. Click **Authentication** in left sidebar
3. Click **Providers** tab

### Step 2: Enable Email Provider
1. Find **Email** in the providers list
2. Make sure it's **ENABLED** (toggle should be ON/green)
3. If disabled, click on it and toggle "Enable Email provider"
4. Click **Save**

### Step 3: Check Additional Settings
While you're there, verify:
- ✅ **Confirm email** is DISABLED (or you'll need to confirm every user)
- ✅ **Secure email change** can be disabled for testing
- ✅ **Enable email signups** should be ON

### Step 4: Verify User Settings
Go back to **Authentication** → **Users**:
1. Find `admin@controxai.com`
2. Click on the user
3. Verify:
   - ✅ Email Confirmed At: (should have a timestamp)
   - ✅ No red warnings

### Step 5: Try Login Again
1. Go to http://localhost:5173/login
2. Email: `admin@controxai.com`
3. Password: `123456`
4. Click Login

---

## 🔍 Alternative: Check if user actually exists

Run this in Supabase SQL Editor:
```sql
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@controxai.com';
```

Should return 1 row with the user details.
