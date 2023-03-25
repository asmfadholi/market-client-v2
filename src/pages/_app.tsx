import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import generateTheme from "@/assets/config/theme";
import ThemeProviderContext, { useThemeStates } from "@/contexts/themeContext";

function App({ Component, pageProps }: AppProps) {
  const { isDark } = useThemeStates();

  return (
    <ThemeProvider theme={generateTheme(isDark)}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default function WrapperApp(props: AppProps) {
  return (
    <ThemeProviderContext>
      <App {...props} />
    </ThemeProviderContext>
  );
}
