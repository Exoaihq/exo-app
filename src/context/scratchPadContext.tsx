import { createContext, useContext, useState } from "react";

export type ActiveTab = "Scratch Pad" | "Repos" | "Chat" | "Search";

export const ScratchPadContextWrapper = (props: any) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Repos");

  const value = { activeTab, setActiveTab };
  return (
    <ScratchPadContext.Provider value={value}>
      {props.children}
    </ScratchPadContext.Provider>
  );
};

export const ScratchPadContext = createContext({
  activeTab: "Repos" as ActiveTab,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setActiveTab: (activeTab: ActiveTab) => {},
});

export const useScratchPadContext = () => useContext(ScratchPadContext);
