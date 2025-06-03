import { ThemeProvider, useTheme } from "./context/ThemeContext";

import { ConfigProvider } from "antd";
import Routes from "./routes";

function ThemedApp() {
  const { themeConfig } = useTheme();
  return (
    <ConfigProvider theme={themeConfig}>
      <Routes />
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
