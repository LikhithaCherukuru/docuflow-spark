import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type DoctorUser } from "@/services/auth.service";

type AuthCtx = {
  user: DoctorUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string,
    remember?: boolean,
  ) => Promise<void>;

  signup: (p: {
    fullName: string;
    hospital: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;

  logout: () => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<DoctorUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = authService.getStoredUser();

    setUser(stored);

    if (authService.getToken()) {
      authService
        .me()
        .then(setUser)
        .catch(() => {
          setUser(null);
          authService.logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      remember?: boolean,
    ) => {
      await authService.login({
        email,
        password,
        remember,
      });

      const user = await authService.me();

      setUser(user);
    },
    [],
  );

  const signup = useCallback(
    async (p: Parameters<AuthCtx["signup"]>[0]) => {
      await authService.signup(p);

      await authService.login({
        email: p.email,
        password: p.password,
      });

      const user = await authService.me();

      setUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const user = await authService.me();
    setUser(user);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      refresh,
    }),
    [user, loading, login, signup, logout, refresh],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }

  return ctx;
}