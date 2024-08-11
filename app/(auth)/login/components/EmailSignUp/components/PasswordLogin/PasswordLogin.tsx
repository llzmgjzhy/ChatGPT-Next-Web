import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { EmailAuthContextType } from "@/app/(auth)/login/types";
import Button from "@/lib/components/ui/Button";
import { TextInput } from "@/lib/components/ui/TextInput/TextInput";
import { useAuthModes } from "@/lib/hooks/useAuthModes";

import { usePasswordLogin } from "./hooks/usePasswordLogin";

export const PasswordLogin = (): JSX.Element => {
  const { password } = useAuthModes();
  const { handlePasswordLogin } = usePasswordLogin();
  const { watch } = useFormContext<EmailAuthContextType>();

  if (!password) {
    return <Fragment />;
  }

  return (
    <div>
      <Controller
        name="password"
        defaultValue=""
        render={({ field }) => (
          <TextInput
            label="Password"
            inputValue={field.value as string}
            setInputValue={field.onChange}
            crypted={true}
            onSubmit={handlePasswordLogin}
          />
        )}
      />
      <Button
        isLoading={watch("isPasswordSubmitting")}
        variant="login"
        className="py-2 w-full mb-1 mt-2"
        onClick={() => void handlePasswordLogin()}
      >
        {"Sign Up"}
      </Button>
    </div>
  );
};
