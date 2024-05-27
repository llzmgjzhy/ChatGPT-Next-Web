import { Analytics } from "@vercel/analytics/react";

import { getServerSideConfig } from "./config/server";
import Login from "@/app/(auth)/login/page";

const serverConfig = getServerSideConfig();

const Main = (): JSX.Element => {
  return <Login />;
};

export default function App() {
  return (
    <>
      <Main />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
}
