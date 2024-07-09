"use client";

import { Analytics } from "@vercel/analytics/react";

// import { Home } from "../../components/home";

import { getServerSideConfig } from "../../config/server";
import { Chat } from "@/app/components/chat";
import { PdfBook } from "@/app/components/pdf-preview";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";
import { useChatNotificationsSync } from "./hooks/useChatNotificationsSync";
import "./page.scss";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const serverConfig = getServerSideConfig();

export default function ChatPage() {
  const { session } = useSupabase();
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
        <ResizablePanel>
          <PdfBook />
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )} */}
    </>
  );
}
