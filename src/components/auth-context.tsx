import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { isFirebaseConfigured, observeBoloAuth, type BoloUser } from "@/lib/firebase";

type AuthContextValue = {
  user: BoloUser | null;
  loading: boolean;
  configured: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, loading: false, configured: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BoloUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeBoloAuth((nextUser) => {
      if (nextUser) {
        document.cookie = "bolo_session=1; Path=/; Max-Age=2592000; SameSite=Lax";
      } else {
        document.cookie = "bolo_session=; Path=/; Max-Age=0; SameSite=Lax";
      }
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, configured: isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
