import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Session Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        setSession(false);
        return;
      }
      setSession(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token has been refreshed');
      }
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  // Show loading state while checking session
  if (session === null) {
    return (
      <div className="min-h-screen bg-[#1D1B1C] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};