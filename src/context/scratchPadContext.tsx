import { createContext, useContext, useState } from "react";

export const ScratchPadContextWrapper = (props: any) => {
  const [activeTab, setActiveTab] = useState("Scratch Pad");

  const value = { activeTab, setActiveTab };
  return (
    <ScratchPadContext.Provider value={value}>
      {props.children}
    </ScratchPadContext.Provider>
  );
};

export const ScratchPadContext = createContext({
  activeTab: "Scratch Pad",
  setActiveTab: null,
});

export const useScratchPadContext = () => useContext(ScratchPadContext);
