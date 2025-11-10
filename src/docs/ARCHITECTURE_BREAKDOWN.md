# 🏗️ Architecture Breakdown - Service vs Components

## 📋 Quick Reference

```
SERVICE LAYER     = Business Logic (NOT components)
API/HOOKS        = Heavy Queries (multiple operations)
COMPONENTS       = UI Only (presentation)
```

---

## 🎯 The 3-Layer Architecture

### Visual Overview

```
┌────────────────────────────────────────────────────────────┐
│                     👤 USER INTERACTION                     │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────────────┐
│  LAYER 1: COMPONENTS (Presentation Layer)                  │
│  📱 Purpose: Display UI & Handle User Events               │
│  ❌ NOT: Business logic, API calls, complex calculations   │
│                                                             │
│  Example: LoginForm.tsx                                    │
│  - Shows input fields                                      │
│  - Shows loading spinner                                   │
│  - Shows error messages                                    │
│  - Calls hook functions                                    │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ↓ uses
┌────────────────────────────────────────────────────────────┐
│  LAYER 2: HOOKS (State Management Layer)                   │
│  🔄 Purpose: Manage state & connect components to services │
│  ❌ NOT: Direct HTTP calls, complex business rules         │
│                                                             │
│  Example: useAuthRequest.ts                                │
│  - Manages state (data, isLoading, error)                 │
│  - Provides handler functions                              │
│  - Calls service methods                                   │
│  - Transforms data for components                          │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ↓ calls
┌────────────────────────────────────────────────────────────┐
│  LAYER 3: SERVICES (Business Logic Layer)                  │
│  🔧 Purpose: Handle ALL business logic                     │
│  ✅ YES: API calls, authentication, complex operations     │
│                                                             │
│  Example: RequestService.ts                                │
│  - Generic HTTP methods                                    │
│  - Authentication logic                                    │
│  - Error handling                                          │
│  - Data validation                                         │
│  - Heavy queries (multiple API calls)                      │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ↓ uses
┌────────────────────────────────────────────────────────────┐
│  EXTERNAL: API / DATABASE                                  │
│  🌐 Your backend server                                    │
└────────────────────────────────────────────────────────────┘
```

---

## 🔍 Detailed Breakdown

### LAYER 1: Components (UI/Presentation)

#### What Components Should Do:
✅ **DO:**
- Render JSX/UI elements
- Handle user events (onClick, onChange)
- Display loading states
- Display error messages
- Display success messages
- Use hooks to get data
- Pass data to child components
- Handle form submissions (by calling hooks)

❌ **DON'T:**
- Make HTTP requests (fetch, axios)
- Access localStorage directly for auth
- Calculate business logic
- Transform API data
- Handle authentication
- Manage complex state logic

#### Example: Good Component

```typescript
// ✅ GOOD: Component focuses on UI
import { useAuthRequest } from '@/hooks/useAuthRequest';

function LoginForm() {
  const { login, isLoading, error, data } = useAuthRequest();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simple event handler - just calls hook
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password }); // Hook handles the rest
  };

  // UI-focused rendering
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <Input 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      <Button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      {error && <Alert>{error}</Alert>}
      {data && <SuccessMessage>Login successful!</SuccessMessage>}
    </form>
  );
}
```

#### Example: Bad Component (DON'T DO THIS)

```typescript
// ❌ BAD: Component has business logic
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // ❌ WRONG: Direct API call in component
    const token = localStorage.getItem('token');
    
    // ❌ WRONG: HTTP request in component
    const response = await fetch('https://api.example.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ❌ Auth logic in component
      },
      body: JSON.stringify({ email, password })
    });

    // ❌ WRONG: Business logic in component
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data)); // ❌ Storage logic
      // Calculate user level (business logic)
      const level = Math.floor(data.points / 100); // ❌ Calculation in component
    }

    setIsLoading(false);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

---

### LAYER 2: Hooks (State Management)

#### What Hooks Should Do:
✅ **DO:**
- Manage state with useState
- Provide handler functions
- Call service methods
- Transform data into component-friendly format
- Handle loading/error states
- Manage localStorage for simple data
- Provide clean interface to components

❌ **DON'T:**
- Make direct HTTP requests (use services)
- Implement complex business rules
- Directly manipulate DOM
- Handle UI rendering

#### Example: Good Hook

```typescript
// ✅ GOOD: Hook manages state and calls service
import { useState } from 'react';
import { post } from '@/services/RequestService'; // Use service!

export const useAuthRequest = () => {
  // State management
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call service (not direct HTTP)
      const response = await post('/auth/login', credentials);
      
      // Simple data transformation
      setData(response);
      
      // Simple storage operation
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Return clean interface
  return { login, data, isLoading, error };
};
```

---

### LAYER 3: Services (Business Logic)

#### What Services Should Do:
✅ **DO:**
- Make HTTP requests
- Handle authentication (headers, tokens)
- Validate data
- Transform data
- Handle errors
- Implement retry logic
- Cache responses
- Combine multiple API calls
- Implement complex business rules
- Handle heavy queries

❌ **DON'T:**
- Manage React state (useState, etc.)
- Render UI
- Handle user events directly

#### Example: Good Service

```typescript
// ✅ GOOD: Service handles all business logic
import axios from 'axios';
import { BASE_URL } from '@/constants/api';

// Generic POST method with business logic
export const post = async <T, D = any>(
  endpoint: string,
  body?: D
): Promise<T> => {
  try {
    // Business logic: Get authentication token
    const token = localStorage.getItem('token');
    
    // Business logic: Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make HTTP request
    const response = await axios.post<T>(
      `${BASE_URL}${endpoint}`,
      body,
      { headers }
    );

    // Business logic: Validate response
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    // Business logic: Handle errors
    throw new Error(`HTTP Error: ${response.status}`);
  } catch (error) {
    // Business logic: Format error messages
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Request failed'
      );
    }
    throw error;
  }
};
```

#### Example: Service with Heavy Queries

```typescript
// ✅ GOOD: Service handles multiple operations
export class UserService {
  /**
   * Heavy query: Combines multiple API calls
   * This is business logic - NOT for components!
   */
  static async getUserDashboard(userId: string) {
    // Multiple API calls in parallel
    const [profile, stats, achievements, guides] = await Promise.all([
      get(`/users/${userId}`),
      get(`/users/${userId}/stats`),
      get(`/users/${userId}/achievements`),
      get(`/users/${userId}/guides`)
    ]);

    // Business logic: Calculate derived data
    const level = this.calculateLevel(stats.points);
    const rank = this.determineRank(level, achievements.length);
    const progress = this.calculateProgress(guides, stats);

    // Business logic: Transform and combine data
    return {
      user: profile,
      level,
      rank,
      progress,
      recentAchievements: achievements.slice(0, 5),
      recommendedGuides: this.getRecommendations(guides, profile.interests)
    };
  }

  // Business logic methods
  private static calculateLevel(points: number): number {
    return Math.floor(points / 100);
  }

  private static determineRank(level: number, achievementCount: number): string {
    if (level > 20 && achievementCount > 50) return 'Master';
    if (level > 10) return 'Advanced';
    if (level > 5) return 'Intermediate';
    return 'Beginner';
  }

  private static calculateProgress(guides: any[], stats: any): number {
    // Complex business logic here
    return (stats.completedGuides / guides.length) * 100;
  }

  private static getRecommendations(guides: any[], interests: string[]): any[] {
    // Complex business logic here
    return guides.filter(g => 
      interests.some(interest => g.tags.includes(interest))
    ).slice(0, 10);
  }
}
```

---

## 📊 Comparison Table

| Aspect | Component | Hook | Service |
|--------|-----------|------|---------|
| **Purpose** | Display UI | Manage state | Business logic |
| **Contains** | JSX, event handlers | useState, useEffect | HTTP calls, algorithms |
| **Uses** | Hooks | Services | Axios/Fetch |
| **State** | Local UI state only | Data/loading/error state | No state |
| **HTTP Calls** | ❌ Never | ❌ Never (use service) | ✅ Yes |
| **Business Logic** | ❌ No | ⚠️ Minimal | ✅ Yes |
| **Authentication** | ❌ No | ⚠️ Store token only | ✅ Yes (headers) |
| **Data Transform** | ❌ No | ⚠️ Simple only | ✅ Yes (complex) |
| **Example File** | `LoginForm.tsx` | `useAuthRequest.ts` | `RequestService.ts` |

---

## 🎓 Real-World Scenarios

### Scenario 1: User Login

**❌ WRONG Way (Everything in Component):**
```typescript
// Component doing everything - BAD!
function LoginForm() {
  const handleLogin = async () => {
    const response = await fetch('/api/login', {...}); // ❌
    const data = await response.json(); // ❌
    localStorage.setItem('token', data.token); // ❌
    if (data.user.isAdmin) { /* business logic */ } // ❌
  };
}
```

**✅ CORRECT Way (Separated Layers):**

```typescript
// Service (RequestService.ts)
export const post = async (endpoint, body) => {
  const token = localStorage.getItem('token');
  return await axios.post(endpoint, body, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Hook (useAuthRequest.ts)
export const useAuthRequest = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const login = async (credentials) => {
    setIsLoading(true);
    const response = await post('/auth/login', credentials);
    setData(response);
    setIsLoading(false);
  };
  
  return { login, data, isLoading };
};

// Component (LoginForm.tsx)
function LoginForm() {
  const { login, isLoading } = useAuthRequest();
  
  return (
    <form onSubmit={() => login({ email, password })}>
      <button disabled={isLoading}>Login</button>
    </form>
  );
}
```

---

### Scenario 2: Heavy Query (Multiple API Calls)

**Task:** Get user profile with achievements, stats, and guides

**✅ CORRECT Implementation:**

```typescript
// Service Layer - Handle heavy query
export class DashboardService {
  static async getDashboardData(userId: string) {
    // Multiple API calls
    const [user, achievements, stats, guides] = await Promise.all([
      get(`/users/${userId}`),
      get(`/users/${userId}/achievements`),
      get(`/users/${userId}/stats`),
      get(`/users/${userId}/guides`)
    ]);
    
    // Business logic: Transform data
    return {
      user,
      achievements: achievements.filter(a => a.unlocked),
      level: Math.floor(stats.points / 100),
      completionRate: (stats.completed / guides.length) * 100
    };
  }
}

// Hook Layer - Manage state
export const useDashboard = (userId: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    DashboardService.getDashboardData(userId)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [userId]);
  
  return { data, isLoading };
};

// Component Layer - Display UI
function Dashboard() {
  const { data, isLoading } = useDashboard(userId);
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      <Profile user={data.user} />
      <Level level={data.level} />
      <Achievements list={data.achievements} />
      <Progress rate={data.completionRate} />
    </div>
  );
}
```

---

## 🔑 Key Principles Summary

### 1. **Service = Business Logic, NOT Components**
- Services contain business rules
- Services handle complex operations
- Services are NOT React components
- Services have NO JSX

### 2. **API/Heavy Queries = Multiple Operations**
- Combine multiple API calls
- Transform and process data
- Calculate derived values
- Implement caching

### 3. **Components = UI Only**
- Display data
- Handle user interaction
- Use hooks (not services directly)
- Keep it simple and clean

---

## ✅ Quick Checklist

**Before Writing Code, Ask:**

- [ ] Is this UI? → **Component**
- [ ] Is this state management? → **Hook**
- [ ] Is this business logic? → **Service**
- [ ] Is this a heavy query? → **Service**
- [ ] Does it need multiple API calls? → **Service**
- [ ] Does it calculate something complex? → **Service**

**Code Review Checklist:**

- [ ] Components have NO fetch/axios calls
- [ ] Components have NO business logic
- [ ] Hooks use services (not direct HTTP)
- [ ] Services have NO React state
- [ ] Services have NO JSX
- [ ] Heavy queries are in services

---

## 🎯 Your Activity #5 Architecture

```
LoginWithHook.tsx (Component)
    ↓ uses
useAuthRequest.ts (Hook)
    ↓ calls
RequestService.ts (Service)
    ↓ uses
Axios (HTTP Client)
    ↓ calls
API Server
```

**This is the CORRECT architecture!** ✅

---

*Last Updated: November 10, 2025*
*Course: IT ELECTIVE 2*

