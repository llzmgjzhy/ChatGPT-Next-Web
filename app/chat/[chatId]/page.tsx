import { Analytics } from "@vercel/analytics/react";

import { Home } from "../../components/home";

import { getServerSideConfig } from "../../config/server";
import { Chat } from "@/app/components/chat";

const serverConfig = getServerSideConfig();

export default function ChatPage() {
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
