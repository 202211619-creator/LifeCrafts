# 🌿 LifeCraft - Getting Started

**Welcome to LifeCraft!** This guide will have you up and running in 10 minutes.

---

## 📦 What You Downloaded

You now have a complete, production-ready React + TypeScript application with:

- ✅ **Full source code** for all features
- ✅ **Complete UI component library** (shadcn/ui)
- ✅ **Supabase backend integration**
- ✅ **Google OAuth authentication**
- ✅ **Emergency preparedness system**
- ✅ **GPS family tracking**
- ✅ **Offline support**
- ✅ **Community features**

---

## 🎯 What to Open First

### 1. **Open Project in VS Code**

```bash
# Navigate to project folder
cd lifecraft-app

# Open in VS Code
code .
```

### 2. **Read These Files (In Order)**

📖 **Start here:**
1. **`GETTING_STARTED.md`** ← You are here! Continue reading
2. **`SETUP.md`** ← Installation instructions (5 min)
3. **`FILE_STRUCTURE.md`** ← Understanding the codebase
4. **`README.md`** ← Complete documentation

💡 **Optional reading:**
- `MIGRATION_GUIDE.md` - Only if you need to reorganize files
- `IMPLEMENTATION_SUMMARY.md` - Feature details
- `guidelines/Guidelines.md` - Development standards

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Node.js

**Check if installed:**
```bash
node --version
# Should show v18.0.0 or higher
```

**Not installed?** Download from [nodejs.org](https://nodejs.org/)

### Step 2: Organize Files

Your files might be at the root level. They need to be in `src/`:

**Quick fix:**
```bash
# Create src directory if it doesn't exist
mkdir -p src

# Move files into src/
mv App.tsx src/ 2>/dev/null || true
mv components src/ 2>/dev/null || true
mv styles src/ 2>/dev/null || true
mv utils src/ 2>/dev/null || true

# Verify
ls src/
# Should show: App.tsx  components/  styles/  utils/
```

> **Note:** If you get errors, that's okay - files might already be in the right place!

### Step 3: Install & Run

```bash
# Install dependencies (takes 2-3 minutes)
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

The app will automatically open at `http://localhost:5173` 🎉

---

## ⚙️ Configure Your App

### Required: Environment Variables

Edit `.env` file with your credentials:

```env
# 1. Supabase (Backend Database)
VITE_SUPABASE_URL=https://zlhwdelmquesgquoppad.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_key_here

# 2. Google OAuth (Sign In)
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

### Where to Get These:

#### 🔑 Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/project/zlhwdelmquesgquoppad/settings/api)
2. Find "Project URL" → Copy to `VITE_SUPABASE_URL`
3. Find "anon public" key → Copy to `VITE_SUPABASE_ANON_KEY`

**Don't have access?** Contact your team admin or create a new Supabase project at [supabase.com](https://supabase.com)

#### 🔑 Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:5173`
   - Your production domain (later)
7. Copy **Client ID** → Paste in `.env`

**Step-by-step guide:** [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

## 🏗️ Project Structure Overview

```
lifecraft-app/
│
├── 📝 START HERE
│   ├── GETTING_STARTED.md       ← You are here
│   ├── SETUP.md                 ← Next: Installation
│   └── README.md                ← Complete docs
│
├── ⚙️ CONFIGURATION
│   ├── package.json             ← Dependencies
│   ├── .env                     ← Your secrets (create this!)
│   ├── vite.config.ts           ← Build config
│   └── tsconfig.json            ← TypeScript
│
├── 💻 SOURCE CODE
│   └── src/
│       ├── main.tsx             ← Entry point
│       ├── App.tsx              ← Main component
│       ├── components/          ← All features
│       ├── styles/              ← CSS
│       └── utils/               ← Helpers
│
└── 📚 DOCUMENTATION
    ├── IMPLEMENTATION_SUMMARY.md
    ├── FILE_STRUCTURE.md
    └── guidelines/
```

---

## 🎨 Main Features

Once running, you'll have access to:

### 1. **📚 Knowledge Hub**
- 1,247+ survival guides
- 9 categories (shelter, water, food, medical, etc.)
- Offline downloads
- Full-text search

### 2. **🌪️ Emergency Preparedness**
- **Real-time alerts** from PAGASA, MMDA, NDRRMC
- **Survival packs** for disasters
- Emergency checklists
- Disaster-specific guides

### 3. **👥 Community Exchange**
- Create posts with images
- Share knowledge
- Offer/request resources
- Facebook-like interface

### 4. **📍 Family Location Tracker**
- Real-time GPS tracking
- Google Maps integration
- Emergency check-ins
- Family safety network

### 5. **🚨 Emergency Mode**
- One-tap SOS activation
- Emergency calling (911, 117, 143)
- Flashlight & compass
- GPS coordinates
- Family notifications

### 6. **🤖 AI Assistant**
- Survival scenario Q&A
- Personalized recommendations
- Emergency planning

### 7. **📥 Offline Manager**
- Download entire guide categories
- Sync management
- Works without internet

### 8. **🧮 Tools & Calculators**
- Water purification
- Solar panel sizing
- Food storage planning
- And more...

---

## 🧪 Testing the App

### 1. **Authentication**
- Click "Sign in with Google"
- Authorize the app
- You should see your name in the header

### 2. **Browse Knowledge Hub**
- Click "Knowledge" tab
- Browse categories
- Open a guide
- Try search

### 3. **Emergency Features**
- Click "Emergency" tab
- View real-time alerts
- Check survival packs
- Download offline content

### 4. **Community**
- Click "Community" tab
- Create a test post
- Add an image
- View in feed

### 5. **Emergency Mode**
- Click red "SOS" button in header
- Explore emergency tools
- Exit emergency mode

---

## 📱 Mobile Testing

The app is mobile-first. Test on your phone:

1. **Find your computer's IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig | findstr IPv4
   ```

2. **On your phone's browser:**
   ```
   http://YOUR_IP_ADDRESS:5173
   ```

3. **Make sure** both devices are on the same WiFi

---

## 🐛 Troubleshooting

### Problem: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete package-lock.json
rm package-lock.json

# Try again
npm install
```

### Problem: Port 5173 already in use

**Solution:**
```bash
# Kill process on port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or change port in vite.config.ts
```

### Problem: "Cannot find module" errors

**Solution:**
```bash
# Verify file structure
ls src/
# Should show: App.tsx  components/  styles/  utils/

# If files are at root level, run migration:
mkdir -p src
mv App.tsx components styles utils src/
```

### Problem: White screen / blank page

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify `.env` file exists
4. Check network tab for failed requests

### Problem: Google OAuth fails

**Solution:**
1. Verify redirect URI in Google Console: `http://localhost:5173`
2. Wait 5 minutes for Google changes to propagate
3. Clear browser cache
4. Try incognito mode

---

## 📚 Next Steps

### 1. **Explore the Code**

Start with these files:

- `src/App.tsx` - Main application
- `src/components/AuthProvider.tsx` - Authentication
- `src/components/KnowledgeHub.tsx` - Guides system
- `src/components/EmergencyPreparedness.tsx` - Emergency features

### 2. **Customize the App**

- Change colors in `src/styles/globals.css`
- Add new features in `src/components/`
- Modify content in each component
- Add your own survival guides

### 3. **Set Up Backend**

Follow database setup in `README.md` → "Supabase Configuration"

Required tables:
- `profiles` - User data
- `posts` - Community content
- `emergency_alerts` - Real-time alerts
- `location_tracking` - GPS data
- `family_connections` - Family links

### 4. **Deploy to Production**

See `README.md` → "Deployment" section

Options:
- **Vercel** (recommended) - `vercel deploy`
- **Netlify** - Connect GitHub repo
- **Self-host** - `npm run build` → serve `dist/`

---

## 🎓 Learning Resources

### React + TypeScript
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind v4 Guide](https://tailwindcss.com/docs/v4-beta)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Component Library
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🎯 Development Workflow

### Daily Development

```bash
# 1. Start dev server
npm start

# 2. Make changes
# Edit files in src/

# 3. Check types
npm run type-check

# 4. Build for production
npm run build

# 5. Test production build
npm run preview
```

### Before Committing

```bash
# 1. Check for errors
npm run lint

# 2. Type check
npm run type-check

# 3. Test build
npm run build

# 4. Git commit
git add .
git commit -m "Your message"
```

---

## ✅ Success Checklist

You're ready when:

- [ ] Project opens in VS Code
- [ ] `src/` directory has all files
- [ ] `npm install` completed successfully
- [ ] `.env` file created with credentials
- [ ] `npm start` runs without errors
- [ ] Browser opens to http://localhost:5173
- [ ] Can sign in with Google
- [ ] All 8 tabs are accessible
- [ ] No console errors
- [ ] Features load correctly

---

## 🆘 Getting Help

### Documentation
- `README.md` - Complete guide
- `SETUP.md` - Installation
- `FILE_STRUCTURE.md` - Code organization
- `IMPLEMENTATION_SUMMARY.md` - Features

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [React Community](https://react.dev/community)
- [Tailwind Discord](https://tailwindcss.com/discord)

### Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run type checking
npm run type-check

# View this guide
cat GETTING_STARTED.md
```

---

## 🎉 You're All Set!

**Your LifeCraft app is now ready for development!**

### What to do next:

1. ✅ Run `npm start`
2. ✅ Sign in with Google
3. ✅ Explore all 8 features
4. ✅ Read `README.md` for details
5. ✅ Start customizing!

---

<div align="center">

**Happy coding! Build something amazing! 🌿🚀**

Questions? Check **[README.md](./README.md)** for comprehensive documentation.

</div>