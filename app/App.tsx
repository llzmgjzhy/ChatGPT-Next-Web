"use client";

import { SideBar } from "./components/sidebar";
import styles from "./components/home.module.scss";
import { PropsWithChildren } from "react";
import { HashRouter as Router } from "react-router-dom";
import { useAppConfig } from "@/app/store/config";
import { getClientConfig } from "@/app/config/client";
import { useMobileScreen } from "@/app/utils";
import { getLang } from "@/app/locales";

const App = ({ children }: PropsWithChildren): JSX.Element => {
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const shouldTightBorder =
    getClientConfig()?.isApp || (config.tightBorder && !isMobileScreen);
  return (
    <>
      <Router>
        <div
          className={
            styles.container +
            ` ${shouldTightBorder ? styles["tight-container"] : styles.container} ${
              getLang() === "ar" ? styles["rtl-screen"] : ""
            }`
          }
        >
          <SideBar className={styles["sidebar-show"]} />
          <div className={styles["window-content"]}> {children}</div>
        </div>
      </Router>
    </>
  );
};

const AppWithQueryClient = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <>
      <App>{children}</App>
    </>
  );
};

export { AppWithQueryClient as App };
