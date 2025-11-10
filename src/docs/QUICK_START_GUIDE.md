# ⚡ LifeCraft - Quick Start Guide

**Get running in 5 minutes with this visual guide!**

---

## 🎯 Your Mission: Get the App Running

```
┌─────────────────────────────────────────────────┐
│  FROM: Downloaded folder                        │
│  TO:   Running app in browser                   │
│  TIME: 5 minutes                                │
│  DIFFICULTY: ⭐ Easy                            │
└─────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Checklist

### ✅ Step 1: Prerequisites (2 minutes)

```
┌────────────────────────────────────┐
│ Do you have Node.js installed?     │
│                                    │
│ Check:                             │
│ $ node --version                   │
│                                    │
│ ✓ v18.0.0 or higher = Good!        │
│ ✗ Not installed? Download:         │
│   https://nodejs.org               │
└────────────────────────────────────┘
```

**Commands:**
```bash
# Check Node.js version
node --version

# Should show: v18.x.x or higher
# If not installed: Visit nodejs.org
```

---

### ✅ Step 2: Open Project (30 seconds)

```
┌────────────────────────────────────┐
│ Open in VS Code (or any editor)    │
│                                    │
│ Method 1: Via Terminal             │
│ $ cd lifecraft-app                 │
│ $ code .                           │
│                                    │
│ Method 2: Via VS Code              │
│ File → Open Folder →               │
│ Select lifecraft-app               │
└────────────────────────────────────┘
```

**Commands:**
```bash
# Navigate to project
cd lifecraft-app

# Open in VS Code
code .

# Or just: Open VS Code → File → Open Folder
```

---

### ✅ Step 3: Organize Files (30 seconds)

```
┌────────────────────────────────────┐
│ Move files into src/ directory     │
│                                    │
│ Quick fix:                         │
│ $ mkdir -p src                     │
│ $ mv App.tsx src/ 2>/dev/null      │
│ $ mv components src/ 2>/dev/null   │
│ $ mv styles src/ 2>/dev/null       │
│ $ mv utils src/ 2>/dev/null        │
│                                    │
│ Verify:                            │
│ $ ls src/                          │
│ ✓ Should show: App.tsx components/ │
│                styles/ utils/      │
└────────────────────────────────────┘
```

**Commands:**
```bash
# Create src directory
mkdir -p src

# Move files (errors are OK if already moved)
mv App.tsx src/ 2>/dev/null || true
mv components src/ 2>/dev/null || true
mv styles src/ 2>/dev/null || true
mv utils src/ 2>/dev/null || true

# Verify
ls src/
```

---

### ✅ Step 4: Install Dependencies (2 minutes)

```
┌────────────────────────────────────┐
│ Install all packages               │
│                                    │
│ $ npm install                      │
│                                    │
│ ⏱️  This takes 2-3 minutes         │
│ 📦 Downloads ~200 MB               │
│                                    │
│ You'll see:                        │
│ ✓ added 500+ packages              │
│ ✓ audited 500 packages             │
└────────────────────────────────────┘
```

**Commands:**
```bash
# Install all dependencies
npm install

# Wait 2-3 minutes for completion
# Coffee break! ☕
```

**What's happening:**
- Downloading React, TypeScript, Tailwind
- Installing UI components (shadcn/ui)
- Setting up Supabase client
- Installing 50+ other packages

---

### ✅ Step 5: Create Environment File (1 minute)

```
┌────────────────────────────────────┐
│ Set up your API keys               │
│                                    │
│ 1. Copy template:                  │
│    $ cp .env.example .env          │
│                                    │
│ 2. Edit .env file:                 │
│    Add your actual keys            │
│                                    │
│ Required:                          │
│ • VITE_SUPABASE_URL               │
│ • VITE_SUPABASE_ANON_KEY          │
│ • VITE_GOOGLE_CLIENT_ID           │
└────────────────────────────────────┘
```

**Commands:**
```bash
# Copy example file
cp .env.example .env

# Now edit .env with your editor
# VS Code: Just click .env in sidebar
```

**Your `.env` file should look like:**
```env
VITE_SUPABASE_URL=https://zlhwdelmquesgquoppad.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_CLIENT_ID=1234567890-abc123.apps.googleusercontent.com
```

**Where to get these:**
- 🔑 Supabase: [Dashboard](https://app.supabase.com/project/zlhwdelmquesgquoppad/settings/api)
- 🔑 Google: [Cloud Console](https://console.cloud.google.com/apis/credentials)

> ⏭️ **Don't have keys yet?** Skip for now. You can add them later.

---

### ✅ Step 6: Start the App (30 seconds)

```
┌────────────────────────────────────┐
│ Launch development server          │
│                                    │
│ $ npm start                        │
│                                    │
│ You'll see:                        │
│ ✓ VITE v5.1.0 ready                │
│ ✓ Local: http://localhost:5173    │
│ ✓ Browser opens automatically      │
└────────────────────────────────────┘
```

**Commands:**
```bash
# Start dev server
npm start

# Alternative command (same thing):
# npm run dev
```

**Expected output:**
```
  VITE v5.1.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

**Browser opens automatically!** 🎉

---

## 🎉 Success!

```
╔═══════════════════════════════════╗
║  🎊 CONGRATULATIONS! 🎊           ║
║                                   ║
║  Your LifeCraft app is running!   ║
║  http://localhost:5173            ║
║                                   ║
║  You can now:                     ║
║  ✓ Browse survival guides         ║
║  ✓ Check emergency alerts         ║
║  ✓ Explore community features     ║
║  ✓ Test all 8 modules             ║
╚═══════════════════════════════════╝
```

---

## 🔍 Visual Troubleshooting

### ❌ Problem: npm install fails

```
┌────────────────────────────────────┐
│ ERROR: npm install failed          │
│                                    │
│ Solution:                          │
│ $ npm cache clean --force          │
│ $ rm package-lock.json             │
│ $ npm install                      │
└────────────────────────────────────┘
```

**Try:**
```bash
# Clear npm cache
npm cache clean --force

# Remove lock file
rm package-lock.json

# Install again
npm install
```

---

### ❌ Problem: "Cannot find module" errors

```
┌────────────────────────────────────┐
│ ERROR: Cannot find module ./App    │
│                                    │
│ Cause: Files not in src/           │
│                                    │
│ Solution: Move files               │
│ $ mkdir -p src                     │
│ $ mv App.tsx components src/       │
└────────────────────────────────────┘
```

**Fix:**
```bash
# Verify current structure
ls

# If you see App.tsx at root level, move it:
mkdir -p src
mv App.tsx src/
mv components src/
mv styles src/
mv utils src/

# Verify
ls src/
```

---

### ❌ Problem: Port 5173 already in use

```
┌────────────────────────────────────┐
│ ERROR: Port 5173 in use            │
│                                    │
│ Solution 1: Kill existing process  │
│ macOS/Linux:                       │
│ $ lsof -ti:5173 | xargs kill -9    │
│                                    │
│ Windows:                           │
│ $ netstat -ano | findstr :5173     │
│ $ taskkill /PID <PID> /F           │
│                                    │
│ Solution 2: Use different port     │
│ Edit vite.config.ts                │
│ Change: port: 5174                 │
└────────────────────────────────────┘
```

---

### ❌ Problem: White screen / blank page

```
┌────────────────────────────────────┐
│ SYMPTOM: Browser shows blank page  │
│                                    │
│ Debug steps:                       │
│ 1. Open DevTools (F12)             │
│ 2. Check Console for errors        │
│ 3. Check Network tab               │
│                                    │
│ Common causes:                     │
│ • Missing .env file                │
│ • Wrong file structure             │
│ • Import errors                    │
└────────────────────────────────────┘
```

**Debug:**
```bash
# Check file structure
ls src/

# Should show:
# App.tsx  components/  styles/  utils/

# Check .env exists
ls -la .env

# Restart dev server
npm start
```

---

### ❌ Problem: Google OAuth not working

```
┌────────────────────────────────────┐
│ SYMPTOM: Can't sign in with Google│
│                                    │
│ Common fixes:                      │
│ 1. Add redirect URI in Google:    │
│    http://localhost:5173           │
│                                    │
│ 2. Wait 5 minutes for Google to    │
│    propagate changes               │
│                                    │
│ 3. Clear browser cache             │
│                                    │
│ 4. Try incognito mode              │
└────────────────────────────────────┘
```

---

## 📊 5-Minute Visual Timeline

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  0:00  ├─► Check Node.js installed                 │
│        │                                            │
│  0:30  ├─► Open project in VS Code                 │
│        │                                            │
│  1:00  ├─► Organize files into src/                │
│        │                                            │
│  1:30  ├─► npm install (wait 2-3 min)              │
│        │   ☕ Coffee break!                        │
│  3:30  │                                            │
│        │                                            │
│  4:00  ├─► Create .env file                        │
│        │                                            │
│  4:30  ├─► npm start                                │
│        │                                            │
│  5:00  ├─► 🎉 APP RUNNING!                        │
│        │   http://localhost:5173                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Complete Command Sequence

**Copy and paste these commands in order:**

```bash
# Step 1: Navigate to project
cd lifecraft-app

# Step 2: Open in VS Code
code .

# Step 3: Organize files
mkdir -p src
mv App.tsx src/ 2>/dev/null || true
mv components src/ 2>/dev/null || true
mv styles src/ 2>/dev/null || true
mv utils src/ 2>/dev/null || true

# Step 4: Install dependencies
npm install

# Step 5: Create environment file
cp .env.example .env
# Now edit .env with your API keys

# Step 6: Start the app
npm start
```

**That's it! Browser opens automatically! 🚀**

---

## 📱 Testing on Your Phone

```
┌────────────────────────────────────┐
│ Access from your mobile device     │
│                                    │
│ 1. Find your computer's IP:        │
│    $ ifconfig | grep "inet "       │
│    (macOS/Linux)                   │
│                                    │
│    $ ipconfig                      │
│    (Windows)                       │
│                                    │
│ 2. On your phone's browser:        │
│    http://YOUR_IP:5173             │
│                                    │
│ Example:                           │
│    http://192.168.1.100:5173       │
│                                    │
│ ✓ Make sure on same WiFi!          │
└────────────────────────────────────┘
```

---

## 🎨 What You'll See

### Landing Page (Before Login)
```
┌─────────────────────────────────────┐
│  🌿 LifeCraft                       │
│  Off-grid Living & Survival         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Sign in with Google        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Your Complete Emergency            │
│  Preparedness Ecosystem             │
└─────────────────────────────────────┘
```

### After Login
```
┌─────────────────────────────────────┐
│ 🌿 LifeCraft    [Search] 🔔 🚨 👤  │
├─────────────────────────────────────┤
│ 📚 📊 🌪️ 👥 🤖 📥 📍 👤         │
│ Knowledge Tools Emergency Community │
├─────────────────────────────────────┤
│                                     │
│  [Your selected tab content]        │
│                                     │
│  • Survival guides                  │
│  • Emergency alerts                 │
│  • Community posts                  │
│  • And more!                        │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Success Checklist

You're successful when you can:

- [ ] Open http://localhost:5173 in browser
- [ ] See LifeCraft logo and branding
- [ ] Click "Sign in with Google" (even if it fails - that's OK!)
- [ ] Navigate between 8 tabs
- [ ] See content loading (survival guides, etc.)
- [ ] No major console errors

> **Note:** Some features require API keys to work fully. That's OK for now!

---

## 🎓 Next Steps

### Now that it's running:

1. **🔑 Add API Keys** (if you haven't)
   - Get Supabase credentials
   - Get Google OAuth ID
   - Update `.env` file

2. **📖 Read Documentation**
   - `README.md` - Complete guide
   - `FILE_STRUCTURE.md` - Understand code

3. **🎨 Customize**
   - Edit `src/App.tsx`
   - Modify `src/styles/globals.css`
   - Add your content

4. **🚀 Deploy**
   - See `README.md` → Deployment
   - Try Vercel (easiest)

---

## 📚 Learn More

```
┌────────────────────────────────────┐
│ 📖 Documentation Files             │
│                                    │
│ START_HERE.md          Quick start │
│ GETTING_STARTED.md     Full setup  │
│ README.md              Complete    │
│ FILE_STRUCTURE.md      Code guide  │
│ SETUP.md               Install     │
│                                    │
│ 🔍 Open any .md file to learn!     │
└────────────────────────────────────┘
```

---

## 🆘 Need Help?

### Common Commands
```bash
# Start app
npm start

# Stop app
Ctrl + C (in terminal)

# Restart app
Ctrl + C
npm start

# Rebuild
npm run build

# Check for errors
npm run type-check
```

### Get Support
1. Check `SETUP.md` → Troubleshooting
2. Read error message carefully
3. Google the exact error
4. Check console (F12 in browser)

---

<div align="center">

## 🎉 You Did It!

```
    🌿
   ╱│╲
  ╱ │ ╲
 ╱  │  ╲
╱───┴───╲

LifeCraft
is running!
```

**Your complete off-grid living ecosystem is ready! 🚀**

---

### Quick Commands Reference

```bash
npm start          # Start app
npm run build      # Build for production
npm run type-check # Check for errors
```

---

**Now go explore!** Open http://localhost:5173 🌐

</div>