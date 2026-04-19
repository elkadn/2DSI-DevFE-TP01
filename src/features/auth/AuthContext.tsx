// src/features/auth/AuthContext.tsx

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useEffect,
} from "react";

import { authReducer, initialState } from "./authReducer";
import type { AuthAction, AuthState } from "./authReducer";
import { setAuthToken } from "../../api/axios";

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔥 FIX TOKEN AUTO
  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }

  return context;
}