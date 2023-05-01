/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateExoConfig } from "../api/exoConfig";
import { ExoConfigType } from "../components/repos/saveRepoItem";

import { useSessionContext } from "./sessionContext";

export const ExoConfigContextWrapper = (props: {
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
  exoConfig: ExoConfigType;
  configSnippetId: number;
}): JSX.Element => {
  const { directoryName, explanation, codeStandards, testFrameworks } =
    props.exoConfig;

  const useUpdateExoConfig = useMutation(updateExoConfig, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries("directory");
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const queryClient = useQueryClient();
  const { session, baseApiUrl, sessionId } = useSessionContext();
  const [loading, setLoading] = useState(false);

  const [editExplanation, setEditExplanation] = useState(false);
  const [editCodeStandards, setEditCodeStandards] = useState(false);

  const [updatedExplanation, setUpdatedExplanation] = useState(
    explanation || ""
  );
  const [updatedCodeStandards, setUpdatedCodeStandards] = useState(
    codeStandards || []
  );

  function handleUpdateCodeStandards(index: number, value: string) {
    const updatedCodeStandards = [...codeStandards];
    updatedCodeStandards[index] = value;
    setUpdatedCodeStandards(updatedCodeStandards);
  }

  function handleSaveExplanation() {
    setEditExplanation(false);
    setLoading(true);
    useUpdateExoConfig.mutate({
      baseApiUrl,
      session,
      exoConfig: {
        directoryName,
        explanation: updatedExplanation,
        codeStandards: updatedCodeStandards,
        testFrameworks,
      },
      snippetId: props.configSnippetId,
      sessionId,
    });
  }

  function handleSaveCodeStandards() {
    setEditCodeStandards(false);
    setLoading(true);
    useUpdateExoConfig.mutate({
      baseApiUrl,
      session,
      exoConfig: {
        directoryName,
        explanation: updatedExplanation,
        codeStandards: updatedCodeStandards,
        testFrameworks,
      },
      snippetId: props.configSnippetId,
      sessionId,
    });
  }
  function handleRemoveStandard(index: number) {
    const updatedCodeStandards = [...codeStandards];
    updatedCodeStandards.splice(index, 1);
    setUpdatedCodeStandards(updatedCodeStandards);
  }

  function addCodeStandard() {
    const updatedCodeStandards = [...codeStandards];
    updatedCodeStandards.unshift("");
    setUpdatedCodeStandards(updatedCodeStandards);
  }

  const value = {
    directoryName,
    handleSaveCodeStandards,
    handleSaveExplanation,
    setUpdatedExplanation,
    handleUpdateCodeStandards,
    setEditExplanation,
    explanation,
    codeStandards,
    editExplanation,
    updatedExplanation,
    editCodeStandards,
    setEditCodeStandards,
    updatedCodeStandards,
    loading,
    handleRemoveStandard,
    addCodeStandard,
  };
  return (
    <ExoConfigContext.Provider value={value}>
      {props.children}
    </ExoConfigContext.Provider>
  );
};

export const ExoConfigContext = createContext({
  directoryName: "",
  handleSaveCodeStandards: () => {},
  handleSaveExplanation: () => {},
  explanation: "",
  codeStandards: [],
  setUpdatedExplanation: (explanation: string) => {},
  handleUpdateCodeStandards: (index: number, value: string) => {},
  setEditExplanation: (editExplanation: boolean) => {},
  editExplanation: false,
  updatedExplanation: "",
  editCodeStandards: false,
  setEditCodeStandards: (editCodeStandards: boolean) => {},
  updatedCodeStandards: [],
  loading: false,
  handleRemoveStandard: (index: number) => {},
  addCodeStandard: () => {},
});

export const useExoConfigContext = () => useContext(ExoConfigContext);
