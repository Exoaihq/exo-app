// tsx
import React, { useState } from "react";

interface LoginFormProps {
  handleLogin: (email: string, password: string) => void;
  loginErrorMessage?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleLogin,
  loginErrorMessage,
}) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="w-full h-screen flex  mt-10 justify-center">
      <div className="p-4 bg-slate-200 h-1/2 rounded-lg">
        <h3 className="text-slate-700 font-bold text-lg mt-6">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className=" mt-6">
            <label className="text-sm text-slate-700" htmlFor="username">
              Email:
            </label>
            <input
              className="w-full p-2 bg-white border-2 border-slate-200 rounded-lg"
              type="text"
              id="username"
              value={email}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-700" htmlFor="password">
              Password:
            </label>
            <input
              className="w-full p-2 bg-white border-2 border-slate-200 rounded-lg"
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="px-0.5 mt-6">
            <button
              type="submit"
              className="xl p-3 bg-teal-500 rounded-lg hover:bg-primary-600 text-white"
            >
              Login
            </button>
            {loginErrorMessage && (
              <div className="mt-2 bg-red-100 mb-2 text-sm drop-shadow p-4 text-red-900 rounded-lg">
                {loginErrorMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;