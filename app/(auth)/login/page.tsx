"use client";
import Link from "next/link";
import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";

import MedImindIcon from "../../icons/medimind_medium.svg";

import { EmailLogin } from "./components/EmailLogin";
import { useLogin } from "./hooks/useLogin";
import styles from "./page.module.scss";
import { EmailAuthContextType } from "./types";

const Main = (): JSX.Element => {
  useLogin();

  const methods = useForm<EmailAuthContextType>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className={styles.login_page_wrapper}>
      <section className={styles.section}>
        <Link href="/" className={styles.logo_link}>
          <MedImindIcon size={100} />
        </Link>
        <p className={styles.title}>
          {"Talk to "}
          <span className={styles.primary_text}>MedImind</span>
        </p>
        <div className={styles.form_container}>
          <FormProvider {...methods}>
            <EmailLogin />
          </FormProvider>
        </div>
      </section>
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
