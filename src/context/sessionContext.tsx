/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const SessionContextWrapper = (props: any) => {
  const [baseApiUrl, setBaseApiUrl] = useState("http://localhost:8081");
  const [sessionId, setSessionId] = useState(uuidv4());
  const [session, setSession] = useState(null);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProd, setIsProd] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnon, setSupabaseAnon] = useState("");
  const [supabase, setSupabase] = useState(null);

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

  async function handleSignup(email: string, password: string) {
    const res = await supabase.auth.signUp({
      email,
      password,
    });

    console.log(res);

    if (res.error) {
      setLoginErrorMessage(res.error.message);
    } else {
      setSession(res.data.session);
      setSuccessMessage(
        "Account created successfully! Confirm your email and then log in."
      );
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
      window.api.getEnvVariables().then((res) => {
        setBaseApiUrl(res.baseApiUrl);
        setSupabaseUrl(res.supabaseUrl);
        setSupabaseAnon(res.supabaseAnon);

        if (res.baseApiUrl.includes("localhost")) {
          setIsProd(false);
        } else {
          setIsProd(true);
        }
      });
    }
  }, [window]);

  useEffect(() => {
    if (supabaseAnon && supabaseUrl) {
      setSupabase(createClient(supabaseUrl, supabaseAnon));
    }
  }, [supabaseAnon, supabaseUrl]);

  useEffect(() => {
    if (supabase) {
      getSession();
    }
  }, [supabase]);

  const value = {
    session,
    sessionId,
    handleLogin,
    handleLogout,
    getSession,
    baseApiUrl,
    loginErrorMessage,
    setLoading,
    loading,
    handleSignup,
    isProd,
    successMessage,
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
  setLoading: (value: boolean) => {},
  loading: false,
  handleSignup: (email: string, password: string) => {},
  isProd: false,
  successMessage: null,
});

export const useSessionContext = () => useContext(SessionContext);
