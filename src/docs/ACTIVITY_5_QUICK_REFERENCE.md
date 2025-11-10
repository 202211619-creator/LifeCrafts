# 🚀 Activity #5 - Quick Reference Guide

## 📋 TL;DR - What You Need to Know

### The Pattern (3 Simple Steps)

```typescript
// 1. Import the hook
import { useAuthRequest } from '@/hooks/useAuthRequest';

// 2. Use it in your component
const { login, isLoading, error, data } = useAuthRequest();

// 3. Call it when needed
await login({ email: 'user@example.com', password: 'pass123' });
```

---

## 🎯 Quick Examples

### Example 1: Basic Login Button

```typescript
import { useAuthRequest } from '@/hooks/useAuthRequest';

function LoginButton() {
  const { login, isLoading } = useAuthRequest();
  
  return (
    <button 
      onClick={() => login({ email: 'test@test.com', password: '123' })}
      disabled={isLoading}
    >
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Example 2: Login Form with Error Handling

```typescript
import { useAuthRequest } from '@/hooks/useAuthRequest';

function LoginForm() {
  const { login, isLoading, error } = useAuthRequest();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={isLoading}>Login</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Example 3: Login with Success Handling

```typescript
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
  const { login, data, isLoading, error } = useAuthRequest();
  const navigate = useNavigate();
  
  // Handle successful login
  useEffect(() => {
    if (data && 'user' in data) {
      console.log('Login successful!', data.user);
      navigate('/dashboard');
    }
  }, [data, navigate]);
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login({ email: 'user@test.com', password: '123' });
    }}>
      {/* form fields */}
      {isLoading && <Spinner />}
      {error && <Alert>{error}</Alert>}
    </form>
  );
}
```

---

## 🔧 Available Hook Functions

### `useAuthRequest` Hook

```typescript
const {
  // State
  data,        // Response data (null initially)
  isLoading,   // Boolean - true during request
  error,       // Error message string (null if no error)
  
  // Actions
  login,           // (credentials) => Promise<void>
  register,        // (credentials) => Promise<void>
  logout,          // () => Promise<void>
  resetPassword,   // (payload) => Promise<void>
  
  // Utilities
  clearError,      // () => void
  clearData        // () => void
} = useAuthRequest();
```

---

## 📝 Common Patterns

### Pattern 1: Show/Hide Based on Loading

```typescript
{isLoading ? <Spinner /> : <Button>Submit</Button>}
```

### Pattern 2: Disable During Loading

```typescript
<button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### Pattern 3: Display Error Message

```typescript
{error && <Alert variant="destructive">{error}</Alert>}
```

### Pattern 4: Clear Error on Input Change

```typescript
<input 
  onChange={(e) => {
    setValue(e.target.value);
    clearError(); // Clear error when user types
  }}
/>
```

### Pattern 5: Handle Success

```typescript
useEffect(() => {
  if (data) {
    toast.success('Success!');
    // Do something with data
  }
}, [data]);
```

---

## 🎨 UI States Cheatsheet

| State | UI Action |
|-------|-----------|
| `isLoading === true` | Show spinner, disable buttons |
| `error !== null` | Show error alert/message |
| `data !== null` | Show success, redirect, etc. |
| `!isLoading && !error` | Form is ready for input |

---

## 🔐 Authentication Flow

```
User submits form
      ↓
Component calls: await login({ email, password })
      ↓
Hook sets: isLoading = true
      ↓
Hook calls: RequestService.post('/auth/login', { email, password })
      ↓
RequestService attaches JWT token (if exists)
      ↓
Axios makes HTTP request
      ↓
Response received
      ↓
Hook stores token in localStorage
      ↓
Hook sets: data = response, isLoading = false
      ↓
Component re-renders with new state
      ↓
User sees success message / redirected
```

---

## 📁 File Structure

```
src/
├── constants/api.ts              # BASE_URL, API_TIMEOUT
├── services/RequestService.ts    # get, post, put, delete
├── interface/
│   ├── AuthPayload.ts           # LoginPayload, RegisterPayload
│   ├── AuthResponse.ts          # AuthResponse, User
│   └── index.ts                 # Export all types
└── hooks/
    └── useAuthRequest.ts        # Custom hook
```

---

## 🚦 Request Flow Diagram

```
┌─────────────┐
│  Component  │
│   calls:    │
│   login()   │
└──────┬──────┘
       │
       ↓
┌──────────────┐
│  Hook Layer  │
│  manages:    │
│  - data      │
│  - isLoading │
│  - error     │
└──────┬───────┘
       │
       ↓
┌────────────────┐
│ RequestService │
│  handles:      │
│  - HTTP call   │
│  - Auth header │
│  - Errors      │
└────────┬───────┘
         │
         ↓
   ┌─────────┐
   │  Axios  │
   │   →     │
   │   API   │
   └─────────┘
```

---

## 💡 Do's and Don'ts

### ✅ DO

```typescript
// ✅ Use the custom hook
const { login, isLoading } = useAuthRequest();

// ✅ Handle loading state
{isLoading && <Spinner />}

// ✅ Display errors
{error && <Alert>{error}</Alert>}

// ✅ Use useEffect for success
useEffect(() => {
  if (data) { /* handle success */ }
}, [data]);
```

### ❌ DON'T

```typescript
// ❌ Don't use fetch directly
await fetch('/api/login', { ... });

// ❌ Don't import axios in components
import axios from 'axios';

// ❌ Don't wrap in try-catch (hook handles errors)
try {
  await login(data);
} catch (e) {
  // Not needed!
}

// ❌ Don't forget to handle loading
<button onClick={login}>Login</button> // No loading state!
```

---

## 🔍 Debugging Tips

### Check if hook is working:

```typescript
const hook = useAuthRequest();
console.log('Hook state:', { 
  isLoading: hook.isLoading,
  error: hook.error,
  data: hook.data 
});
```

### Check localStorage:

```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### Check network requests:

1. Open DevTools → Network tab
2. Submit form
3. Look for `/auth/login` request
4. Check request headers for `Authorization: Bearer ...`

---

## 📞 Where to Find More Help

| Need | File |
|------|------|
| Simple examples | `src/examples/HookUsageExample.tsx` |
| Full component example | `src/components/LoginWithHook.tsx` |
| Complete documentation | `src/ACTIVITY_5_IMPLEMENTATION.md` |
| Summary | `src/ACTIVITY_5_SUMMARY.md` |
| Quick reference | `src/ACTIVITY_5_QUICK_REFERENCE.md` (this file) |

---

## 🎯 Most Common Use Cases

### 1. Login Form

```typescript
const { login, isLoading, error } = useAuthRequest();

<form onSubmit={(e) => {
  e.preventDefault();
  login({ email, password });
}}>
  {/* inputs */}
  <button disabled={isLoading}>
    {isLoading ? 'Logging in...' : 'Login'}
  </button>
  {error && <div>{error}</div>}
</form>
```

### 2. Register Form

```typescript
const { register, isLoading, error } = useAuthRequest();

<form onSubmit={(e) => {
  e.preventDefault();
  register({ email, password, username });
}}>
  {/* inputs */}
  <button disabled={isLoading}>
    {isLoading ? 'Creating account...' : 'Register'}
  </button>
</form>
```

### 3. Logout Button

```typescript
const { logout, isLoading } = useAuthRequest();

<button 
  onClick={logout}
  disabled={isLoading}
>
  {isLoading ? 'Logging out...' : 'Logout'}
</button>
```

---

## ⚡ Performance Tips

1. **Clear data when done:**
   ```typescript
   clearData(); // Free up memory
   ```

2. **Clear errors on new attempt:**
   ```typescript
   clearError(); // Remove old error
   await login(credentials);
   ```

3. **Prevent double submissions:**
   ```typescript
   <button disabled={isLoading}>Submit</button>
   ```

---

## 🎓 Key Takeaways

1. **Never use `fetch()` in components** → Use hooks
2. **Hooks manage state** → data, isLoading, error
3. **Display loading states** → Better UX
4. **Handle errors gracefully** → Show user-friendly messages
5. **Use TypeScript types** → Catch errors early

---

## ✨ That's It!

You now have everything you need to use the Data Fetching Service in your components!

**Quick Start:** Copy Example 2 above and adapt it to your needs.

**Need more?** Check `src/components/LoginWithHook.tsx` for a complete implementation.

---

*Last Updated: November 10, 2025*

