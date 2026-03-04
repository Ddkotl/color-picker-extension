import { ThemeProvider, useTheme } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";


export function AppProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
        <Toaster theme={theme as "light" | "dark" | "system"}
          position="bottom-center" />
      </ThemeProvider>
    </>
  );
}