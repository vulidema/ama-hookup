import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/auth";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email || "",
        });
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const subscription = authService.onAuthStateChange((authUser) => {
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signUp: async (email: string, password: string) => {
      await authService.signUpWithEmail(email, password);
    },
    signIn: async (email: string, password: string) => {
      await authService.signInWithEmail(email, password);
    },
    signInWithGoogle: async () => {
      await authService.signInWithGoogle();
    },
    signOut: async () => {
      await authService.signOut();
      setUser(null);
    },
    resetPassword: async (email: string) => {
      await authService.resetPassword(email);
    },
    updatePassword: async (newPassword: string) => {
      await authService.updatePassword(newPassword);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};