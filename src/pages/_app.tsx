import type { AppContext, AppProps } from "next/app";
import NextApp from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import generateTheme from "@/assets/config/theme";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProviderContext, { useThemeStates } from "@/contexts/themeContext";
import SnackbarProvider from "@/contexts/snackbarContext";
import Drawer from "@/_shared/Drawer";
import { Box } from "@mui/material";
import axios from "axios";
import AuthProvider from "@/contexts/authContext";
import { useRouter } from "next/router";

function App({ Component, pageProps }: AppProps) {
  const { isDark } = useThemeStates();

  const { pathname } = useRouter();
  const isLoginPage = pathname === "/login";
  const Layout = !isLoginPage ? Drawer : Box;

  return (
    <ThemeProvider theme={generateTheme(isDark)}>
      <Layout>
        <Component {...pageProps} />
        <CssBaseline />
      </Layout>
    </ThemeProvider>
  );
}

export default function WrapperApp(
  props: AppProps & { detailUser: UserDetail }
) {
  return (
    <ThemeProviderContext>
      <AuthProvider initDetailUser={props.detailUser}>
        <SnackbarProvider>
          <App {...props} />
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProviderContext>
  );
}

const USER_DETAIL_API = `${process.env.NEXT_PUBLIC_BASE_URL}/users/me`;

interface UserDetail {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  jwt: string;
}

WrapperApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  try {
    const { ctx } = appContext;
    const { req } = ctx;
    const host = ctx.req?.headers.host;
    const httpHost = `http://${ctx.req?.headers.host}`;
    const resGetJwt = await axios.get<{ jwt: string }>(
      `${host ? httpHost : ""}/api/get-jwt-cookie`,
      {
        headers: {
          cookie: req?.headers.cookie,
        },
      }
    );
    const getJwt = resGetJwt.data.jwt;

    const resGetDetailUser = await axios.get<UserDetail>(USER_DETAIL_API, {
      headers: {
        Authorization: `Bearer ${getJwt}`,
      },
    });

    return {
      ...appProps,
      detailUser: { ...resGetDetailUser.data, jwt: getJwt },
    };
  } catch {
    // failed to get detail and return as non login user
    return {
      ...appProps,
      detailUser: {
        id: 0,
        username: "",
        email: "",
        provider: "",
        confirmed: false,
        blocked: false,
        createdAt: "",
        updatedAt: "",
        jwt: "",
      },
    };
  }
};
