"use client";

import { EmailInput } from "./components/EmailInput";
import { PasswordLogin } from "./components/PasswordLogin/PasswordLogin";

export const EmailLogin = (): JSX.Element => {
  return (
    <>
      <EmailInput />
      <PasswordLogin />
    </>
  );
};
