import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  signOut: async () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();


    const fetchProfile = async (userId: string) => {
    setIsLoading(true);  // Start loading before fetching
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        
        if(error){
           console.error("Error fetching profile:", error);
            toast({
            title: "Error",
            description: "Failed to fetch profile",
            variant: "destructive",
            });
           setProfile(null);
        }else{
          setProfile(data);
        }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
     setProfile(null);
    }finally {
      setIsLoading(false); // Set loading to false after fetching is complete (either success or failure)
    }
  };


  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true); // Start loading state
      try {
          const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error);
          toast({
            title: "Error",
            description: "Failed to retrieve session",
            variant: "destructive",
          });
          return;
        }

          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await fetchProfile(session.user.id);
          }

      }catch(error){
        console.error("Error loading session", error)
      }finally {
        setIsLoading(false);  // Ensure loading stops here, even if there's an error
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
       setIsLoading(true); // Start loading state

      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        navigate('/login');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } else if (event === 'USER_UPDATED') {
        setSession(session);
        setUser(session?.user ?? null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);


  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
