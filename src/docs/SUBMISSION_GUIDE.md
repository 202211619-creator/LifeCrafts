# 📤 Submission Guide & Architecture Breakdown

## 🎯 Overview

This guide provides a detailed breakdown of:
1. **Submission Process** - How to submit your work via Pull Request
2. **Architecture Principles** - Service layer vs Components separation
3. **Best Practices** - Following proper code organization

---

## 📋 Steps for Submission

### Step 1: Create a Pull Request from Your Branch

**What is a Pull Request (PR)?**
- A Pull Request is a way to propose changes from your branch to the main codebase
- It allows code review before merging into the master branch
- It creates a record of what changes were made and why

**How to Create a PR:**

#### Option A: Using GitHub Website

1. Go to your repository on GitHub
2. Click on the **"Pull requests"** tab
3. Click the **"New pull request"** button
4. Select branches:
   - **Base branch:** `master` (the branch you want to merge INTO)
   - **Compare branch:** `your-branch-name` (your working branch)
5. Review the changes shown
6. Click **"Create pull request"**

#### Option B: Using Git Command Line

```bash
# 1. Make sure you're on your branch
git branch

# 2. Push your branch to GitHub (if not already pushed)
git push origin your-branch-name

# 3. Go to GitHub to create the PR
# (PRs are created through the GitHub interface)
```

#### Option C: Using VS Code / Cursor

1. Open **Source Control** panel (Ctrl+Shift+G)
2. Click the **three dots** (•••) menu
3. Select **"Pull Request" → "Create Pull Request"**
4. Follow the prompts

---

### Step 2: Make Sure the Base Branch is Master

**⚠️ CRITICAL: Verify Your Branch Settings**

When creating the PR, double-check:

```
Base branch:    master     ← Where changes will go
                  ↑
                merge
                  ↑
Compare branch: your-branch ← Your work
```

**Common Mistakes to Avoid:**
- ❌ Don't set base as your own branch
- ❌ Don't merge master into master
- ❌ Don't compare master with master

**Correct Setup:**
- ✅ Base: `master` (or `main`)
- ✅ Compare: `your-branch-name` (e.g., `feature/activity-5`, `dev/your-name`)

---

### Step 3: Fill Out the PR Title & Description

**Title Format:**

Use clear, descriptive titles:

```
Good Examples:
✅ "Activity #5: Data Fetching Service & Hook Implementation"
✅ "Feature: Add Authentication Service Layer"
✅ "Fix: Correct API error handling in RequestService"

Bad Examples:
❌ "Update"
❌ "Changes"
❌ "Fix stuff"
```

**Description Template:**

```markdown
## 📋 Summary
Brief description of what this PR does.

## 🎯 Activity/Task
- Activity #5: Data Fetching Service & Hook Implementation

## ✨ Changes Made
- Created RequestService for centralized HTTP calls
- Implemented useAuthRequest custom hook
- Added TypeScript interfaces for type safety
- Created example components showing usage

## 📁 Files Added/Modified
- `src/services/RequestService.ts` - HTTP service layer
- `src/hooks/useAuthRequest.ts` - Authentication hook
- `src/interface/*.ts` - TypeScript type definitions
- `src/components/LoginWithHook.tsx` - Example implementation

## 🧪 Testing Done
- Tested login functionality
- Verified error handling
- Confirmed loading states work correctly
- No linter errors

## 📚 Documentation
- Added ACTIVITY_5_IMPLEMENTATION.md
- Added ACTIVITY_5_SUMMARY.md
- Added ACTIVITY_5_QUICK_REFERENCE.md

## ✅ Checklist
- [x] Code follows project structure
- [x] No linter errors
- [x] Documentation updated
- [x] Examples provided
- [x] TypeScript types defined
```

**Then Click "Create Pull Request"**

---

### Step 4: Copy the PR Link and Submit

**After Creating the PR:**

1. **Copy the PR URL** from your browser
   ```
   Example: https://github.com/username/LifeCraft/pull/123
   ```

2. **Prepare Submission Document**

   Create a document with:
   ```
   Student Name: [Your Name]
   Course: IT ELECTIVE 2
   Activity: Activity #5 - Data Fetching Service & Hook Implementation
   
   Pull Request Link:
   https://github.com/username/LifeCraft/pull/123
   
   Summary:
   Implemented a complete data fetching architecture with:
   - RequestService for HTTP calls
   - Custom hooks for state management
   - TypeScript type definitions
   - Example components
   - Comprehensive documentation
   
   Files Submitted: [See PR description]
   ```

3. **Submit to CLMOOC**
   - Upload as a **Word document (.docx)** or **PDF**
   - Include the PR link prominently
   - Add any screenshots if required
   - Submit before deadline

---

## 🏗️ Architecture Principles Breakdown

### Principle 1: Service Layer (Business Logic)

**What is a Service?**
- A service contains **business logic**
- It handles **heavy queries** and **multiple operations**
- It's **NOT a component** (no UI)
- It's **reusable** across the application

**Example: RequestService**

```typescript
// ✅ GOOD: Service handles business logic
// src/services/RequestService.ts

export const post = async <T, D = any>(
  endpoint: string,
  body?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  // Business logic:
  // - Authentication
  // - Error handling
  // - Response formatting
  // - Retry logic
  
  const response = await axiosInstance.post<T>(endpoint, body, {
    headers: {
      ...getAuthHeaders(), // Auth logic
      ...config?.headers,
    },
  });
  
  return handleResponse(response); // Error handling logic
};
```

**Why Services?**
- ✅ Centralized logic
- ✅ Easy to test
- ✅ Reusable across components
- ✅ Single source of truth
- ✅ Easy to maintain

---

### Principle 2: API Layer (Heavy Queries/Multiple Operations)

**What is an API Layer?**
- Handles **heavy database queries**
- Manages **multiple related operations**
- Combines **multiple API calls** into one function
- Contains **complex data transformations**

**Example: Heavy Query in Service**

```typescript
// ✅ GOOD: Service handles complex operations
// src/services/UserService.ts

export class UserService {
  /**
   * Heavy query: Gets user with all related data
   * - User profile
   * - User achievements
   * - User statistics
   * - User preferences
   */
  static async getUserComplete(userId: string) {
    // Multiple API calls combined
    const [profile, achievements, stats, preferences] = await Promise.all([
      get<UserProfile>(`/users/${userId}`),
      get<Achievement[]>(`/users/${userId}/achievements`),
      get<UserStats>(`/users/${userId}/statistics`),
      get<UserPreferences>(`/users/${userId}/preferences`)
    ]);
    
    // Data transformation (business logic)
    return {
      ...profile,
      achievements: achievements.filter(a => a.unlocked),
      level: calculateLevel(stats.points),
      rank: determineRank(stats),
      settings: preferences
    };
  }
}
```

**When to Use Service Layer:**
- 🎯 Multiple API calls needed
- 🎯 Complex data transformations
- 🎯 Business rules to apply
- 🎯 Heavy computations
- 🎯 Caching needed
- 🎯 Authentication/authorization logic

---

### Principle 3: Components (UI Only)

**What is a Component?**
- Components **display UI**
- Components **handle user interaction**
- Components **use hooks/services** (don't implement logic)
- Components are **presentation focused**

**Example: Component Using Service**

```typescript
// ✅ GOOD: Component focuses on UI
// src/components/UserProfile.tsx

function UserProfile() {
  // Use hook (which uses service)
  const { data, isLoading, error } = useUserData();
  
  // UI logic only
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // Render UI
  return (
    <div>
      <Avatar src={data.avatar} />
      <h1>{data.name}</h1>
      <Level level={data.level} />
      <Achievements list={data.achievements} />
    </div>
  );
}
```

**❌ WRONG: Component with Business Logic**

```typescript
// ❌ BAD: Business logic in component
function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // ❌ Don't do this in component!
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      // ❌ Business logic in component!
      const level = Math.floor(data.points / 100);
      const rank = level > 10 ? 'Advanced' : 'Beginner';
      
      setUser({ ...data, level, rank });
    };
    
    fetchData();
  }, []);
  
  return <div>{/* UI */}</div>;
}
```

---

## 📊 Architecture Layers Breakdown

```
┌─────────────────────────────────────────────────────────┐
│                    COMPONENT LAYER                       │
│                     (UI/Presentation)                    │
│  - Display data                                          │
│  - Handle user interaction                               │
│  - Use hooks                                             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓ uses
┌─────────────────────────────────────────────────────────┐
│                      HOOK LAYER                          │
│                   (State Management)                     │
│  - Manage state (data, loading, error)                  │
│  - Provide handler functions                             │
│  - Call services                                         │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓ calls
┌─────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                         │
│                   (Business Logic)                       │
│  - Generic HTTP methods                                  │
│  - Authentication logic                                  │
│  - Error handling                                        │
│  - Data transformation                                   │
│  - Heavy queries                                         │
│  - Multiple API calls                                    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓ uses
┌─────────────────────────────────────────────────────────┐
│                      API LAYER                           │
│                    (HTTP Client)                         │
│  - Axios/Fetch                                           │
│  - Network communication                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Real-World Example: Activity #5

### ✅ Correct Implementation

**1. Service Layer** (`RequestService.ts`)
```typescript
// Business logic: HTTP calls, auth, errors
export const post = async <T, D>(endpoint: string, body?: D) => {
  const response = await axiosInstance.post<T>(endpoint, body, {
    headers: getAuthHeaders() // Auth logic here
  });
  return handleResponse(response); // Error logic here
};
```

**2. Hook Layer** (`useAuthRequest.ts`)
```typescript
// State management
export const useAuthRequest = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await post('/auth/login', credentials);
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { login, data, isLoading, error };
};
```

**3. Component Layer** (`LoginForm.tsx`)
```typescript
// UI only
function LoginForm() {
  const { login, isLoading, error } = useAuthRequest();
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login({ email, password }); // Just call the hook
    }}>
      {/* UI elements */}
    </form>
  );
}
```

---

## 📝 Checklist for Submission

### Code Structure
- [ ] Services contain business logic only
- [ ] Hooks manage state and call services
- [ ] Components focus on UI only
- [ ] No business logic in components
- [ ] No direct API calls in components

### Service Layer
- [ ] Generic, reusable functions
- [ ] Proper error handling
- [ ] Authentication logic centralized
- [ ] TypeScript types used
- [ ] Well documented

### Hook Layer
- [ ] State management with useState
- [ ] Handler functions provided
- [ ] Calls service functions
- [ ] Returns clean interface
- [ ] Handles loading/error states

### Component Layer
- [ ] Uses hooks (not services directly)
- [ ] Displays loading states
- [ ] Displays error messages
- [ ] Handles success cases
- [ ] Clean, readable JSX

### Documentation
- [ ] README with overview
- [ ] Implementation guide
- [ ] Usage examples
- [ ] Quick reference
- [ ] Code comments

### Git & Submission
- [ ] Code pushed to branch
- [ ] Pull request created
- [ ] Base branch is master
- [ ] PR title is descriptive
- [ ] PR description is complete
- [ ] PR link copied
- [ ] Document prepared for CLMOOC
- [ ] Submitted before deadline

---

## 🚀 Quick Submission Commands

```bash
# 1. Check your current branch
git branch

# 2. Add all changes
git add .

# 3. Commit with descriptive message
git commit -m "Activity #5: Complete Data Fetching Service Implementation"

# 4. Push to your branch
git push origin your-branch-name

# 5. Go to GitHub and create PR
# - Base: master
# - Compare: your-branch-name
# - Fill out title and description
# - Click "Create Pull Request"

# 6. Copy the PR URL

# 7. Create submission document with PR link

# 8. Submit to CLMOOC
```

---

## 💡 Pro Tips

### For Pull Requests:
1. **Clear title** - Describe what was done
2. **Detailed description** - List all changes
3. **Link to issues** - If applicable
4. **Add screenshots** - For UI changes
5. **Mention reviewers** - Tag your instructor

### For Architecture:
1. **Keep services pure** - No UI code
2. **Keep components clean** - No business logic
3. **Use hooks as bridge** - Between services and components
4. **Type everything** - Use TypeScript
5. **Document well** - Future you will thank you

### For Submission:
1. **Test everything** - Before creating PR
2. **Check linter** - Fix all errors
3. **Update docs** - Keep them current
4. **Submit early** - Don't wait till last minute
5. **Double-check link** - Make sure PR URL works

---

## 📞 Need Help?

- **Git Issues:** Check Git documentation
- **PR Problems:** Ask on discussion forum
- **Code Questions:** Review Activity #5 docs
- **Architecture Doubts:** See examples in codebase

---

## ✅ Summary

**Remember the Golden Rules:**

1. **Services = Business Logic** (heavy queries, multiple operations)
2. **Hooks = State Management** (bridge between service and component)
3. **Components = UI Only** (presentation, no business logic)
4. **PR = master ← your-branch** (base must be master)
5. **Submit = PR link + document to CLMOOC**

---

*Last Updated: November 10, 2025*
*Course: IT ELECTIVE 2*
*Activity: #5 - Data Fetching Service & Hook Implementation*

