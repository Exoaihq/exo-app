import { Fragment, useEffect } from "react";
import { ChatUserType } from "../api";
import {
  useMessageContext,
  useScratchPadContext,
  useSessionContext,
} from "../context";

import { useWindowWidth } from "../hooks/screenSize";
import ChatHeader from "./chat/chatHeader";
import ChatHistory from "./chat/chatHistory";
import ChatInput from "./chat/chatInput";
import LoginForm from "./Login";
import ScratchPadContainer from "./scratchPad/scratchPadContainer";
import ScratchPadHeader from "./scratchPad/scratchPadHeader";

const MainPage = () => {
  const { session, baseApiUrl, sessionId } = useSessionContext();

  const { activeTab, setActiveTab } = useScratchPadContext();
  const { useCreateMessage } = useMessageContext();

  const breakPoint = 768;
  const screenWidth = useWindowWidth();

  async function handleSubmit(value: string) {
    await useCreateMessage.mutate({
      message: {
        role: ChatUserType.user,
        content: value,
      },
      baseApiUrl,
      session,
      sessionId,
    });
  }

  useEffect(() => {
    if (screenWidth < breakPoint) {
      setActiveTab("Chat");
    }
  }, [screenWidth]);

  return (
    <div>
      {session && (
        <div className="min-w-full border rounded grid md:grid-cols-3 grid-cols-2 divide-x">
          <div className="col-span-2">
            <ChatHeader />
            {screenWidth > breakPoint ? (
              <Fragment>
                <ChatHistory />
                <ChatInput handleSubmit={handleSubmit} />
              </Fragment>
            ) : (
              <div>
                {activeTab === "Chat" ? (
                  <Fragment>
                    <ChatHistory />
                    <ChatInput handleSubmit={handleSubmit} />{" "}
                  </Fragment>
                ) : (
                  <ScratchPadContainer />
                )}
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <ScratchPadHeader />
            <ScratchPadContainer />
          </div>
        </div>
      )}
      {!session && (
        <div className="flex flex-col h-screen">
          <ChatHeader />
          <LoginForm />
        </div>
      )}
    </div>
  );
};

export default MainPage;
