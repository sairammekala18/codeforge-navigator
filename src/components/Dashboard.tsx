import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useProblems } from "@/hooks/useProblems";
import { UserStats } from "./UserStats";
import { RatingGraph } from "./RatingGraph";
import { ProblemSection } from "./ProblemSection";
import { TopicFilter } from "./TopicFilter";
import { SavedProblems } from "./SavedProblems";
import { Header } from "./Header";

import { Loader2 } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const { profile, loading: profileLoading, ratingHistory, refreshProfile } = useProfile();
  const { loading: problemsLoading, getFilteredProblems, getProblemsByRating, saveProblem, unsaveProblem, isProblemSaved, savedProblems } = useProblems();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customRating, setCustomRating] = useState<number | null>(null);

  if (profileLoading || problemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentRating = profile?.current_rating || 1200;
  const effectiveRating = customRating ?? currentRating;

  const easyProblems = getProblemsByRating(effectiveRating - 250, effectiveRating - 150, selectedTags.length > 0 ? selectedTags : undefined, 15);
  const challengingProblems = getProblemsByRating(effectiveRating + 150, effectiveRating + 250, selectedTags.length > 0 ? selectedTags : undefined, 15);

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} onRefresh={refreshProfile} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Stats & Graph */}
          <div className="lg:col-span-1 space-y-6">
            <UserStats profile={profile} />
            <RatingGraph ratingHistory={ratingHistory} />
            <SavedProblems 
              savedProblems={savedProblems} 
              onUnsave={unsaveProblem}
            />
          </div>

          {/* Right Column - Problems */}
          <div className="lg:col-span-2 space-y-6">
            <TopicFilter 
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              currentRating={effectiveRating}
              onRatingChange={setCustomRating}
            />

            <ProblemSection
              title="Practice Zone"
              subtitle={`Rating ~${effectiveRating - 200}`}
              problems={easyProblems}
              variant="easy"
              onSave={saveProblem}
              onUnsave={unsaveProblem}
              isProblemSaved={isProblemSaved}
            />

            <ProblemSection
              title="Challenge Zone"
              subtitle={`Rating ~${effectiveRating + 200}`}
              problems={challengingProblems}
              variant="hard"
              onSave={saveProblem}
              onUnsave={unsaveProblem}
              isProblemSaved={isProblemSaved}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
