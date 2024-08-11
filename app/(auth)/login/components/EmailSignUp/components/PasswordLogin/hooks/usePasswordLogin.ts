import { useFormContext } from "react-hook-form";

import { EmailAuthContextType } from "@/app/(auth)/login/types";
import { useSupabase } from "@/lib/context/SupabaseProvider";
// import { useToast } from "@/lib/hooks/useToast";
import { useToast } from "@/components/ui/use-toast";
import Locale from "@/app/locales";

export const usePasswordLogin = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { watch, setValue } = useFormContext<EmailAuthContextType>();

  const email = watch("email");
  const password = watch("password");

  const handlePasswordLogin = async () => {
    if (email === "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: Locale.errorMailMissed.Name,
      });

      return;
    }

    if (password === "") {
      toast({
        variant: "destructive",
        description: Locale.errorPasswordMissed.Name,
      });

      return;
    }
    if (!email.endsWith("pku.edu.cn")) {
      toast({
        variant: "default",
        description: "暂未开放该邮箱的注册功能",
      });

      return;
    }
    setValue("isPasswordSubmitting", true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    // alert(error);
    setValue("isPasswordSubmitting", false);
    setValue("isPasswordSubmitted", true);

    if (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });

      // throw error; // this error is caught by react-hook-form
    }
  };

  return {
    handlePasswordLogin,
  };
};
