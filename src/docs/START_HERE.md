# 🚀 START HERE - LifeCraft Quick Reference

**Welcome!** You just downloaded the complete LifeCraft application. This page tells you exactly what to do.

---

## ⚡ Super Quick Start (5 Minutes)

```bash
# 1. Navigate to project
cd lifecraft-app

# 2. Organize files (if needed)
mkdir -p src
mv App.tsx components styles utils src/ 2>/dev/null || true

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env
# Then edit .env with your credentials

# 5. Start the app
npm start
```

**Done!** App opens at `http://localhost:5173`

---

## 📖 Which File Should I Open?

### **First Time? Read in this order:**

| Order | File | Purpose | Time |
|-------|------|---------|------|
| **1** | `START_HERE.md` | This file - Quick overview | 2 min |
| **2** | `GETTING_STARTED.md` | Step-by-step setup guide | 5 min |
| **3** | `SETUP.md` | Installation details | 3 min |
| **4** | `README.md` | Complete documentation | 15 min |

### **Quick Reference:**

| Task | Open This |
|------|-----------|
| 🔧 Install and run | `SETUP.md` |
| 📁 Understand code structure | `FILE_STRUCTURE.md` |
| 🔄 Organize files | `MIGRATION_GUIDE.md` |
| 📚 Learn all features | `README.md` |
| 🐛 Fix problems | `SETUP.md` → Troubleshooting |
| 💻 Start coding | `src/App.tsx` |

---

## 🎯 What You Have

This is a **complete, production-ready** web application with:

### ✅ Frontend
- React 18 + TypeScript
- Tailwind CSS v4
- 35+ UI components (shadcn/ui)
- Mobile-first responsive design

### ✅ Backend
- Supabase integration
- PostgreSQL database
- Google OAuth authentication
- Real-time updates
- File storage

### ✅ Features (8 Major Modules)
1. 📚 **Knowledge Hub** - 1,247+ survival guides
2. 🌪️ **Emergency Preparedness** - Real-time alerts (PAGASA/MMDA/NDRRMC)
3. 👥 **Community Exchange** - Social platform with posts
4. 📍 **Family Tracker** - GPS location sharing
5. 🚨 **Emergency Mode** - SOS tools (flashlight, compass, calling)
6. 🤖 **AI Assistant** - Survival Q&A
7. 📥 **Offline Manager** - Download for offline use
8. 🧮 **Tools & Calculators** - Practical utilities

---

## 📂 Project Structure (Simplified)

```
lifecraft-app/
├── 📖 Documentation (Read These First)
│   ├── START_HERE.md           ← You are here
│   ├── GETTING_STARTED.md      ← Next: Read this
│   ├── SETUP.md                ← Installation guide
│   ├── README.md               ← Complete docs
│   └── FILE_STRUCTURE.md       ← Code organization
│
├── ⚙️ Configuration (Don't Touch Yet)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example            ← Copy to .env
│
├── 💻 Source Code (src/)
│   ├── main.tsx               ← Entry point
│   ├── App.tsx                ← Main app
│   ├── components/            ← All features
│   ├── styles/                ← CSS
│   └── utils/                 ← Helpers
│
└── 🗄️ Backend (supabase/)
    └── functions/server/       ← Edge Functions
```

---

## 🎬 Your First Session

### Step 1: Open Project (30 seconds)

```bash
cd lifecraft-app
code .
```

In VS Code, you'll see all files in the sidebar.

### Step 2: Read Documentation (5 minutes)

Open and read:
1. This file (`START_HERE.md`)
2. `GETTING_STARTED.md`

### Step 3: Set Up Environment (2 minutes)

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` and add your API keys (see GETTING_STARTED.md for where to get them).

### Step 4: Install & Run (3 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Browser opens automatically at `http://localhost:5173`

### Step 5: Test the App (2 minutes)

- Click "Sign in with Google"
- Browse the Knowledge Hub
- Check Emergency Preparedness
- Create a community post
- Try Emergency Mode (SOS button)

**Total time: ~12 minutes from download to running app!**

---

## 🔑 Required Credentials

You need 2 sets of credentials in your `.env` file:

### 1. Supabase (Database & Backend)

```env
VITE_SUPABASE_URL=https://zlhwdelmquesgquoppad.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

**Get from:** [Supabase Dashboard](https://app.supabase.com/project/zlhwdelmquesgquoppad/settings/api)

### 2. Google OAuth (Sign In)

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

**Get from:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

> 📖 **Detailed instructions:** See `GETTING_STARTED.md` → "Configure Your App"

---

## 🛠️ Essential Commands

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm start
# or
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for type errors
npm run type-check

# Lint code
npm run lint
```

---

## 🗺️ File Locations

### Want to modify...

| Feature | Edit This File |
|---------|---------------|
| Main layout | `src/App.tsx` |
| Authentication | `src/components/AuthProvider.tsx` |
| Survival guides | `src/components/KnowledgeHub.tsx` |
| Emergency alerts | `src/components/EmergencyPreparedness.tsx` |
| Community posts | `src/components/CommunityExchange.tsx` |
| GPS tracking | `src/components/LocationTracker.tsx` |
| Emergency SOS | `src/components/EmergencyMode.tsx` |
| AI assistant | `src/components/AIHub.tsx` |
| Offline downloads | `src/components/OfflineManager.tsx` |
| Colors & styles | `src/styles/globals.css` |
| App config | `src/utils/config.tsx` |

---

## 🚨 Common Issues & Quick Fixes

### Issue: Files not in `src/` directory

**Fix:**
```bash
mkdir -p src
mv App.tsx components styles utils src/
```

### Issue: `npm install` fails

**Fix:**
```bash
npm cache clean --force
rm package-lock.json
npm install
```

### Issue: "Cannot find module" errors

**Fix:** Make sure files are in `src/` directory (see above)

### Issue: `.env` not working

**Fix:**
1. Make sure file is named exactly `.env` (not `.env.txt`)
2. Restart dev server after changing `.env`
3. No quotes needed around values

### Issue: Port already in use

**Fix:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

> 📖 **More help:** See `SETUP.md` → "Troubleshooting"

---

## 📚 Documentation Guide

### Quick Reference

| Document | When to Read | Time |
|----------|-------------|------|
| `START_HERE.md` | Right now! | 2 min |
| `GETTING_STARTED.md` | Before first run | 5 min |
| `SETUP.md` | When installing | 3 min |
| `FILE_STRUCTURE.md` | When coding | 5 min |
| `README.md` | For complete info | 15 min |
| `MIGRATION_GUIDE.md` | If files need organizing | 2 min |

### Technical Docs

| Document | Purpose |
|----------|---------|
| `IMPLEMENTATION_SUMMARY.md` | Feature implementation details |
| `LocationTracker_Flow_Documentation.md` | GPS tracking system |
| `CRITICAL_BUGS_FIXED.md` | Known issues & solutions |
| `guidelines/Guidelines.md` | Development standards |
| `Attributions.md` | Third-party credits |

---

## 🎯 What to Do Next

### Immediate (Next 10 Minutes)

1. ✅ Read `GETTING_STARTED.md`
2. ✅ Run `npm install`
3. ✅ Create `.env` file
4. ✅ Run `npm start`
5. ✅ Sign in and test features

### Today (Next Hour)

1. 📖 Read `README.md` fully
2. 🔍 Explore `src/App.tsx`
3. 🎨 Browse `src/components/`
4. 🗄️ Set up Supabase database (see README)
5. 🚀 Deploy test version

### This Week

1. Customize styles in `src/styles/globals.css`
2. Add your own survival guides
3. Configure emergency alerts for your region
4. Set up production deployment
5. Invite team members

---

## 🎓 Technology Stack

### What You're Working With

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Supabase** - Backend (PostgreSQL, Auth, Storage)
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### No Experience Needed In

You can customize this app even if you've never used:
- Tailwind CSS (just copy/paste classes)
- Supabase (we handle the setup)
- TypeScript (JavaScript knowledge is enough)

---

## ✅ Success Checklist

You're ready to code when:

- [ ] Opened project in VS Code
- [ ] Read `GETTING_STARTED.md`
- [ ] Files organized in `src/` directory
- [ ] Ran `npm install` successfully
- [ ] Created `.env` file
- [ ] Added Supabase credentials
- [ ] Added Google OAuth Client ID
- [ ] Ran `npm start`
- [ ] App loads in browser
- [ ] Can sign in with Google
- [ ] All features accessible

---

## 🆘 Need Help?

### Quick Solutions

1. **Error during install?**
   - See `SETUP.md` → Troubleshooting

2. **Don't have API keys?**
   - See `GETTING_STARTED.md` → Configure Your App

3. **Files in wrong place?**
   - See `MIGRATION_GUIDE.md`

4. **Want to understand the code?**
   - See `FILE_STRUCTURE.md`

5. **Need feature details?**
   - See `README.md` → Features

### Resources

- 📖 Documentation in project root
- 💬 [Supabase Discord](https://discord.supabase.com/)
- 🌐 [React Docs](https://react.dev/)
- 🎨 [Tailwind Docs](https://tailwindcss.com/)

---

## 🎉 Ready to Begin!

**You have everything you need to build an amazing app!**

### Next Action:

👉 **Open `GETTING_STARTED.md` and follow the setup steps.**

Then come back here if you need quick reference.

---

<div align="center">

## 📋 Quick Command Reference

```bash
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Build for production
npm run preview      # Test production build
```

**Happy coding! 🌿🚀**

</div>

---

<div align="center">

*LifeCraft - Your Complete Off-Grid Living & Emergency Preparedness Ecosystem*

**Built with React • TypeScript • Supabase • Tailwind CSS**

</div>