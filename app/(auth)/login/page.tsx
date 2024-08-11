"use client";
import Link from "next/link";
import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { MedImindLogo } from "@/lib/assets/MedImindLogo";
import { useSupabase } from "@/lib/context/SupabaseProvider";

import { EmailLogin } from "./components/EmailLogin";
import { EmailSignUp } from "./components/EmailSignUp";
import { useLogin } from "./hooks/useLogin";
import styles from "./page.module.scss";
import { EmailAuthContextType } from "./types";
import { useState, useEffect } from "react";
import { set } from "date-fns";

const Main = (): JSX.Element => {
  useLogin();
  const { session } = useSupabase();
  const [isSignUp, setIsSignUp] = useState(false);

  const methods = useForm<EmailAuthContextType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className={styles.login_page_wrapper}>
      {!session?.user && (
        <section className={styles.section}>
          <Link href="/" className={styles.logo_link}>
            <MedImindLogo size={80} />
          </Link>
          <p className={styles.title}>
            {"Study with "}
            <span className={styles.primary_text}>MedImind</span>
          </p>
          <div className={styles.form_container}>
            <FormProvider {...methods}>
              {!isSignUp && <EmailLogin />}
              {!!isSignUp && <EmailSignUp />}
            </FormProvider>
          </div>
          {!isSignUp && (
            <div className="mt-2 text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                className="underline"
                onClick={() => {
                  setIsSignUp(true);
                }}
              >
                Sign up
              </button>
            </div>
          )}
          {isSignUp && (
            <div className="mt-2 text-center text-sm">
              Already have an account?{" "}
              <button
                className="underline"
                onClick={() => {
                  setIsSignUp(false);
                }}
              >
                Sign in
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

const Login = (): JSX.Element => {
  return (
    <Suspense fallback="Loading...">
      <Main />
    </Suspense>
  );
};

export default Login;
