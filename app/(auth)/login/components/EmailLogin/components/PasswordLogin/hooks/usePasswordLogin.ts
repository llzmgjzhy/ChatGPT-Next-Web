import { useFormContext } from "react-hook-form";

import { EmailAuthContextType } from "@/app/(auth)/login/types";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useToast } from "@/lib/hooks/useToast";
import Locale from "@/app/locales";

export const usePasswordLogin = () => {
  const { supabase } = useSupabase();
  const { publish } = useToast();
  const { watch, setValue } = useFormContext<EmailAuthContextType>();

  const email = watch("email");
  const password = watch("password");

  const handlePasswordLogin = async () => {
    if (email === "") {
      publish({
        variant: "danger",
        text: Locale.errorMailMissed.Name,
      });

      return;
    }

    if (password === "") {
      publish({
        variant: "danger",
        text: Locale.errorPasswordMissed.Name,
      });

      return;
    }
    setValue("isPasswordSubmitting", true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    alert("error");
    setValue("isPasswordSubmitting", false);
    setValue("isPasswordSubmitted", true);

    if (error) {
      publish({
        variant: "danger",
        text: error.message,
      });

      throw error; // this error is caught by react-hook-form
    }
  };

  return {
    handlePasswordLogin,
  };
};
