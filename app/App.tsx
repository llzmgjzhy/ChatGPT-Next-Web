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
import {
  useMobileSidebarContext,
  MobileSidebarProvider,
} from "@/lib/context/MobileSidebarProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PdfBook } from "@/app/components/pdf-preview";

const App = ({ children }: PropsWithChildren): JSX.Element => {
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const shouldTightBorder =
    getClientConfig()?.isApp || (config.tightBorder && !isMobileScreen);
  const session = useSupabase();
  const { showMobileSidebar } = useMobileSidebarContext();

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
          {session.session && (
            <SideBar
              className={showMobileSidebar ? styles["sidebar-show"] : ""}
            />
          )}
          <div
            className={
              session.session
                ? styles["window-content"]
                : "flex justify-center items-center w-full h-full"
            }
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>{children}</ResizablePanel>
              <ResizableHandle withHandle />
              {!isMobileScreen && session.session && (
                <ResizablePanel>
                  <PdfBook />
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
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
        <MobileSidebarProvider>
          <AskDirectProvider>
            <ChatsProvider>
              <ChatProvider>
                <App>{children}</App>
              </ChatProvider>
            </ChatsProvider>
          </AskDirectProvider>
        </MobileSidebarProvider>
      </QueryClientProvider>
    </>
  );
};

export { AppWithQueryClient as App };
