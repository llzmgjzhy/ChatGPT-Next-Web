import { useState } from "react";
// import Locale from "@/app/locales"
import { useToast } from "@/components/ui/use-toast";

import { useSupabase } from "@/lib/context/SupabaseProvider";

export const useLogoutModal = () => {
  const { supabase } = useSupabase();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpened, setIsLogoutModalOpened] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    localStorage.clear();

    if (error) {
      console.error("Error logging out:", error.message);
      toast({
        variant: "destructive",
        title: "error log out:"+(error.message),
      });
    } else {
        toast({
        title: "success log out",
      });
      window.location.href = "/";
    }
    setIsLoggingOut(false);
  };

  return {
    handleLogout,
    isLoggingOut,
    isLogoutModalOpened,
    setIsLogoutModalOpened,
  };
};
