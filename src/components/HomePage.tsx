import { useProfile } from "@/hooks/useProfile";
import { useProblems } from "@/hooks/useProblems";
import { UserStats } from "./UserStats";
import { RatingGraph } from "./RatingGraph";
import { Header } from "./Header";
import { SavedProblems } from "./SavedProblems";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Target, Flame, BookOpen, TrendingUp, Award, Calendar, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRatingColor, getRankName } from "@/types/codeforces";

interface HomePageProps {
  profile: {
    codeforces_handle: string | null;
    current_rating: number | null;
    max_rating: number | null;
    rank: string | null;
    avatar_url: string | null;
  } | null;
}

export function HomePage({ profile }: HomePageProps) {
  const { ratingHistory, refreshProfile } = useProfile();
  const { savedProblems, unsaveProblem } = useProblems();
  const navigate = useNavigate();
  const currentRating = profile?.current_rating || 1200;

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} onRefresh={refreshProfile} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className={getRatingColor(currentRating)}>{profile?.codeforces_handle}</span>!
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to improve your competitive programming skills?
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Rating</p>
                  <p className={`text-2xl font-bold ${getRatingColor(currentRating)}`}>
                    {currentRating}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/20">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Rating</p>
                  <p className={`text-2xl font-bold ${getRatingColor(profile?.max_rating || 0)}`}>
                    {profile?.max_rating || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/50 to-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-foreground/10">
                  <BookOpen className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className={`text-xl font-bold ${getRatingColor(currentRating)}`}>
                    {getRankName(currentRating)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary to-secondary/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-foreground/10">
                  <Calendar className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contests</p>
                  <p className="text-2xl font-bold text-foreground">
                    {ratingHistory.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            <UserStats profile={profile} />
          </div>

          {/* Right Column - Rating Graph */}
          <div className="lg:col-span-2">
            <RatingGraph ratingHistory={ratingHistory} />
          </div>
        </div>

        {/* Practice Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Favourites Card */}
          <Card 
            className="border-0 shadow-lg cursor-pointer card-hover group bg-gradient-to-br from-primary/5 to-transparent"
            onClick={() => navigate("/problems")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Favourites</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {savedProblems.length} problems saved
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your bookmarked problems for focused practice sessions.
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border-0 shadow-lg cursor-pointer card-hover group bg-gradient-to-br from-success/5 to-transparent"
            onClick={() => navigate("/problems")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-success/20 group-hover:bg-success/30 transition-colors">
                    <Target className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Practice Zone</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Rating {currentRating - 200} - {currentRating}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-success group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Solidify your fundamentals with problems slightly below your current level.
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border-0 shadow-lg cursor-pointer card-hover group bg-gradient-to-br from-destructive/5 to-transparent"
            onClick={() => navigate("/problems")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-destructive/20 group-hover:bg-destructive/30 transition-colors">
                    <Flame className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Challenge Zone</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Rating {currentRating} - {currentRating + 200}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-destructive group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Push your limits with challenging problems above your current rating.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/problems")}
            className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Start Practicing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}
