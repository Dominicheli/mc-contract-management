import { ThemeConfig, theme as antdTheme } from "antd";
import { createContext, useContext, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme") as ThemeMode) || "light";
  });

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  const themeConfig: ThemeConfig = {
    algorithm:
      mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#3b82f6",
      ...(mode === "dark" && {
        colorBgBase: "#1e293b",
        colorBgContainer: "#334155",
        colorText: "#e2e8f0",
        colorBorder: "#475569",
        colorTextDescription: "#94a3b8",
      }),
    },
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
