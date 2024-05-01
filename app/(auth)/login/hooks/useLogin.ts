import { useEffect } from "react";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToPreviousPageOrChatPage } from "@/lib/helpers/redirectToPreviousPageOrChatPage";

export const useLogin = () => {
  const { session } = useSupabase();

  useEffect(() => {
    if (session?.user !== undefined) {
      redirectToPreviousPageOrChatPage();
    }
  }, [session?.user]);
};
