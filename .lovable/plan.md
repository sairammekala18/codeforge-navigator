
# Add Firebase Authentication

## Overview
Replace the current Lovable Cloud authentication with Firebase Authentication. This will give you access to more sign-in providers including **Google, GitHub, Twitter, Phone**, and more.

## Important Consideration
Since your database (profiles, saved_problems) still runs on Lovable Cloud, we need to bridge Firebase user IDs with your existing database. This requires:
1. Removing the automatic profile creation trigger (currently tied to Lovable auth)
2. Creating profiles manually when users sign in with Firebase for the first time

## Implementation Steps

### Step 1: Install Firebase SDK
Add the Firebase JavaScript SDK to the project:
- `firebase` package for core functionality and authentication

### Step 2: Create Firebase Configuration
Create a new file `src/integrations/firebase/config.ts`:
- Initialize Firebase app with your project credentials
- Export the Firebase auth instance
- You'll need to provide your Firebase config (API key, project ID, etc.)

### Step 3: Replace Auth Hook (`src/hooks/useAuth.tsx`)
Completely rewrite the authentication hook to use Firebase:
- Replace Supabase auth types with Firebase auth types
- Use `onAuthStateChanged` listener instead of Supabase's `onAuthStateChange`
- Implement `signUp` with `createUserWithEmailAndPassword`
- Implement `signIn` with `signInWithEmailAndPassword`
- Implement `signInWithGoogle` with `signInWithPopup` and `GoogleAuthProvider`
- Add `signInWithGitHub` with `signInWithPopup` and `GithubAuthProvider`
- Implement `signOut` with Firebase's `signOut`

### Step 4: Update Profile Hook (`src/hooks/useProfile.tsx`)
Modify to work with Firebase UIDs:
- Change user ID references from Lovable auth to Firebase user UID
- Add logic to create a profile in the database on first sign-in (since Firebase doesn't have a database trigger)

### Step 5: Update Auth Form (`src/components/AuthForm.tsx`)
Add GitHub sign-in button:
- Add a "Continue with GitHub" button alongside the Google button
- Handle loading states for both OAuth providers

### Step 6: Update Database Trigger
Modify the database to work without the automatic profile creation trigger:
- The `handle_new_user()` trigger won't fire for Firebase users
- Profile creation will happen in the frontend on first sign-in

## Required from You
You'll need to:
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and add the sign-in methods you want (Email/Password, Google, GitHub)
3. For GitHub: Create an OAuth app in GitHub Developer Settings and add the credentials to Firebase
4. Provide the Firebase configuration object (available in Project Settings > General > Your apps)

## Architecture After Implementation

```text
+------------------+     +------------------+     +------------------+
|   Auth Form      | --> |  Firebase Auth   | --> |  Firebase Cloud  |
|  (React UI)      |     |  (SDK)           |     |  (Google Servers)|
+------------------+     +------------------+     +------------------+
                                |
                                | Firebase UID
                                v
                         +------------------+
                         |  Lovable Cloud   |
                         |  Database        |
                         |  (profiles,      |
                         |   saved_problems)|
                         +------------------+
```

## Sign-in Flow

1. User clicks "Continue with Google/GitHub" or enters email/password
2. Firebase handles authentication and returns a Firebase User object
3. App checks if a profile exists in Lovable Cloud database with that Firebase UID
4. If no profile exists, create one automatically
5. User proceeds to handle setup or home page

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/integrations/firebase/config.ts` | Create - Firebase initialization |
| `src/hooks/useAuth.tsx` | Modify - Replace with Firebase auth |
| `src/hooks/useProfile.tsx` | Modify - Add first-login profile creation |
| `src/components/AuthForm.tsx` | Modify - Add GitHub button |

## Technical Notes

- Firebase UID format differs from Lovable auth UUIDs, but both are strings that work with the `user_id` column
- The existing RLS policies on `profiles` and `saved_problems` tables use `auth.uid()` which is Lovable-specific - these will need adjustment via service role or modified policies
- Consider using Firebase custom claims if you need role-based access later

