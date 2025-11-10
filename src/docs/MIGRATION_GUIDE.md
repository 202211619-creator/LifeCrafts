# 🔄 Migration Guide - Organizing Your LifeCraft Project

This guide helps you reorganize the project into the proper structure for development.

## 📋 Current vs. Target Structure

### Current Structure (Before)
```
lifecraft-app/
├── App.tsx                    ← Move to src/
├── components/                ← Move to src/
├── styles/                    ← Move to src/
├── utils/                     ← Move to src/
└── (other files stay at root)
```

### Target Structure (After)
```
lifecraft-app/
├── src/
│   ├── App.tsx               ← Moved
│   ├── main.tsx              ← Created
│   ├── components/           ← Moved
│   ├── styles/               ← Moved
│   └── utils/                ← Moved
└── (config files at root)
```

---

## 🚀 Automatic Migration (Recommended)

### Option 1: Using Git (Safest)

```bash
# Create src directory
mkdir -p src

# Move files with Git (preserves history)
git mv App.tsx src/
git mv components src/
git mv styles src/
git mv utils src/

# Verify
ls src/
```

### Option 2: Manual Copy

```bash
# Create src directory
mkdir -p src

# Copy files
cp App.tsx src/
cp -r components src/
cp -r styles src/
cp -r utils src/

# Verify structure
ls -la src/
```

---

## ✅ Verification Checklist

After migration, verify this structure:

```bash
src/
├── App.tsx
├── main.tsx                   # Already created
├── components/
│   ├── AIHub.tsx
│   ├── AuthForm.tsx
│   ├── AuthProvider.tsx
│   ├── CommunityExchange.tsx
│   ├── EmergencyMode.tsx
│   ├── EmergencyPreparedness.tsx
│   ├── ErrorBoundary.tsx
│   ├── KnowledgeHub.tsx
│   ├── LocationTracker.tsx
│   ├── Login.tsx
│   ├── Marketplace.tsx
│   ├── Notifications.tsx
│   ├── OfflineManager.tsx
│   ├── Profile.tsx
│   ├── ShareGuide.tsx
│   ├── ToolsCalculators.tsx
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/
│       └── (35+ component files)
├── styles/
│   └── globals.css
└── utils/
    ├── config.tsx
    └── supabase/
        ├── client.tsx
        └── info.tsx
```

Run this command to verify:

```bash
tree src/ -L 2
```

---

## 🔧 Update Imports (If Needed)

Most imports should work as-is because they're relative. But check these:

### In `src/App.tsx`
✅ These should already be correct:
```typescript
import { Button } from './components/ui/button';
import { AuthProvider } from './components/AuthProvider';
```

### In Component Files
✅ These should already be correct:
```typescript
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';
```

---

## 🧹 Cleanup (Optional)

After successful migration and testing:

```bash
# Remove old files (only if you copied instead of moved)
rm -rf App.tsx components/ styles/ utils/

# Or keep as backup
mkdir backup
mv App.tsx components styles utils backup/
```

---

## 🐛 Troubleshooting Migration

### Issue: "Cannot find module" errors

**Solution:**
```bash
# The imports are relative, they should work
# If not, check file locations:
find src -name "*.tsx" | head -10
```

### Issue: Build fails after migration

**Solution:**
```bash
# Clear build cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstall
rm -rf node_modules
npm install

# Rebuild
npm run dev
```

### Issue: Import paths broken

**Solution:**
The `vite.config.ts` has path alias `@/` pointing to `./src`:
```typescript
// You can use either:
import { Button } from './components/ui/button';  // Relative
import { Button } from '@/components/ui/button';  // Absolute
```

---

## ✨ Post-Migration Testing

After migration, test:

1. **Development server starts:**
   ```bash
   npm start
   ```

2. **App loads in browser:**
   - Open http://localhost:5173
   - No console errors

3. **All features work:**
   - Can navigate between tabs
   - Components render correctly
   - No import errors in DevTools

4. **Build succeeds:**
   ```bash
   npm run build
   ```

---

## 📝 Quick Migration Script

Save this as `migrate.sh` and run with `bash migrate.sh`:

```bash
#!/bin/bash

echo "🚀 Starting LifeCraft migration..."

# Create src directory
mkdir -p src

# Move files
if [ -f "App.tsx" ]; then
    echo "Moving App.tsx..."
    mv App.tsx src/
fi

if [ -d "components" ]; then
    echo "Moving components/..."
    mv components src/
fi

if [ -d "styles" ]; then
    echo "Moving styles/..."
    mv styles src/
fi

if [ -d "utils" ]; then
    echo "Moving utils/..."
    mv utils src/
fi

echo "✅ Migration complete!"
echo ""
echo "Verify structure:"
ls -la src/
echo ""
echo "Test with: npm start"
```

Make it executable:
```bash
chmod +x migrate.sh
./migrate.sh
```

---

## 🎯 Alternative: Fresh Start

If migration is complex, you can:

1. Keep original files as backup
2. Create new structure manually
3. Copy file contents one by one
4. Test incrementally

```bash
# Backup
mkdir backup_original
cp -r App.tsx components styles utils backup_original/

# Start fresh
mkdir -p src/{components,styles,utils}

# Copy file contents manually
# Test each file as you go
```

---

## ✅ Final Checklist

- [ ] `src/` directory created
- [ ] `src/App.tsx` exists
- [ ] `src/main.tsx` exists
- [ ] `src/components/` directory with all components
- [ ] `src/styles/globals.css` exists
- [ ] `src/utils/` directory exists
- [ ] `npm install` completed
- [ ] `.env` file configured
- [ ] `npm start` runs without errors
- [ ] App loads in browser
- [ ] All features accessible
- [ ] No console errors

---

## 🆘 Need Help?

If migration issues persist:

1. **Check exact error message**
2. **Verify file paths**: `find src -type f`
3. **Clear caches**: `rm -rf node_modules/.vite dist`
4. **Reinstall**: `npm install`
5. **Check imports**: Make sure they're relative to file location

---

<div align="center">

**Migration should take < 2 minutes! 🚀**

After migration, see [SETUP.md](./SETUP.md) for running the app.

</div>