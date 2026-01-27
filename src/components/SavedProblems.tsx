import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRatingColor } from "@/types/codeforces";
import { Bookmark, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedProblem {
  id: string;
  problem_id: string;
  problem_name: string;
  problem_rating: number | null;
  problem_tags: string[] | null;
  contest_id: number | null;
  problem_index: string | null;
}

interface SavedProblemsProps {
  savedProblems: SavedProblem[];
  onUnsave: (problemId: string) => Promise<{ error: Error | null }>;
}

export function SavedProblems({ savedProblems, onUnsave }: SavedProblemsProps) {
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRemove = async (problem: SavedProblem) => {
    setLoadingId(problem.problem_id);
    
    const { error } = await onUnsave(problem.problem_id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to remove",
        description: error.message,
      });
    } else {
      toast({
        title: "Removed from saved",
        description: problem.problem_name,
      });
    }
    
    setLoadingId(null);
  };

  if (savedProblems.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">No saved problems</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Save problems to practice later by clicking the bookmark icon on any problem card.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          Saved Problems
          <span className="text-sm font-normal text-muted-foreground">
            ({savedProblems.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {savedProblems.map((problem, index) => {
            const problemUrl = problem.contest_id && problem.problem_index
              ? `https://codeforces.com/problemset/problem/${problem.contest_id}/${problem.problem_index}`
              : null;

            return (
              <div
                key={problem.id}
                className="group p-3 rounded-lg border bg-card hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {problem.contest_id && problem.problem_index && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {problem.contest_id}{problem.problem_index}
                        </span>
                      )}
                      {problem.problem_rating && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRatingColor(problem.problem_rating)}`}
                        >
                          {problem.problem_rating}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm truncate text-foreground">
                      {problem.problem_name}
                    </h4>
                    {problem.problem_tags && problem.problem_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {problem.problem_tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {problemUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a href={problemUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemove(problem)}
                      disabled={loadingId === problem.problem_id}
                    >
                      {loadingId === problem.problem_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
