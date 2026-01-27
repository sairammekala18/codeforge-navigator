import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { CodeforcesUser, CodeforcesRatingChange } from "@/types/codeforces";

interface Profile {
  id: string;
  user_id: string;
  codeforces_handle: string | null;
  current_rating: number | null;
  max_rating: number | null;
  rank: string | null;
  avatar_url: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingHistory, setRatingHistory] = useState<CodeforcesRatingChange[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);

      if (data?.codeforces_handle) {
        await fetchRatingHistory(data.codeforces_handle);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingHistory = async (handle: string) => {
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        setRatingHistory(data.result);
      }
    } catch (error) {
      console.error("Error fetching rating history:", error);
    }
  };

  const updateCodeforcesHandle = async (handle: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      // Fetch CF user info
      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );
      const data = await response.json();

      if (data.status !== "OK") {
        return { error: new Error("Invalid Codeforces handle") };
      }

      const cfUser: CodeforcesUser = data.result[0];

      const { error } = await supabase
        .from("profiles")
        .update({
          codeforces_handle: cfUser.handle,
          current_rating: cfUser.rating || null,
          max_rating: cfUser.maxRating || null,
          rank: cfUser.rank || null,
          avatar_url: cfUser.avatar || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshProfile = async () => {
    if (!profile?.codeforces_handle) return;
    await updateCodeforcesHandle(profile.codeforces_handle);
  };

  return {
    profile,
    loading,
    ratingHistory,
    updateCodeforcesHandle,
    refreshProfile,
  };
}
