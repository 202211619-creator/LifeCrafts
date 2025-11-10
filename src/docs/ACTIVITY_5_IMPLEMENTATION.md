# Activity #5: Data Fetching Service & Hook Implementation

## 📋 Overview

This implementation creates a **structured and reusable** way to handle all API calls in the LifeCraft project. It separates the **logic for making requests** from the **logic for using the data** in components.

## 🎯 Core Principle

**Components should NEVER call `fetch()` or import HTTP libraries directly.**

Instead, they use custom hooks that internally call a centralized RequestService.

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Component     │  ← Uses hooks, displays UI
└────────┬────────┘
         │
         ↓ Calls hook
┌─────────────────┐
│  Custom Hook    │  ← Manages state (data, loading, error)
│ (useAuthRequest)│  ← Calls RequestService
└────────┬────────┘
         │
         ↓ Makes HTTP request
┌─────────────────┐
│ RequestService  │  ← Generic HTTP methods (get, post, etc.)
│                 │  ← Handles auth headers, errors
└────────┬────────┘
         │
         ↓ Uses
┌─────────────────┐
│     Axios       │  ← HTTP client library
└─────────────────┘
```

---

## 📁 File Structure

```
src/
├── constants/
│   └── api.ts                    # API configuration (BASE_URL, timeout)
├── services/
│   └── RequestService.ts         # Generic HTTP methods (get, post, put, delete)
├── interface/
│   ├── AuthPayload.ts            # Request data types
│   ├── AuthResponse.ts           # Response data types
│   ├── ApiResponse.ts            # Generic API response types
│   └── index.ts                  # Central export point
├── hooks/
│   └── useAuthRequest.ts         # Custom hook for authentication
├── components/
│   └── LoginWithHook.tsx         # Example implementation in component
└── examples/
    └── HookUsageExample.tsx      # Multiple usage examples
```

---

## 📝 Phase-by-Phase Implementation

### **Phase 1: Setup and Service Creation**

#### 1.1 Install HTTP Client
```bash
npm install axios
```

#### 1.2 Create API Constants (`src/constants/api.ts`)
```typescript
export const BASE_URL = 'https://api.yourproject.com/v1';
export const API_TIMEOUT = 30000;
```

#### 1.3 Create Request Service (`src/services/RequestService.ts`)

**Key Features:**
- ✅ Generic HTTP methods: `get`, `post`, `put`, `delete`, `patch`
- ✅ Automatic auth header attachment (JWT from localStorage)
- ✅ Centralized error handling
- ✅ Response formatting
- ✅ TypeScript generic types for type safety

**Example Usage:**
```typescript
import { post } from '../services/RequestService';

const response = await post<AuthResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

---

### **Phase 2: Defining Types**

#### 2.1 Create Interface Folder (`src/interface/`)

**Files Created:**
- `AuthPayload.ts` - Request data structures
- `AuthResponse.ts` - Response data structures  
- `ApiResponse.ts` - Generic API response types
- `index.ts` - Central export

**Example Types:**
```typescript
// AuthPayload.ts
export interface LoginPayload {
  email: string;
  password: string;
}

// AuthResponse.ts
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
```

---

### **Phase 3: Creating Custom Hooks**

#### 3.1 Create Custom Hook (`src/hooks/useAuthRequest.ts`)

**Hook Features:**
- ✅ State management with `useState`
  - `data` - Response data
  - `isLoading` - Loading indicator
  - `error` - Error messages
- ✅ Request handlers (login, register, logout, resetPassword)
- ✅ Calls RequestService functions
- ✅ Transforms data into component-friendly format
- ✅ Manages localStorage for tokens

**Hook Interface:**
```typescript
interface UseAuthRequestReturn {
  // State
  data: AuthResponse | LogoutResponse | ResetPasswordResponse | null;
  isLoading: boolean;
  error: string | null;

  // Handler functions
  login: (credentials: LoginPayload) => Promise<void>;
  register: (credentials: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;

  // Utility functions
  clearError: () => void;
  clearData: () => void;
}
```

---

### **Phase 4: Using the Hook in Components**

#### 4.1 Import and Use the Hook

```typescript
import { useAuthRequest } from '../hooks/useAuthRequest';
import { LoginPayload } from '../interface';

export function LoginComponent() {
  // Step 1: Use the hook
  const { login, data, isLoading, error } = useAuthRequest();

  // Step 2: Create handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  // Step 3: Display status in UI
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" disabled={isLoading} />
      <input type="password" disabled={isLoading} />
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

#### 4.2 Key UI Patterns

**Display Spinner:**
```typescript
{isLoading && <Spinner />}
```

**Display Error:**
```typescript
{error && <Alert variant="destructive">{error}</Alert>}
```

**Handle Success:**
```typescript
useEffect(() => {
  if (data) {
    toast.success('Login successful!');
    navigate('/dashboard');
  }
}, [data]);
```

---

## 🚀 Usage Examples

### Example 1: Simple Login
```typescript
const { login, isLoading, error } = useAuthRequest();

const handleLogin = async () => {
  await login({
    email: 'user@example.com',
    password: 'password123'
  });
};

return (
  <button onClick={handleLogin} disabled={isLoading}>
    {isLoading ? 'Logging in...' : 'Login'}
  </button>
);
```

### Example 2: Registration
```typescript
const { register, data, isLoading, error } = useAuthRequest();

const handleRegister = async () => {
  await register({
    email: 'new@example.com',
    password: 'secure123',
    username: 'newuser'
  });
};
```

### Example 3: Logout
```typescript
const { logout, isLoading } = useAuthRequest();

const handleLogout = async () => {
  await logout();
  // localStorage is automatically cleared
};
```

---

## ✅ Implementation Checklist

### Phase 1: Setup ✅
- [x] Install Axios
- [x] Create `constants/api.ts`
- [x] Create `services/RequestService.ts`
- [x] Implement generic HTTP methods (get, post, put, delete, patch)
- [x] Add authentication header handling
- [x] Add error handling

### Phase 2: Types ✅
- [x] Create `interface/` folder
- [x] Define `AuthPayload.ts`
- [x] Define `AuthResponse.ts`
- [x] Define `ApiResponse.ts`
- [x] Create central export in `index.ts`

### Phase 3: Custom Hook ✅
- [x] Create `hooks/useAuthRequest.ts`
- [x] Implement `useState` for state management
- [x] Create request handlers (login, register, logout, resetPassword)
- [x] Call RequestService functions
- [x] Add utility functions (clearError, clearData)

### Phase 4: Component Integration ✅
- [x] Create example component (`LoginWithHook.tsx`)
- [x] Import and use custom hook
- [x] Trigger requests on events
- [x] Display loading state
- [x] Display errors
- [x] Handle success scenarios
- [x] Create usage examples (`HookUsageExample.tsx`)

---

## 🎓 Key Benefits

1. **Separation of Concerns**
   - Components focus on UI
   - Hooks manage state and data flow
   - Service handles HTTP logic

2. **Reusability**
   - RequestService can be used by any hook
   - Hooks can be used by any component
   - No code duplication

3. **Maintainability**
   - Change API URL in one place
   - Update auth logic in RequestService
   - Easy to add new endpoints

4. **Type Safety**
   - Full TypeScript support
   - Autocomplete for request/response types
   - Compile-time error checking

5. **Centralized Error Handling**
   - Consistent error messages
   - Single point for logging
   - Easy to add error tracking (Sentry, etc.)

6. **Testability**
   - Mock RequestService in tests
   - Test hooks independently
   - Test components without real API

---

## 🔐 Authentication Flow

1. User submits login form
2. Component calls `login()` from hook
3. Hook calls `post()` from RequestService
4. RequestService makes HTTP request with axios
5. Response received → token stored in localStorage
6. Hook updates state (`data`, `isLoading`, `error`)
7. Component re-renders with new state
8. Future requests automatically include JWT token

---

## 🎯 Goal Achievement

✅ **Goal 1:** Components never call `fetch` directly
✅ **Goal 2:** All HTTP logic in RequestService
✅ **Goal 3:** State management in custom hooks
✅ **Goal 4:** Type-safe API calls
✅ **Goal 5:** Centralized error handling
✅ **Goal 6:** Automatic authentication
✅ **Goal 7:** Component-friendly interface

---

## 📚 Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| `constants/api.ts` | API configuration | 7 |
| `services/RequestService.ts` | HTTP service layer | 165 |
| `interface/AuthPayload.ts` | Request types | 23 |
| `interface/AuthResponse.ts` | Response types | 28 |
| `interface/ApiResponse.ts` | Generic API types | 20 |
| `hooks/useAuthRequest.ts` | Authentication hook | 173 |
| `components/LoginWithHook.tsx` | Example integration | 165 |
| `examples/HookUsageExample.tsx` | Usage examples | 150+ |

**Total:** ~750+ lines of production-ready code

---

## 🎉 Implementation Complete!

This implementation provides a **solid foundation** for making API calls throughout the LifeCraft application. You can now:

1. Create new hooks for other endpoints (e.g., `useProductsRequest`, `useUserRequest`)
2. Add more methods to RequestService as needed
3. Extend types for new API endpoints
4. Build components that consume the hooks

**Next Steps:**
- Create additional hooks for other modules (Marketplace, Community, etc.)
- Integrate with actual API endpoints
- Add request caching if needed
- Add request cancellation for cleanup
- Add retry logic for failed requests

---

## 📞 Support

For questions about this implementation, refer to:
- `src/examples/HookUsageExample.tsx` - Multiple usage patterns
- `src/components/LoginWithHook.tsx` - Full component example
- This documentation file

**Happy Coding! 🚀**

