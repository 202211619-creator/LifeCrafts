# Atomic Design Pattern Implementation

## Overview
This document describes the implementation of Activity #6 requirements:
- Fully functional custom query hooks
- Atomic Design Pattern structure
- Standard interfaces/data contracts
- React Query integration

## Structure

### 1. Interfaces (`src/interface/api.types.ts`)
All API data contracts are centralized in this file:
- `User`, `UserProfile` - User-related types
- `Post`, `Comment` - Community content types
- `EmergencyAlert`, `EmergencyReport` - Emergency types
- `SurvivalGuide` - Knowledge hub types
- `AIChatMessage`, `AIChatRequest` - AI hub types
- `Notification` - Notification types
- `ApiResponse<T>` - Standard API response wrapper

### 2. Custom Query Hooks (`src/hooks/useQuery.ts`)
Reusable hooks following standard interface:
- **useProfile()** - Fetch user profile
- **useUpdateProfile()** - Update user profile
- **usePosts()** - Fetch all posts
- **usePost(id)** - Fetch single post
- **useCreatePost()** - Create new post
- **useUpdatePost()** - Update post
- **useDeletePost()** - Delete post
- **useLikePost()** - Like/unlike post
- **useEmergencyAlerts()** - Fetch emergency alerts
- **useSurvivalGuides()** - Fetch survival guides
- **useDownloadGuide()** - Download guide
- **useAIChat()** - AI chat mutation
- **useNotifications()** - Fetch notifications

All hooks:
- Use React Query for caching and state management
- Follow standard interface/data contract
- Are reusable across components
- Integrate cleanly with Atomic Design components

### 3. Atomic Design Structure

#### Atoms (`src/components/atoms/`)
Basic UI components (already exist in `src/components/ui/`):
- Button, Input, Card, Badge, Avatar, etc.

#### Molecules (`src/components/molecules/`)
Small combinations of atoms:
- **PostForm** - Form for creating/editing posts

#### Organisms (`src/components/organisms/`)
Complex components combining molecules/atoms:
- **PostCard** - Displays a post with actions
- **CommentSection** - Comment display and management

#### Templates (`src/components/templates/`)
Page layouts (to be implemented as needed)

#### Pages (`src/components/pages/`)
Full page components using organisms, molecules, and atoms:
- **CommunityPage** - Community exchange page using hooks and organisms
- **ProfilePage** - User profile page using hooks

### 4. React Query Provider (`src/providers/QueryProvider.tsx`)
Wraps the application with React Query client for data fetching and caching.

## Usage Examples

### Using Custom Hooks in Components

```tsx
import { usePosts, useCreatePost } from '../../hooks/useQuery';
import type { CreatePostRequest } from '../../interface/api.types';

function MyComponent() {
  const { data: posts, isLoading, error, refetch } = usePosts();
  const createPostMutation = useCreatePost();

  const handleCreate = async (data: CreatePostRequest) => {
    await createPostMutation.mutateAsync(data);
    refetch();
  };

  // Component JSX...
}
```

### Using Atomic Design Components

```tsx
import { PostCard } from '../organisms/PostCard';
import { PostForm } from '../molecules/PostForm';
import type { Post } from '../../interface/api.types';

function MyPage() {
  return (
    <div>
      <PostForm onSubmit={handleSubmit} />
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## Benefits

1. **Reusability**: Hooks and components can be used across the application
2. **Type Safety**: All data contracts are typed with TypeScript
3. **Consistency**: Standard interfaces ensure consistent data handling
4. **Performance**: React Query provides caching and automatic refetching
5. **Maintainability**: Atomic Design makes components easier to find and maintain
6. **Testability**: Small, focused components are easier to test

## Migration Notes

- Old components (`CommunityExchange.tsx`, `Profile.tsx`) are still available for backward compatibility
- New page components (`CommunityPage.tsx`, `ProfilePage.tsx`) use the new hooks and structure
- Gradually migrate other components to use the new structure

## Next Steps

1. Migrate remaining components to use custom hooks
2. Create more organisms and molecules as needed
3. Add more hooks for other features (emergency, knowledge hub, etc.)
4. Add error boundaries and loading states
5. Implement optimistic updates where appropriate

