"use client";
import { Chat } from "@/app/components/chat";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";
import { useChatNotificationsSync } from "./hooks/useChatNotificationsSync";

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
      <Chat />
      {/* {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )} */}
    </>
  );
}
