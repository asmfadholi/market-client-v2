import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import generateTheme from "@/assets/config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProviderContext, { useThemeStates } from "@/contexts/themeContext";
import SnackbarProvider from "@/contexts/snackbarContext";

function App({ Component, pageProps }: AppProps) {
  const { isDark } = useThemeStates();

  return (
    <ThemeProvider theme={generateTheme(isDark)}>
      <Component {...pageProps} />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default function WrapperApp(props: AppProps) {
  return (
    <ThemeProviderContext>
      <SnackbarProvider>
        <App {...props} />
      </SnackbarProvider>
    </ThemeProviderContext>
  );
}
