import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, ArrowRight } from "lucide-react";

interface HandleSetupProps {
  onHandleSet?: () => Promise<void>;
}

export function HandleSetup({ onHandleSet }: HandleSetupProps) {
  const { updateCodeforcesHandle } = useProfile();
  const { toast } = useToast();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!handle.trim()) {
      toast({
        variant: "destructive",
        title: "Handle required",
        description: "Please enter your Codeforces handle.",
      });
      return;
    }

    setLoading(true);
    const { error } = await updateCodeforcesHandle(handle.trim());

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to verify handle",
        description: error.message,
      });
      setLoading(false);
    } else {
      toast({
        title: "Handle verified!",
        description: "Your Codeforces profile has been connected.",
      });
      // Refresh the parent's profile state to trigger navigation
      if (onHandleSet) {
        await onHandleSet();
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-0 shadow-xl animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Connect Your Handle</CardTitle>
            <CardDescription className="mt-2">
              Enter your Codeforces handle to get personalized problem recommendations
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="e.g., tourist"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="text-center text-lg h-12"
              />
              <p className="text-xs text-muted-foreground text-center">
                Your handle can be found on your Codeforces profile
              </p>
            </div>
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
