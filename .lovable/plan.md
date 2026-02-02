
# Fix: Handle Setup Navigation Issue

## Problem Analysis
After signing up and entering a Codeforces handle, the app stays on the HandleSetup page instead of navigating to the HomePage. It only works after a page refresh.

**Root Cause:** There are two separate instances of the `useProfile` hook:
- One in `Index.tsx` (controls navigation)
- One in `HandleSetup.tsx` (handles the form submission)

Each hook instance has its own independent state. When the handle is submitted, only the HandleSetup's instance gets updated. The Index.tsx instance never receives the updated profile data, so navigation never triggers.

The `refreshProfile` function has a guard that prevents it from working:
```javascript
const refreshProfile = async () => {
  if (!profile?.codeforces_handle) return;  // This returns early!
  await updateCodeforcesHandle(profile.codeforces_handle);
};
```

Since the profile in Index.tsx doesn't have a handle yet, calling `refreshProfile` does nothing.

## Solution
Create a new `fetchProfile` function that can be called without any preconditions, and pass that to HandleSetup instead of `refreshProfile`. This will force the Index.tsx instance to re-fetch the profile from the database after the handle is set.

## Changes Required

### 1. Update `src/hooks/useProfile.tsx`
- Move `fetchProfile` outside the useEffect or make it callable externally
- Export a new `refetch` function that simply calls `fetchProfile` without any guards
- This allows the parent component to force a profile refresh at any time

### 2. Update `src/pages/Index.tsx`  
- Use the new `refetch` function instead of `refreshProfile`
- Pass `refetch` as the `onHandleSet` callback to `HandleSetup`

## Technical Details

The key change is adding this to the useProfile hook:
```typescript
// New function that always fetches fresh profile data
const refetch = async () => {
  setLoading(true);
  await fetchProfile();
};
```

And updating Index.tsx:
```typescript
const { profile, loading: profileLoading, refetch } = useProfile();
// ...
return <HandleSetup onHandleSet={refetch} />;
```

## Why This Works
1. User submits handle → HandleSetup's instance updates the database
2. HandleSetup calls `onHandleSet()` which is the `refetch` from Index.tsx
3. Index.tsx's instance fetches fresh profile from database (now has the handle)
4. The condition `!profile?.codeforces_handle` becomes false
5. Navigation to HomePage occurs automatically
