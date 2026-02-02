
# Exclude Solved Problems from Recommendations

## Overview
Add functionality to fetch the user's solved problems from Codeforces and exclude them from the Practice and Challenge problem recommendations. This ensures users only see problems they haven't solved yet.

## How It Works

1. When the user loads the Problems page, the system will fetch their submission history from Codeforces using their handle
2. Extract all problems where the verdict is "OK" (accepted/solved)
3. Filter out these solved problems from the recommendations before displaying them

## Implementation Details

### File: `src/hooks/useProblems.tsx`

**Changes:**
- Add a new state `solvedProblemIds` to store the set of solved problem IDs
- Add a new state `solvedLoading` to track the loading state of solved problems fetch
- Create a new function `fetchSolvedProblems(handle: string)` that:
  - Calls the Codeforces API: `https://codeforces.com/api/user.status?handle={handle}`
  - Filters submissions where `verdict === "OK"`
  - Creates a Set of unique problem IDs (format: `contestId-index`)
- Update `getProblemsByRating` function to exclude problems that exist in `solvedProblemIds`
- Export `solvedProblemIds` and a function to check if a problem is solved

### File: `src/pages/Problems.tsx`

**Changes:**
- Pass the user's Codeforces handle to the `useProblems` hook
- Show loading state while fetching solved problems
- Display the count of excluded solved problems (optional visual indicator)

### File: `src/components/ProblemCard.tsx`

**Optional Enhancement:**
- Add a visual indicator (like a checkmark) for problems that have been solved, in case they appear in the Favourites list

## Technical Notes

- The Codeforces API returns all submissions (can be large for active users)
- We only need to check for `verdict === "OK"` to determine if a problem is solved
- Problem ID format: `{contestId}-{index}` (e.g., "1234-A")
- The API call happens once on page load or when the handle changes
- The `CodeforcesSubmission` type already exists in the codebase

## User Experience

- Problems page will show a brief loading state while fetching solved problems
- Once loaded, only unsolved problems appear in Practice and Challenge zones
- Users get fresh, relevant problems every time instead of seeing already-solved ones
