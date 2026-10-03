/**
 * AuthContext — powered by Supabase.
 * Exposes: user, profile, loading, configured, hasProfile, setProfile
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  isSupabaseConfigured,
  observeBoloAuth,
  getUserProfile,
  type BoloUser,
  type UserProfile,
} from "@/lib/supabase";

type AuthContextValue = {
  user: BoloUser | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  /** True once we've confirmed whether a profile row exists */
  profileChecked: boolean;
  /** True only if session exists AND a profile row exists */
  hasProfile: boolean;
  /** Update the profile in-context immediately after save (avoids white screen) */
  setProfile: (profile: UserProfile | null) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  configured: false,
  profileChecked: false,
  hasProfile: false,
  setProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BoloUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = observeBoloAuth(async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        // Set session cookie for edge middleware
        const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
        const secureFlag = isHttps ? "; Secure" : "";
        document.cookie = `bolo_session=1; Path=/; Max-Age=2592000; SameSite=Lax${secureFlag}`;

        // Fetch the profile row
        const prof = await getUserProfile(nextUser.uid);
        setProfile(prof);
        setProfileChecked(true);
      } else {
        // Clear session cookie
        const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
        const secureFlag = isHttps ? "; Secure" : "";
        document.cookie = `bolo_session=; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`;
        setProfile(null);
        setProfileChecked(true);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const hasProfile = Boolean(user && profile);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        configured: isSupabaseConfigured,
        profileChecked,
        hasProfile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
