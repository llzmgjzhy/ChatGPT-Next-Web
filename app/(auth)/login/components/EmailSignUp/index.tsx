"use client";

import { EmailInput } from "./components/EmailInput";
import { PasswordLogin } from "./components/PasswordLogin/PasswordLogin";

export const EmailSignUp = (): JSX.Element => {
  return (
    <>
      <EmailInput />
      <PasswordLogin />
    </>
  );
};
