"use client";

import { Analytics } from "@vercel/analytics/react";

// import { Home } from "../../components/home";

import { getServerSideConfig } from "../../config/server";
import { Chat } from "@/app/components/homework";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { redirectToLogin } from "@/lib/router/redirectToLogin";

const serverConfig = getServerSideConfig();

export default function HomeworkPage() {
  const { session } = useSupabase();

  useEffect(() => {
    if (session?.user == undefined) {
      redirectToLogin();
    }
  }, [session?.user]);

  return (
    <>
      <Chat />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
}
