import { useState, useEffect, useCallback } from "react";
import { CodeforcesProblem } from "@/types/codeforces";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SavedProblem {
  id: string;
  problem_id: string;
  problem_name: string;
  problem_rating: number | null;
  problem_tags: string[] | null;
  contest_id: number | null;
  problem_index: string | null;
}

export function useProblems() {
  const { user } = useAuth();
  const [allProblems, setAllProblems] = useState<CodeforcesProblem[]>([]);
  const [savedProblems, setSavedProblems] = useState<SavedProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedProblems();
    } else {
      setSavedProblems([]);
    }
  }, [user]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://codeforces.com/api/problemset.problems"
      );
      const data = await response.json();

      if (data.status === "OK") {
        setAllProblems(data.result.problems);
      } else {
        setError("Failed to fetch problems");
      }
    } catch (err) {
      setError("Network error fetching problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedProblems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("saved_problems")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setSavedProblems(data || []);
    } catch (err) {
      console.error("Error fetching saved problems:", err);
    }
  };

  const saveProblem = async (problem: CodeforcesProblem) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase.from("saved_problems").insert({
        user_id: user.id,
        problem_id: `${problem.contestId}-${problem.index}`,
        problem_name: problem.name,
        problem_rating: problem.rating || null,
        problem_tags: problem.tags,
        contest_id: problem.contestId,
        problem_index: problem.index,
      });

      if (error) throw error;
      await fetchSavedProblems();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const unsaveProblem = async (problemId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("saved_problems")
        .delete()
        .eq("user_id", user.id)
        .eq("problem_id", problemId);

      if (error) throw error;
      await fetchSavedProblems();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const isProblemSaved = useCallback(
    (problem: CodeforcesProblem) => {
      const problemId = `${problem.contestId}-${problem.index}`;
      return savedProblems.some((sp) => sp.problem_id === problemId);
    },
    [savedProblems]
  );

  const getFilteredProblems = useCallback(
    (
      rating: number,
      offset: number,
      tags?: string[],
      limit = 20
    ): CodeforcesProblem[] => {
      const minRating = rating + offset - 100;
      const maxRating = rating + offset + 100;

      return allProblems
        .filter((problem) => {
          if (!problem.rating) return false;
          if (problem.rating < minRating || problem.rating > maxRating)
            return false;
          if (tags && tags.length > 0) {
            return tags.some((tag) => problem.tags.includes(tag));
          }
          return true;
        })
        .slice(0, limit);
    },
    [allProblems]
  );

  const getProblemsByRating = useCallback(
    (minRating: number, maxRating: number, tags?: string[], limit = 200) => {
      const filtered = allProblems.filter((problem) => {
        if (!problem.rating) return false;
        if (problem.rating < minRating || problem.rating > maxRating)
          return false;
        if (tags && tags.length > 0) {
          return tags.some((tag) => problem.tags.includes(tag));
        }
        return true;
      });
      
      // Sort by rating in increasing order and return up to the limit
      const sorted = filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      return sorted.slice(0, limit);
    },
    [allProblems]
  );

  return {
    allProblems,
    savedProblems,
    loading,
    error,
    saveProblem,
    unsaveProblem,
    isProblemSaved,
    getFilteredProblems,
    getProblemsByRating,
    refreshSavedProblems: fetchSavedProblems,
  };
}
