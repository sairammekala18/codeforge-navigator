import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProblemCard } from "./ProblemCard";
import { CodeforcesProblem } from "@/types/codeforces";
import { Target, Flame, AlertCircle } from "lucide-react";

interface ProblemSectionProps {
  title: string;
  subtitle: string;
  problems: CodeforcesProblem[];
  variant: "easy" | "hard";
  onSave: (problem: CodeforcesProblem) => Promise<{ error: Error | null }>;
  onUnsave: (problemId: string) => Promise<{ error: Error | null }>;
  isProblemSaved: (problem: CodeforcesProblem) => boolean;
}

export function ProblemSection({
  title,
  subtitle,
  problems,
  variant,
  onSave,
  onUnsave,
  isProblemSaved,
}: ProblemSectionProps) {
  const Icon = variant === "easy" ? Target : Flame;
  const iconColor = variant === "easy" ? "text-success" : "text-destructive";

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
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            ({problems.length} problems)
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
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
