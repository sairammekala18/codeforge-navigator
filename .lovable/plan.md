

# Add Google Sign-In to Authentication

## Overview
Add a "Continue with Google" button to the authentication form, allowing users to quickly sign up or sign in using their Google account. This is fully managed by Lovable Cloud and requires no additional configuration.

## Implementation Details

### Step 1: Configure Google OAuth Provider
Use the Lovable Cloud authentication configuration tool to enable Google OAuth. This will:
- Generate the required Lovable auth module at `src/integrations/lovable/`
- Install the `@lovable.dev/cloud-auth-js` package automatically

### Step 2: Update Authentication Hook (`src/hooks/useAuth.tsx`)
Add a new `signInWithGoogle` function to the auth context:
- Import the `lovable` module from the generated integration
- Create a function that calls `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`
- Export this function through the AuthContext

### Step 3: Update Auth Form (`src/components/AuthForm.tsx`)
Add Google sign-in button to the UI:
- Add a "Continue with Google" button with Google's brand icon
- Add a visual divider ("or") between social login and email/password forms
- Handle loading state and errors for the Google sign-in process
- The button will appear above the existing email/password form on both Sign In and Sign Up tabs

## User Experience Flow

1. User lands on the auth page
2. User sees "Continue with Google" button at the top
3. User clicks the button
4. User is redirected to Google's OAuth consent screen
5. After authorizing, user is redirected back to the app
6. The app detects the new session and navigates to the handle setup (for new users) or home page (for returning users)

## Visual Layout

```text
+----------------------------------+
|          CF Practice             |
|   Your personal training buddy   |
+----------------------------------+
|                                  |
|   [G] Continue with Google       |
|                                  |
|   ────────── or ──────────       |
|                                  |
|   [ Sign In ] [ Sign Up ]        |
|                                  |
|   Email: [__________________]    |
|   Password: [_______________]    |
|                                  |
|   [      Sign In Button    ]     |
+----------------------------------+
```

## Technical Notes

- Uses Lovable Cloud's managed OAuth (no API keys needed from you)
- The `lovable.auth.signInWithOAuth()` function handles the entire OAuth flow
- Session is automatically picked up by the existing `onAuthStateChange` listener in `useAuth`
- Profile creation for new users is handled by the existing database trigger

