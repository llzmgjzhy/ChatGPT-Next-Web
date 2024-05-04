/* eslint-disable @next/next/no-page-custom-font */
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import "./globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";
import { getClientConfig } from "./config/client";
import { type Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getServerSideConfig } from "./config/server";
import { GoogleTagManager } from "@next/third-parties/google";
import { SupabaseProvider } from "@/lib/context/SupabaseProvider";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/toaster";
const serverConfig = getServerSideConfig();

export const metadata: Metadata = {
  title: "MedImind",
  description: "Study with MedImind",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
  appleWebApp: {
    title: "MedImind",
    statusBarStyle: "default",
  },
};

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> => {
  /**
   * The Supabase client instance.
   */
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>
        <meta name="config" content={JSON.stringify(getClientConfig())} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <script src="/serviceWorkerRegister.js" defer></script>
      </head>
      <body>
        <SupabaseProvider session={session}>{children}</SupabaseProvider>
        <Toaster />
        {serverConfig?.isVercel && (
          <>
            <SpeedInsights />
          </>
        )}
        {serverConfig?.gtmId && (
          <>
            <GoogleTagManager gtmId={serverConfig.gtmId} />
          </>
        )}
      </body>
    </html>
  );
};
export default RootLayout;

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {

//   return (
//     <html lang="en">
//       <head>
//         <meta name="config" content={JSON.stringify(getClientConfig())} />
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
//         />
//         <link rel="manifest" href="/site.webmanifest"></link>
//         <script src="/serviceWorkerRegister.js" defer></script>
//       </head>
//       <body>
//         <SupabaseProvider session={session}>{children}</SupabaseProvider>
//         {serverConfig?.isVercel && (
//           <>
//             <SpeedInsights />
//           </>
//         )}
//         {serverConfig?.gtmId && (
//           <>
//             <GoogleTagManager gtmId={serverConfig.gtmId} />
//           </>
//         )}
//       </body>
//     </html>
//   );
// }
