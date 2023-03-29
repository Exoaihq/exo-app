/* eslint-disable @typescript-eslint/no-empty-function */
import { createClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  "https://xexjtohvdexqxpomspdb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGp0b2h2ZGV4cXhwb21zcGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzMDg0MjYsImV4cCI6MTk5Mzg4NDQyNn0.-3oqirs2PwoAS42jmB47QE-A1GSyUBxsdLsNz_8dDgk"
);

export const SessionContextWrapper = (props: any) => {
  const [baseApiUrl, setBaseApiUrl] = useState(
    "https://code-gen-server.herokuapp.com"
  );
  const [sessionId, setSessionId] = useState(uuidv4());
  const [session, setSession] = useState(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);

  async function handleLogin(email: string, password: string) {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (res.error) {
      setLoginErrorMessage(res.error.message);
    } else {
      setSession(res.data.session);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  async function getSession() {
    const returnedSession = await supabase.auth.getSession();

    setSession(returnedSession.data.session);
  }

  useEffect(() => {
    if (window) {
      window.api.getBaseApiUrl().then((res) => {
        console.log("res ", res);
        setBaseApiUrl(res);
      });
      getSession();
    }
  }, [window]);

  const value = {
    session,
    sessionId,
    handleLogin,
    handleLogout,
    getSession,
    baseApiUrl,
    loginErrorMessage,
  };
  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
};

export const SessionContext = createContext({
  session: null,
  sessionId: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleLogin: (_email: string, password: string) => {},
  handleLogout: () => {},
  getSession: () => {},
  baseApiUrl: "",
  loginErrorMessage: null,
});

export const useSessionContext = () => useContext(SessionContext);
