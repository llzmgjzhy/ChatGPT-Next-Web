"use client";

import { Analytics } from "@vercel/analytics/react";

import { getServerSideConfig } from "../../config/server";
import { Chat } from "@/app/components/chat";
import { PdfBook } from "@/app/components/pdf-preview";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";
import { useChatNotificationsSync } from "./hooks/useChatNotificationsSync";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMobileScreen } from "@/app/utils";

const serverConfig = getServerSideConfig();

export default function ChatPage() {
  const { session } = useSupabase();
  const isMobileScreen = useMobileScreen();
  useChatNotificationsSync();

  useEffect(() => {
    if (session?.user == undefined) {
      redirectToLogin();
    }
  }, [session?.user]);

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Chat />
        </ResizablePanel>
        <ResizableHandle withHandle />
        {!isMobileScreen && (
          <ResizablePanel>
            <PdfBook />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
      {/* {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )} */}
    </>
  );
}
