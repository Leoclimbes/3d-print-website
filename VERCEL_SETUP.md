# 🚀 Vercel Deployment Setup Guide

## ⚠️ Critical: Fix 500 Error on Sign In

If you're seeing a **black page with 500** when trying to sign in on Vercel, you need to set environment variables.

## 🔧 Required Environment Variables

### 1. NEXTAUTH_URL (CRITICAL - Fixes 500 Error)

**What it does:**
- NextAuth needs this to generate proper callback URLs and CSRF tokens
- Without it, you'll get 500 errors on Vercel

**How to set:**
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `NEXTAUTH_URL`
   - **Value:** `https://your-domain.vercel.app` (replace with your actual Vercel URL)
   - **Environment:** Production, Preview, Development (select all)

**Example:**
```
NEXTAUTH_URL=https://3d-print-website.vercel.app
```

**Important:**
- ✅ Include `https://`
- ✅ Don't include a trailing slash `/`
- ✅ Use your actual Vercel deployment URL

### 2. NEXTAUTH_SECRET (Security)

**What it does:**
- Used to sign and encrypt JWT tokens
- Must be a secure random string

**How to generate:**
```bash
openssl rand -base64 32
```

**How to set:**
1. Generate a secret using the command above
2. Go to Vercel → Settings → Environment Variables
3. Add:
   - **Name:** `NEXTAUTH_SECRET`
   - **Value:** (paste the generated secret)
   - **Environment:** Production, Preview, Development

**Example:**
```
NEXTAUTH_SECRET=xKp9mN2qR7vT4wY8zA1bC3dE5fG6hI7jK8lM9nO0pQ1r
```

### 3. ADMIN_SETUP_PASSWORD (Optional)

**What it does:**
- Password required to create the first admin account
- Defaults to `AdminSetup2025!` if not set

**How to set:**
1. Vercel → Settings → Environment Variables
2. Add:
   - **Name:** `ADMIN_SETUP_PASSWORD`
   - **Value:** (your secure password)
   - **Environment:** Production, Preview, Development

## 📋 Quick Setup Checklist

- [ ] Set `NEXTAUTH_URL` to your Vercel deployment URL
- [ ] Generate and set `NEXTAUTH_SECRET`
- [ ] (Optional) Set `ADMIN_SETUP_PASSWORD`
- [ ] Redeploy your application after adding environment variables

## 🔄 After Setting Variables

1. **Redeploy:** Vercel will automatically redeploy when you add environment variables
2. **Or trigger manually:** Go to Deployments → Redeploy

## 🐛 Troubleshooting

### Still getting 500 error?

1. **Check Vercel logs:**
   - Go to your project → Deployments → Click on the latest deployment → View logs
   - Look for errors related to NextAuth or NEXTAUTH_URL

2. **Verify environment variables:**
   - Make sure `NEXTAUTH_URL` is set correctly (with `https://`, no trailing slash)
   - Make sure you've selected all environments (Production, Preview, Development)

3. **Check your Vercel URL:**
   - Go to your project settings
   - Verify your deployment URL matches what you set in `NEXTAUTH_URL`

### File-Based Database Note

⚠️ **Important:** Your app uses a file-based database (`data/users.json`). On Vercel's serverless functions:
- The file system is read-only except for `/tmp`
- Files written to `/tmp` don't persist across deployments
- **This means user accounts won't persist on Vercel**

**Good News:** The code has been updated to handle this gracefully:
- ✅ File system errors are caught and logged (won't cause 500 errors)
- ✅ Falls back to in-memory storage if file system is not writable
- ✅ Authentication will work, but users need to register again after each deployment

**Solutions for Persistent Data:**
1. Use a real database (PostgreSQL, MongoDB, etc.)
2. Use Vercel KV (Redis) for data storage
3. Use a database service like Supabase, PlanetScale, or Neon

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

