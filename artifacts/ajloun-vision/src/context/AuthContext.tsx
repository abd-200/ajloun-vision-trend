import { createContext, useContext, ReactNode } from "react";
import { useGetMe } from "@workspace/api-client-react";

type AuthUser = {
  id: number;
  email: string;
  fullNameAr: string;
  fullName: string;
  role: string;
  totalPoints: number;
  volunteerPoints: number;
  trainingPoints: number;
  activityPoints: number;
  avatarUrl?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useGetMe();

  return (
    <AuthContext.Provider value={{
      user: user as AuthUser | null ?? null,
      isLoading,
      isAdmin: (user as AuthUser | null)?.role === "admin",
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
