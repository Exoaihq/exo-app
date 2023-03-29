import { createContext, useContext } from "react";
import { useQuery } from "react-query";
import { getDirectories } from "../api";
import { useSessionContext } from "./sessionContext";

export const DirectoryContextWrapper = (props: any) => {
  const { session, baseApiUrl, sessionId } = useSessionContext();

  console.log("session id ", sessionId);
  console.log("session ", session);
  console.log("baseApiUrl ", baseApiUrl);

  const { data } = useQuery({
    queryKey: "directory",
    queryFn: () => getDirectories({ session, baseApiUrl, sessionId }),
    enabled: !!session,
  });

  const value = { directories: data };
  return (
    <DirectoryContext.Provider value={value}>
      {props.children}
    </DirectoryContext.Provider>
  );
};

export const DirectoryContext = createContext({ directories: null });

export const useDirectoryContext = () => useContext(DirectoryContext);
