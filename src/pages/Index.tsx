import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import { HandleSetup } from "@/components/HandleSetup";
import { HomePage } from "@/components/HomePage";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, refreshProfile } = useProfile();

  if (authLoading) {
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
    return <AuthForm />;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile?.codeforces_handle) {
    return <HandleSetup onHandleSet={refreshProfile} />;
  }

  return <HomePage profile={profile} />;
};

export default Index;
