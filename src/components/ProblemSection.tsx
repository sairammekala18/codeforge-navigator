import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProblemCard } from "./ProblemCard";
import { CodeforcesProblem } from "@/types/codeforces";
import { Target, Flame, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProblemSectionProps {
  title: string;
  subtitle: string;
  problems: CodeforcesProblem[];
  variant: "easy" | "hard";
  onSave: (problem: CodeforcesProblem) => Promise<{ error: Error | null }>;
  onUnsave: (problemId: string) => Promise<{ error: Error | null }>;
  isProblemSaved: (problem: CodeforcesProblem) => boolean;
}

const PROBLEMS_PER_PAGE = 18;

export function ProblemSection({
  title,
  subtitle,
  problems,
  variant,
  onSave,
  onUnsave,
  isProblemSaved,
}: ProblemSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const Icon = variant === "easy" ? Target : Flame;
  const iconColor = variant === "easy" ? "text-success" : "text-destructive";

  const totalPages = Math.ceil(problems.length / PROBLEMS_PER_PAGE);
  const startIndex = currentPage * PROBLEMS_PER_PAGE;
  const visibleProblems = problems.slice(startIndex, startIndex + PROBLEMS_PER_PAGE);

  if (problems.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No problems found matching your criteria.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting the topic filters or rating range.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className={`h-5 w-5 ${iconColor}`} />
              {title}
              <span className="text-sm font-normal text-muted-foreground">
                ({problems.length} problems)
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProblems.map((problem, index) => (
            <div
              key={`${problem.contestId}-${problem.index}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <ProblemCard
                problem={problem}
                isSaved={isProblemSaved(problem)}
                onSave={() => onSave(problem)}
                onUnsave={() => onUnsave(`${problem.contestId}-${problem.index}`)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
