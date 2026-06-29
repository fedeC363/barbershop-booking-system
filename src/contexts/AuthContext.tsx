import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type UserRole = "CLIENTE" | "ADMIN";

type AuthContextValue = {
  isLoading: boolean;
  role: UserRole | null;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async (authenticatedUser: User | null) => {
      if (!isMounted) return;

      setUser(authenticatedUser);
      setRole(null);

      if (!authenticatedUser) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", authenticatedUser.id)
        .maybeSingle();

      if (!isMounted) return;

      const normalizedRole = data?.rol?.toUpperCase();
      setRole(normalizedRole === "ADMIN" ? "ADMIN" : "CLIENTE");
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      void loadUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true);
      void loadUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, role, user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}

export { AuthProvider, useAuth };
