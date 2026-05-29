/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const Ctx = createContext<ThemeContextType | null>(null);

const KEY = "ahms_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? (localStorage.getItem(KEY) as Theme | null) : null;

    const prefers =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial: Theme = saved || (prefers ? "dark" : "light");

    setThemeState(initial);

    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);

    document.documentElement.classList.toggle("dark", t === "dark");

    localStorage.setItem(KEY, t);
  };

  return (
    <Ctx.Provider
      value={{
        theme,
        setTheme,
        toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return ctx;
}
