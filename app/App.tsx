"use client";

import { SideBar } from "./components/sidebar";
import styles from "./components/home.module.scss";
import { PropsWithChildren } from "react";
import { HashRouter as Router } from "react-router-dom";
import { useAppConfig } from "@/app/store/config";
import { getClientConfig } from "@/app/config/client";
import { useMobileScreen } from "@/app/utils";
import { getLang } from "@/app/locales";
import { ChatsProvider } from "@/lib/context/ChatsProvider";
import { ChatProvider } from "@/lib/context";
import { AskDirectProvider } from "@/lib/context/AskDirectProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSupabase } from "@/lib/context/SupabaseProvider";

const App = ({ children }: PropsWithChildren): JSX.Element => {
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const shouldTightBorder =
    getClientConfig()?.isApp || (config.tightBorder && !isMobileScreen);
  const session = useSupabase();

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
          {session.session && <SideBar className={styles["sidebar-show"]} />}
          <div
            className={
              session.session
                ? styles["window-content"]
                : "flex justify-center items-center w-full h-full"
            }
          >
            {children}
          </div>
        </div>
      </Router>
    </>
  );
};

const queryClient = new QueryClient();

const AppWithQueryClient = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AskDirectProvider>
          <ChatsProvider>
            <ChatProvider>
              <App>{children}</App>
            </ChatProvider>
          </ChatsProvider>
        </AskDirectProvider>
      </QueryClientProvider>
    </>
  );
};

export { AppWithQueryClient as App };
