import { Fragment, useEffect } from "react";
import { QueryClient, useMutation } from "react-query";
import { ChatUserType, fileUpload } from "../api";
import {
  useCodeCompletionContext,
  useDirectoryContext,
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

const queryClient = new QueryClient();

const MainPage = () => {
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const { loading, setLoading, handleGetFile, setContent } =
    useCodeCompletionContext();
  const { selectedFile, setSelectedFile } = useDirectoryContext();

  const { activeTab, setActiveTab } = useScratchPadContext();
  const { setNewFile } = useDirectoryContext();
  const { useCreateMessage } = useMessageContext();

  const breakPoint = 768;
  const screenWidth = useWindowWidth();

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  const useFileUploadMutation = useMutation(fileUpload, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("messages");
      const { metadata } = res;
      const { newFile } = metadata;

      newFile !== null && setNewFile(newFile);
    },
    onError(error: Error) {
      console.log(error);
      // setHistory([
      //   ...history,
      //   { role: ChatUserType.assistant, content: getFunnyErrorMessage() },
      // ]);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleFileUpload = async (value: string, contentToUpdate: string) => {
    setLoading(true);

    useFileUploadMutation.mutate({
      baseApiUrl,
      session,
      codeContent: contentToUpdate,
      fullFilePathWithName: selectedFile ? selectedFile.path : "",
      sessionId,
    });
  };

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

  // async function startStream() {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     video: false,
  //   });

  //   const context = new AudioContext();
  //   const destination = context.createMediaStreamDestination();

  //   const source = context.createMediaStreamSource(stream);
  //   const voiceGain = context.createGain();
  //   voiceGain.gain.value = 0.7;
  //   source.connect(voiceGain).connect(destination);

  //   console.log("Audio stream started", stream);
  //   setTimeout(() => {
  //     destination.
  //     stream.getTracks().forEach((track) => track.stop());
  //     stream.getAudioTracks().forEach((track) => console.log(track));
  //   }, 4000);
  //   stream.getTracks().forEach((track) => track.on);
  //   return stream;
  // }

  useEffect(() => {
    if (selectedFile) {
      handleGetFile(selectedFile.path).then((content) => {
        setContent(content);

        if (content) {
          handleFileUpload("Here is a file I'd like to update", content);
        }
      });
    }
  }, [selectedFile]);

  useEffect(() => {
    if (screenWidth < breakPoint) {
      setActiveTab("Chat");
    }

    if (screenWidth > breakPoint) {
      setActiveTab("Scratch Pad");
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
                <ChatHistory loading={loading} />
                <ChatInput handleSubmit={handleSubmit} />
              </Fragment>
            ) : (
              <div>
                {activeTab === "Chat" ? (
                  <Fragment>
                    <ChatHistory loading={loading} />
                    <ChatInput handleSubmit={handleSubmit} />{" "}
                  </Fragment>
                ) : (
                  <ScratchPadContainer handleFileSelect={handleFileSelect} />
                )}
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <ScratchPadHeader />
            <ScratchPadContainer handleFileSelect={handleFileSelect} />
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
