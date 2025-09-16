import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type UserPayload = {
  sub: string;       // userId
  email: string;
  role: string;
  filialId?: string; // opcional, se o user estiver vinculado
  exp: number;       // expiração do token
};

type AuthContextType = {
  user: UserPayload | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);

  // Ler token do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: UserPayload = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: UserPayload = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro do AuthProvider");
  return ctx;
}
