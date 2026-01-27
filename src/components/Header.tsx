import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Code2, LogOut, RefreshCw, User, Home, BookOpen } from "lucide-react";
import { getRatingColor } from "@/types/codeforces";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate, useLocation } from "react-router-dom";

interface Profile {
  codeforces_handle: string | null;
  current_rating: number | null;
  avatar_url: string | null;
  rank: string | null;
}

interface HeaderProps {
  profile: Profile | null;
  onRefresh: () => void;
}

export function Header({ profile, onRefresh }: HeaderProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PlusMinus200</h1>
              <p className="text-xs text-muted-foreground">Competitive Programming Trainer</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={location.pathname === "/" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant={location.pathname === "/problems" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate("/problems")}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Problems
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {profile?.current_rating && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <span className={`font-bold ${getRatingColor(profile.current_rating)}`}>
                {profile.current_rating}
              </span>
            </div>
          )}

          <ThemeToggle />

          <Button variant="ghost" size="icon" onClick={onRefresh} className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.codeforces_handle || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile?.codeforces_handle?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium text-foreground">
                  {profile?.codeforces_handle || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
                {profile?.rank && (
                  <p className={`text-xs font-medium ${getRatingColor(profile.current_rating || 0)}`}>
                    {profile.rank}
                  </p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
