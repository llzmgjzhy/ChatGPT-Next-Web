import { useContext } from "react";

import { MobileSidebarContext } from "../MobileSidebarProvider";
import { MobileSidebarContextProps } from "../types";

export const useMobileSidebarContext = (): MobileSidebarContextProps => {
  const context = useContext(MobileSidebarContext);

  if (context === undefined) {
    throw new Error(
      "useAskDirectContext must be used inside AskDirectProvider",
    );
  }

  return context;
};
