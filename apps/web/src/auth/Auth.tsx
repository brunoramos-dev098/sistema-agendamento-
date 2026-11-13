import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { Registro } from "../types";
export type Conta = {
  id: string;
  email: string;
  perfil: "CLIENTE" | "PROFISSIONAL" | "ADMINISTRADOR";
  clienteId: string | null;
  profissionalId: string | null;
  dados: Registro;
};
const Context = createContext<{
  user: Conta | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Conta | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();
  const refresh = async () => {
    qc.clear();
    setUser(await api<Conta>("auth/me"));
  };
  const logout = async () => {
    await api("auth/logout", "POST");
    qc.clear();
    sessionStorage.removeItem("checkapp.clienteId");
    setUser(null);
  };
  useEffect(() => {
    let active = true;
    api<Conta>("auth/me")
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const expired = () => {
      qc.clear();
      setUser(null);
    };
    window.addEventListener("checkapp:unauthorized", expired);
    return () => {
      active = false;
      window.removeEventListener("checkapp:unauthorized", expired);
    };
  }, [qc]);
  return (
    <Context.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error("AuthProvider ausente");
  return value;
}
