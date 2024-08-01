"use client";

import { createContext, useState } from "react";

import { MobileSidebarContextProps } from "./types";

export const MobileSidebarContext = createContext<
  MobileSidebarContextProps | undefined
>(undefined);

export const MobileSidebarProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(true);

  return (
    <MobileSidebarContext.Provider
      value={{
        showMobileSidebar,
        setShowMobileSidebar,
      }}
    >
      {children}
    </MobileSidebarContext.Provider>
  );
};
