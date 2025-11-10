# 🚀 LifeCraft - Quick Setup Guide

Follow these steps to get your LifeCraft app running locally.

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

This will install all required packages (~200MB, may take 2-3 minutes).

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://zlhwdelmquesgquoppad.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
```

**Where to find these:**

- **Supabase credentials**: Go to [Supabase Dashboard](https://app.supabase.com/project/zlhwdelmquesgquoppad/settings/api)
  - Copy "Project URL" → `VITE_SUPABASE_URL`
  - Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

- **Google OAuth**: Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Create OAuth 2.0 Client ID
  - Add redirect URI: `http://localhost:5173`
  - Copy Client ID → `VITE_GOOGLE_CLIENT_ID`

### Step 3: Start Development Server

```bash
npm start
```

Or alternatively:

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:5173`

**That's it! You're ready to go! 🎉**

---

## 📂 Project Structure

```
lifecraft-app/
├── src/                          # Source code
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   ├── components/               # React components
│   │   ├── AuthProvider.tsx     # Authentication
│   │   ├── KnowledgeHub.tsx     # Guides encyclopedia
│   │   ├── EmergencyMode.tsx    # Emergency features
│   │   └── ui/                  # shadcn/ui components
│   ├── styles/
│   │   └── globals.css          # Tailwind styles
│   └── utils/                   # Utilities
│       ├── config.tsx
│       └── supabase/            # Supabase client
├── public/                      # Static assets
├── supabase/                    # Backend functions
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
└── tsconfig.json               # TypeScript config
```

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (same as `npm run dev`) |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |

---

## 🔧 Troubleshooting

### Issue: "Cannot find module errors"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5173 already in use"

**Solution:**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
```

### Issue: "Supabase connection failed"

**Solution:**
1. Verify `.env` file exists and has correct values
2. Check Supabase project is active at [dashboard](https://app.supabase.com/)
3. Ensure anon key is copied correctly (no extra spaces)

### Issue: "Google OAuth redirect error"

**Solution:**
1. Add `http://localhost:5173` to authorized redirect URIs in Google Cloud Console
2. Wait 5 minutes for changes to propagate
3. Clear browser cache and try again

---

## 📱 Testing Mobile Responsiveness

The app is mobile-first. To test on your phone:

1. Find your computer's local IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Access from phone:
   ```
   http://YOUR_LOCAL_IP:5173
   ```

3. Make sure both devices are on the same WiFi network

---

## 🌐 Production Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - Settings → Environment Variables
   - Add all `VITE_*` variables

4. **Update OAuth redirect URIs:**
   - Add your Vercel URL to Google Cloud Console
   - Add to Supabase allowed domains

### Deploy to Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Add environment variables** in Netlify dashboard

---

## 📚 Next Steps

After setup, explore these features:

1. **Knowledge Hub** - Browse 1,247+ survival guides
2. **Emergency Preparedness** - View real-time alerts from PAGASA
3. **Community Exchange** - Create and share posts
4. **Location Tracker** - Set up family emergency tracking
5. **Emergency Mode** - Test the SOS features
6. **Offline Manager** - Download content for offline use

---

## 🆘 Getting Help

- **Documentation**: Check `/README.md` for comprehensive guide
- **Guidelines**: See `/guidelines/Guidelines.md` for development standards
- **Implementation**: Review `/IMPLEMENTATION_SUMMARY.md` for feature details
- **Bug Reports**: Check `/CRITICAL_BUGS_FIXED.md` for known issues

---

## 🔐 Security Notes

⚠️ **Important:**

- Never commit `.env` file to version control
- Keep your Supabase anon key secure
- Rotate API keys regularly
- Use environment variables for all secrets
- Enable Row Level Security (RLS) in Supabase

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with credentials
- [ ] Supabase project configured
- [ ] Google OAuth credentials added
- [ ] Development server running (`npm start`)
- [ ] App opens in browser
- [ ] Can sign in with Google
- [ ] All features loading correctly

---

<div align="center">

**Ready to build sustainable living communities! 🌿**

For detailed documentation, see [README.md](./README.md)

</div>