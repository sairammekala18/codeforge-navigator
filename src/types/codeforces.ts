export interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  titlePhoto?: string;
  country?: string;
  city?: string;
  organization?: string;
  friendOfCount?: number;
  contribution?: number;
  registrationTimeSeconds?: number;
  lastOnlineTimeSeconds?: number;
}

export interface CodeforcesProblem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  rating?: number;
  tags: string[];
  solvedCount?: number;
}

export interface CodeforcesRatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface CodeforcesSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: CodeforcesProblem;
  author: {
    participantType: string;
  };
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

export const PROBLEM_TAGS = [
  "implementation",
  "math",
  "greedy",
  "dp",
  "data structures",
  "brute force",
  "constructive algorithms",
  "graphs",
  "sortings",
  "binary search",
  "dfs and similar",
  "trees",
  "strings",
  "number theory",
  "combinatorics",
  "geometry",
  "bitmasks",
  "two pointers",
  "dsu",
  "shortest paths",
  "probabilities",
  "divide and conquer",
  "hashing",
  "games",
  "flows",
  "interactive",
  "matrices",
  "string suffix structures",
  "fft",
  "expression parsing",
  "ternary search",
  "meet-in-the-middle",
  "2-sat",
  "chinese remainder theorem",
  "schedules",
] as const;

export type ProblemTag = (typeof PROBLEM_TAGS)[number];

export function getRatingColor(rating: number): string {
  if (rating < 1200) return "rating-newbie";
  if (rating < 1400) return "rating-pupil";
  if (rating < 1600) return "rating-specialist";
  if (rating < 1900) return "rating-expert";
  if (rating < 2100) return "rating-candidate";
  if (rating < 2400) return "rating-master";
  if (rating < 3000) return "rating-grandmaster";
  return "rating-legendary";
}

export function getRankName(rating: number): string {
  if (rating < 1200) return "Newbie";
  if (rating < 1400) return "Pupil";
  if (rating < 1600) return "Specialist";
  if (rating < 1900) return "Expert";
  if (rating < 2100) return "Candidate Master";
  if (rating < 2400) return "Master";
  if (rating < 2600) return "International Master";
  if (rating < 3000) return "Grandmaster";
  return "Legendary Grandmaster";
}
