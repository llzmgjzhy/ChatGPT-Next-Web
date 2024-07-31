"use client";

import { createContext, useState } from "react";

import { AskDirectContextProps } from "./types";

export const AskDirectContext = createContext<
  AskDirectContextProps | undefined
>(undefined);

export const AskDirectProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [askDirect, setAskDirect] = useState<string>("major");

  return (
    <AskDirectContext.Provider
      value={{
        askDirect,
        setAskDirect,
      }}
    >
      {children}
    </AskDirectContext.Provider>
  );
};
