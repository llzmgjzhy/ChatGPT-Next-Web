import { Analytics } from "@vercel/analytics/react";

import { Home } from "./components/home";

import { getServerSideConfig } from "./config/server";

import Login from "@/app/(auth)/login/page";
import { Suspense } from "react";

const Main = (): JSX.Element => {
  return <Login />;
};

const serverConfig = getServerSideConfig();

export default async function App() {
  return (
    // <>
    //   <Home />
    //   {serverConfig?.isVercel && (
    //     <>
    //       <Analytics />
    //     </>
    //   )}
    // </>
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="relative h-full w-full flex justify-stretch items-stretch overflow-auto">
        <div className="flex-1 overflow-scroll">
          <Suspense fallback="Loading...">
            <Main />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
