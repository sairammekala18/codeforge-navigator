import { useState } from "react";
import { CodeforcesProblem, getRatingColor } from "@/types/codeforces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProblemCardProps {
  problem: CodeforcesProblem;
  isSaved: boolean;
  onSave: () => Promise<{ error: Error | null }>;
  onUnsave: () => Promise<{ error: Error | null }>;
}

export function ProblemCard({ problem, isSaved, onSave, onUnsave }: ProblemCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const problemUrl = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;

  const handleSaveToggle = async () => {
    setLoading(true);
    
    if (isSaved) {
      const { error } = await onUnsave();
      if (error) {
        toast({
          variant: "destructive",
          title: "Failed to remove",
          description: error.message,
        });
      } else {
        toast({
          title: "Removed from saved",
          description: problem.name,
        });
      }
    } else {
      const { error } = await onSave();
      if (error) {
        toast({
          variant: "destructive",
          title: "Failed to save",
          description: error.message,
        });
      } else {
        toast({
          title: "Problem saved!",
          description: problem.name,
        });
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="group p-3 rounded-lg border bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">
              {problem.contestId}{problem.index}
            </span>
            {problem.rating && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getRatingColor(problem.rating)}`}
              >
                {problem.rating}
              </Badge>
            )}
          </div>
          <h4 className="font-medium text-sm leading-tight truncate text-foreground">
            {problem.name}
          </h4>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleSaveToggle}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
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
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {problem.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        {problem.tags.length > 3 && (
          <Badge variant="secondary" className="text-xs">
            +{problem.tags.length - 3}
          </Badge>
        )}
      </div>
    </div>
  );
}
