# 📁 LifeCraft - File Structure Guide

## Current Project Structure

```
lifecraft-app/
│
├── 📄 Configuration Files (Root Level)
│   ├── package.json              # NPM dependencies and scripts
│   ├── vite.config.ts           # Vite bundler configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tsconfig.node.json       # TypeScript config for Node
│   ├── postcss.config.js        # PostCSS configuration
│   ├── .eslintrc.cjs            # ESLint configuration
│   ├── .gitignore               # Git ignore rules
│   ├── .env.example             # Environment variables template
│   └── .env                     # Your local env vars (create this)
│
├── 📄 Documentation (Root Level)
│   ├── README.md                        # Main documentation
│   ├── SETUP.md                         # Quick setup guide
│   ├── FILE_STRUCTURE.md                # This file
│   ├── IMPLEMENTATION_SUMMARY.md        # Feature implementation details
│   ├── LocationTracker_Flow_Documentation.md
│   ├── CRITICAL_BUGS_FIXED.md
│   ├── Attributions.md
│   └── guidelines/
│       └── Guidelines.md                # Development guidelines
│
├── 📂 src/ - APPLICATION SOURCE CODE
│   │
│   ├── main.tsx                 # ⭐ Entry point - renders App
│   ├── App.tsx                  # ⭐ Main app component
│   │
│   ├── 📂 components/           # React components
│   │   │
│   │   ├── Core Features:
│   │   ├── AuthProvider.tsx     # 🔐 Authentication context
│   │   ├── AuthForm.tsx         # Login/signup form
│   │   ├── KnowledgeHub.tsx     # 📚 Survival guides
│   │   ├── ToolsCalculators.tsx # 🧮 Calculators
│   │   ├── EmergencyPreparedness.tsx  # 🌪️ Emergency alerts
│   │   ├── CommunityExchange.tsx      # 👥 Community posts
│   │   ├── EmergencyMode.tsx    # 🚨 SOS interface
│   │   ├── LocationTracker.tsx  # 📍 GPS tracking
│   │   ├── AIHub.tsx            # 🤖 AI assistant
│   │   ├── OfflineManager.tsx   # 📥 Offline downloads
│   │   ├── Profile.tsx          # 👤 User profile
│   │   ├── Notifications.tsx    # 🔔 Notification center
│   │   │
│   │   ├── Utility Components:
│   │   ├── ErrorBoundary.tsx
│   │   ├── ShareGuide.tsx
│   │   ├── Login.tsx
│   │   ├── Marketplace.tsx
│   │   │
│   │   ├── 📂 ui/              # shadcn/ui components (35+ files)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (30+ more components)
│   │   │
│   │   └── 📂 figma/
│   │       └── ImageWithFallback.tsx  # Protected component
│   │
│   ├── 📂 styles/
│   │   └── globals.css          # Tailwind v4 + design tokens
│   │
│   └── 📂 utils/
│       ├── config.tsx           # App configuration
│       └── supabase/
│           ├── client.tsx       # Supabase client setup
│           └── info.tsx         # Supabase utilities
│
├── 📂 public/                   # Static assets
│   └── favicon.svg              # App icon
│
├── 📂 supabase/                 # Backend (Supabase Edge Functions)
│   └── functions/
│       └── server/
│           ├── index.tsx        # Main API endpoint
│           └── kv_store.tsx     # Key-value storage
│
└── 📂 dist/                     # Production build (generated)
    └── (built files)

```

---

## 🎯 Key Files Explained

### Entry Point Flow

1. **`index.html`** → Root HTML template
2. **`src/main.tsx`** → Renders React app
3. **`src/App.tsx`** → Main application component
4. **`src/components/AuthProvider.tsx`** → Wraps app with auth

### Core Application Files

#### `src/App.tsx`
- Main application shell
- Tab navigation system
- Header with search and notifications
- Emergency mode toggle
- User profile dropdown
- Footer with stats

#### `src/components/AuthProvider.tsx`
- Google OAuth integration
- Session management
- User profile fetching
- Sign in/out handlers

#### `src/components/KnowledgeHub.tsx`
- 1,247+ survival guides
- Category navigation
- Search functionality
- Offline downloads
- Guide viewer

#### `src/components/EmergencyPreparedness.tsx`
- Real-time emergency alerts
- PAGASA/MMDA/NDRRMC integration
- Survival pack downloads
- Emergency checklists
- Disaster guides

#### `src/components/CommunityExchange.tsx`
- Full CRUD operations
- File uploads
- Real-time updates
- Categories and filters
- Facebook-like features

#### `src/components/LocationTracker.tsx`
- GPS tracking
- Google Maps integration
- Family member tracking
- Emergency location sharing
- Check-in system

---

## 🔧 Configuration Files

### `package.json`
- **Purpose**: NPM package manifest
- **Contains**: Dependencies, scripts, project metadata
- **Key scripts**:
  - `npm start` - Start dev server
  - `npm run build` - Build for production
  - `npm run preview` - Preview build

### `vite.config.ts`
- **Purpose**: Vite bundler configuration
- **Features**:
  - Path aliases (`@/` → `./src`)
  - Dev server settings (port 5173)
  - Build optimization
  - Code splitting

### `tsconfig.json`
- **Purpose**: TypeScript configuration
- **Settings**:
  - Target ES2020
  - Strict type checking
  - React JSX transform
  - Path mapping

### `.env` (You create this)
```env
VITE_SUPABASE_URL=https://zlhwdelmquesgquoppad.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

---

## 📦 Dependencies Overview

### Core Framework
- `react` - UI library
- `react-dom` - DOM renderer
- `typescript` - Type safety
- `vite` - Build tool

### UI Components
- `@radix-ui/*` - Headless UI primitives (35+ packages)
- `lucide-react` - Icon library
- `tailwindcss` - Styling
- `sonner` - Toast notifications

### Backend
- `@supabase/supabase-js` - Database & auth
- `react-hook-form` - Form management
- `zod` - Validation

### Utilities
- `date-fns` - Date formatting
- `clsx` - Class name utilities
- `recharts` - Charts

---

## 🔄 Import Patterns

### Relative Imports (within same module)
```typescript
import { Button } from './components/ui/button';
import { useAuth } from './components/AuthProvider';
```

### Absolute Imports (with @ alias)
```typescript
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
```

### External Packages
```typescript
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';
```

---

## 🚀 Build Process

### Development
```bash
npm start
# → Vite dev server at http://localhost:5173
# → Hot module replacement enabled
# → Source maps for debugging
```

### Production
```bash
npm run build
# → TypeScript compilation
# → Vite bundling
# → Optimization & minification
# → Output to dist/
```

### Preview Build
```bash
npm run preview
# → Serves production build locally
# → Test before deployment
```

---

## 📁 File Naming Conventions

### Components
- **Format**: `PascalCase.tsx`
- **Examples**: `KnowledgeHub.tsx`, `EmergencyMode.tsx`
- **Location**: `src/components/`

### UI Components (shadcn)
- **Format**: `kebab-case.tsx`
- **Examples**: `button.tsx`, `dropdown-menu.tsx`
- **Location**: `src/components/ui/`

### Utilities
- **Format**: `camelCase.tsx` or `kebab-case.tsx`
- **Examples**: `config.tsx`, `client.tsx`
- **Location**: `src/utils/`

### Styles
- **Format**: `kebab-case.css`
- **Example**: `globals.css`
- **Location**: `src/styles/`

---

## 🔒 Protected Files

**Do not modify:**
- `src/components/figma/ImageWithFallback.tsx`

**Auto-generated (do not edit):**
- `dist/*`
- `node_modules/*`
- `.vite/*`

---

## 📝 Adding New Features

### 1. New Component
```bash
# Create file
touch src/components/MyFeature.tsx

# Import in App.tsx
import { MyFeature } from './components/MyFeature';
```

### 2. New UI Component (shadcn)
```bash
# Use existing shadcn components from src/components/ui/
import { Card } from './components/ui/card';
```

### 3. New Utility
```bash
# Create file
touch src/utils/myUtility.tsx

# Import where needed
import { myFunction } from './utils/myUtility';
```

### 4. New Style
```typescript
// Add to src/styles/globals.css
// Use Tailwind v4 syntax
```

---

## 🗂️ Code Organization Tips

### Component Structure
```typescript
// Imports
import React from 'react';
import { Button } from './ui/button';

// Types
interface Props {
  title: string;
}

// Component
export function MyComponent({ title }: Props) {
  // State
  const [count, setCount] = useState(0);
  
  // Handlers
  const handleClick = () => setCount(count + 1);
  
  // Render
  return <Button onClick={handleClick}>{title}</Button>;
}
```

### File Organization
```
Feature/
├── index.tsx           # Main component
├── types.ts           # TypeScript types
├── utils.ts           # Helper functions
└── components/        # Sub-components
    ├── Header.tsx
    └── Footer.tsx
```

---

## 🔍 Quick Reference

| Need to... | Go to... |
|------------|----------|
| Add a dependency | `package.json` |
| Configure build | `vite.config.ts` |
| Add environment variable | `.env` |
| Modify main app | `src/App.tsx` |
| Create component | `src/components/` |
| Add styles | `src/styles/globals.css` |
| Configure TypeScript | `tsconfig.json` |
| Add static asset | `public/` |
| View documentation | `README.md` or `SETUP.md` |

---

<div align="center">

**Understanding the structure makes development faster! 🚀**

For setup instructions, see [SETUP.md](./SETUP.md)

</div>