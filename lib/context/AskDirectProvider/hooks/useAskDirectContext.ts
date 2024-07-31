import { useContext } from "react";

import { AskDirectContext } from "../AskDirectProvider";
import { AskDirectContextProps } from "../types";

export const useAskDirectContext = (): AskDirectContextProps => {
  const context = useContext(AskDirectContext);

  if (context === undefined) {
    throw new Error("useAskDirectContext must be used inside AskDirectProvider");
  }

  return context;
};
