import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useProblems } from "@/hooks/useProblems";
import { ProblemSection } from "@/components/ProblemSection";
import { TopicFilter } from "@/components/TopicFilter";
import { SavedProblems } from "@/components/SavedProblems";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";

const Problems = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const { loading: problemsLoading, getProblemsByRating, saveProblem, unsaveProblem, isProblemSaved, savedProblems } = useProblems();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customRating, setCustomRating] = useState<number | null>(null);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!profile?.codeforces_handle) {
    return <Navigate to="/" replace />;
  }

  if (problemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      </div>
    );
  }

  const currentRating = profile?.current_rating || 1200;
  const effectiveRating = customRating ?? currentRating;

  // Exact ranges: x-200 to x and x to x+200 - fetch up to 60 problems each
  const practiceProblems = getProblemsByRating(effectiveRating - 200, effectiveRating, selectedTags.length > 0 ? selectedTags : undefined, 60);
  const challengeProblems = getProblemsByRating(effectiveRating, effectiveRating + 200, selectedTags.length > 0 ? selectedTags : undefined, 60);

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} onRefresh={refreshProfile} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <TopicFilter 
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            currentRating={effectiveRating}
            onRatingChange={setCustomRating}
          />

          <Tabs defaultValue="practice" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="practice">Practice ({effectiveRating - 200} - {effectiveRating})</TabsTrigger>
              <TabsTrigger value="challenge">Challenge ({effectiveRating} - {effectiveRating + 200})</TabsTrigger>
              <TabsTrigger value="saved">
                Saved ({savedProblems.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice" className="space-y-4 animate-fade-in">
              <ProblemSection
                title="Practice Zone"
                subtitle={`Rating ${effectiveRating - 200} - ${effectiveRating}`}
                problems={practiceProblems}
                variant="easy"
                onSave={saveProblem}
                onUnsave={unsaveProblem}
                isProblemSaved={isProblemSaved}
              />
            </TabsContent>

            <TabsContent value="challenge" className="space-y-4 animate-fade-in">
              <ProblemSection
                title="Challenge Zone"
                subtitle={`Rating ${effectiveRating} - ${effectiveRating + 200}`}
                problems={challengeProblems}
                variant="hard"
                onSave={saveProblem}
                onUnsave={unsaveProblem}
                isProblemSaved={isProblemSaved}
              />
            </TabsContent>

            <TabsContent value="saved" className="animate-fade-in">
              <SavedProblems 
                savedProblems={savedProblems} 
                onUnsave={unsaveProblem}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Problems;
