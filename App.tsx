import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/components/HomeScreen";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

function AppShell() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <HomeScreen />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
