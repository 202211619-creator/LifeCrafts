# ✅ Submission Checklist - Quick Reference

> Based on class notes for Activity #5 submission

---

## 📤 Steps for Submission

### Step 1: Create a Pull Request from Your Branch

```bash
# Make sure you're on your feature branch
git branch

# If you need to create a new branch:
git checkout -b feature/activity-5

# Add and commit your changes
git add .
git commit -m "Activity #5: Data Fetching Service Implementation"

# Push to GitHub
git push origin feature/activity-5
```

Then go to GitHub to create the PR.

---

### Step 2: Make Sure That the Base Should Be the Master Branch

**⚠️ CRITICAL: Branch Configuration**

When creating Pull Request:

```
Base branch:    master        ← MUST be master/main
Compare branch: your-branch   ← Your feature branch
```

**Common setup:**
- Base: `master` ← Where you want to merge TO
- Compare: `feature/activity-5` ← Your work

**❌ DON'T:**
- Base: your-branch, Compare: master (WRONG!)
- Base: your-branch, Compare: your-branch (WRONG!)

---

### Step 3: Fill Out the Title & Description, Then Create Pull Request

**Title Examples:**
```
✅ Activity #5: Data Fetching Service & Hook Implementation
✅ Feature: Implement RequestService and useAuthRequest Hook
✅ Complete Activity #5 - Service Layer Architecture
```

**Description Template:**
```markdown
## Activity
Activity #5: Data Fetching Service & Hook Implementation

## What I Did
- Created RequestService for HTTP calls
- Implemented useAuthRequest custom hook
- Added TypeScript interfaces
- Created example components
- Added documentation

## Files Changed
- src/services/RequestService.ts
- src/hooks/useAuthRequest.ts
- src/interface/
- src/components/LoginWithHook.tsx
- src/examples/HookUsageExample.tsx
- src/docs/

## Testing
- [x] Tested login functionality
- [x] Verified error handling
- [x] Checked loading states
- [x] No linter errors

## Documentation
- [x] Implementation guide added
- [x] Examples provided
- [x] Quick reference created
```

Then click **"Create Pull Request"** button.

---

### Step 4: Copy the PR Request Link and Submit to CLMOOC as a Document/File

**After Creating PR:**

1. **Copy the URL** from your browser
   ```
   Example: https://github.com/your-username/LifeCraft/pull/1
   ```

2. **Create a Document**
   - Open Microsoft Word or Google Docs
   - Use this template:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ACTIVITY #5 SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Student Name: [Your Full Name]
Course: IT ELECTIVE 2
Section: [Your Section]
Date: [Submission Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ACTIVITY DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Activity Number: Activity #5
Activity Title: Data Fetching Service & Hook Implementation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         PULL REQUEST LINK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GitHub Pull Request:
https://github.com/your-username/LifeCraft/pull/1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         IMPLEMENTATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What I Implemented:

1. Service Layer (RequestService.ts)
   - Generic HTTP methods (GET, POST, PUT, DELETE, PATCH)
   - Authentication header handling
   - Error handling and validation
   - TypeScript type safety

2. Hook Layer (useAuthRequest.ts)
   - State management (data, isLoading, error)
   - Handler functions (login, register, logout)
   - Integration with RequestService
   - Clean interface for components

3. Type Definitions (interface/)
   - AuthPayload.ts - Request types
   - AuthResponse.ts - Response types
   - ApiResponse.ts - Generic API types

4. Example Implementation (LoginWithHook.tsx)
   - Complete working component
   - Loading state handling
   - Error display
   - Success handling

5. Documentation
   - Implementation guide
   - Quick reference
   - Usage examples
   - Architecture breakdown

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ARCHITECTURE FOLLOWED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Service Layer = Business Logic (NOT components)
✅ API/Hooks = Heavy Queries (multiple operations)
✅ Components = UI Only (presentation)

Component → Hook → Service → API
(UI)     (State)  (Logic)   (Data)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         FILES SUBMITTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Core Implementation:
✓ src/services/RequestService.ts
✓ src/hooks/useAuthRequest.ts
✓ src/interface/AuthPayload.ts
✓ src/interface/AuthResponse.ts
✓ src/interface/ApiResponse.ts
✓ src/constants/api.ts

Examples:
✓ src/components/LoginWithHook.tsx
✓ src/examples/HookUsageExample.tsx

Documentation:
✓ src/docs/ACTIVITY_5_IMPLEMENTATION.md
✓ src/docs/ACTIVITY_5_SUMMARY.md
✓ src/docs/ACTIVITY_5_QUICK_REFERENCE.md
✓ src/docs/SUBMISSION_GUIDE.md
✓ src/docs/ARCHITECTURE_BREAKDOWN.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         TESTING COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Login functionality tested
✅ Registration flow tested
✅ Error handling verified
✅ Loading states working
✅ TypeScript compilation successful
✅ No linter errors
✅ Documentation reviewed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Submitted by: [Your Name]
Date: [Date]
```

3. **Save as PDF or DOCX**
   - File name: `Activity5_YourName_Submission.pdf`

4. **Upload to CLMOOC**
   - Go to the Activity #5 submission page
   - Upload your document
   - Submit before deadline

---

## 🏗️ Architecture Notes

### Service = Business Logic, NOT Components

**What this means:**
- Services handle business rules and logic
- Services are NOT React components
- Services have NO JSX or UI code
- Services are pure JavaScript/TypeScript functions

**Example:**
```typescript
// ✅ Service (Business Logic)
export const post = async (endpoint, body) => {
  const token = localStorage.getItem('token'); // Auth logic
  return await axios.post(endpoint, body, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ❌ NOT a service (This is a component)
function LoginButton() {
  return <button>Login</button>;
}
```

---

### API = Heavy Queries (Multiple)

**What this means:**
- API layer handles heavy/complex queries
- Multiple API calls combined into one function
- Complex data transformations
- Business calculations

**Example:**
```typescript
// ✅ Heavy query in service
export const getUserDashboard = async (userId) => {
  // Multiple API calls
  const [user, stats, achievements] = await Promise.all([
    get(`/users/${userId}`),
    get(`/users/${userId}/stats`),
    get(`/users/${userId}/achievements`)
  ]);
  
  // Complex transformation
  return {
    ...user,
    level: calculateLevel(stats.points),
    rank: determineRank(achievements)
  };
};
```

---

## 📋 Pre-Submission Checklist

### Code Quality
- [ ] No linter errors
- [ ] All TypeScript types defined
- [ ] Code formatted properly
- [ ] No console.log statements (or commented)
- [ ] No commented-out code blocks

### Architecture
- [ ] Services contain business logic only
- [ ] Components have NO fetch/axios calls
- [ ] Components use hooks (not services directly)
- [ ] Hooks manage state properly
- [ ] Clear separation of concerns

### Files
- [ ] All required files created
- [ ] Documentation complete
- [ ] Examples provided
- [ ] README updated (if needed)

### Git
- [ ] All changes committed
- [ ] Commits have clear messages
- [ ] Branch pushed to GitHub
- [ ] No merge conflicts

### Pull Request
- [ ] PR created successfully
- [ ] Base branch is master ✓
- [ ] Title is descriptive
- [ ] Description is complete
- [ ] PR link copied

### Submission Document
- [ ] Student name included
- [ ] Course and section included
- [ ] PR link is correct and clickable
- [ ] Summary describes what was done
- [ ] Files list included
- [ ] Saved as PDF or DOCX
- [ ] File named properly

### CLMOOC
- [ ] Document uploaded
- [ ] Submission confirmed
- [ ] Submitted before deadline

---

## 🚀 Quick Commands Reference

```bash
# Check current branch
git branch

# Create new branch (if needed)
git checkout -b feature/activity-5

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Activity #5: Complete implementation"

# Push to GitHub
git push origin feature/activity-5

# After creating PR on GitHub, get the URL
# Example: https://github.com/username/repo/pull/1
```

---

## 💡 Pro Tips

### For Creating PR:
1. ✅ Always double-check base branch = master
2. ✅ Write clear, descriptive title
3. ✅ Fill out complete description
4. ✅ Link any related issues
5. ✅ Add screenshots if UI changes

### For Architecture:
1. ✅ Keep services pure (no UI)
2. ✅ Keep components clean (no business logic)
3. ✅ Use hooks as bridge
4. ✅ Type everything with TypeScript
5. ✅ Document your code

### For Submission:
1. ✅ Test before submitting
2. ✅ Check PR link works
3. ✅ Proofread submission document
4. ✅ Submit early, not last minute
5. ✅ Keep a backup of your work

---

## ❓ Troubleshooting

### Problem: Can't create PR
**Solution:**
- Make sure you pushed your branch to GitHub
- Check if you have any uncommitted changes
- Verify you're not already on master branch

### Problem: Wrong base branch
**Solution:**
- Close the PR
- Create a new one with correct base branch
- Or edit the PR settings (if GitHub allows)

### Problem: PR link doesn't work
**Solution:**
- Make sure the repository is public
- Check if you copied the full URL
- Try accessing in incognito/private window

### Problem: Missing files in PR
**Solution:**
- Make sure all files are committed
- Push again: `git push origin your-branch-name`
- Refresh the PR page

---

## ✅ Final Checklist Before Submit

```
□ Code is complete and working
□ No errors in console
□ All tests passing
□ Git branch pushed
□ Pull Request created
□ Base branch = master ✓
□ PR title is clear
□ PR description complete
□ PR link copied
□ Submission document created
□ Document has all required info
□ Document saved as PDF/DOCX
□ File uploaded to CLMOOC
□ Submission confirmed
□ Submitted before deadline
```

---

## 🎯 Remember

**The 4 Steps:**
1. Create Pull Request from your branch
2. Base branch = master, Compare = your branch
3. Fill title & description, create PR
4. Copy PR link, submit to CLMOOC

**The 3 Principles:**
1. Service = Business Logic (NOT components)
2. API = Heavy Queries (multiple operations)
3. Components = UI Only (presentation)

---

*Good luck with your submission! 🚀*

*Last Updated: November 10, 2025*
*Course: IT ELECTIVE 2*
*Activity: #5*

