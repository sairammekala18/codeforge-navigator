import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Trophy, Target, Star } from "lucide-react";
import { getRatingColor, getRankName } from "@/types/codeforces";

interface Profile {
  current_rating: number | null;
  max_rating: number | null;
  rank: string | null;
  codeforces_handle: string | null;
}

interface UserStatsProps {
  profile: Profile | null;
}

export function UserStats({ profile }: UserStatsProps) {
  const currentRating = profile?.current_rating || 0;
  const maxRating = profile?.max_rating || 0;
  const ratingChange = currentRating - maxRating;

  const stats = [
    {
      label: "Current Rating",
      value: currentRating || "N/A",
      icon: TrendingUp,
      colorClass: currentRating ? getRatingColor(currentRating) : "text-muted-foreground",
    },
    {
      label: "Max Rating",
      value: maxRating || "N/A",
      icon: Trophy,
      colorClass: maxRating ? getRatingColor(maxRating) : "text-muted-foreground",
    },
    {
      label: "Current Rank",
      value: currentRating ? getRankName(currentRating) : "Unrated",
      icon: Star,
      colorClass: currentRating ? getRatingColor(currentRating) : "text-muted-foreground",
    },
    {
      label: "Practice Goal",
      value: `${currentRating + 200}+`,
      icon: Target,
      colorClass: "text-primary",
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">👋</span>
          Welcome, {profile?.codeforces_handle || "Coder"}!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-3 rounded-lg bg-muted/50 space-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className={`text-lg font-bold ${stat.colorClass}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {currentRating > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {ratingChange >= 0 ? (
                <span className="text-success">
                  You're at your peak! Keep pushing! 🚀
                </span>
              ) : (
                <span>
                  {Math.abs(ratingChange)} points from your best. You've got this! 💪
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
