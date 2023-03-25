import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import carImage from "../assets/images/car.jpeg";
import { SxProps, Theme } from "@mui/material";
import axios from "axios";
import { useSnackbarActions } from "@/contexts/snackbarContext";

function Copyright({ sx }: { sx: SxProps<Theme> }) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={sx}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Pazarin
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const LOGIN_URL = () => `${process.env.NEXT_PUBLIC_BASE_URL}/auth/local`;

interface LoginError {
  data: null;
  error: Error;
}

interface Error {
  status: number;
  name: string;
  message: string;
}

interface LoginResponse {
  jwt: string;
  user: User;
}

interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SaveJwtResponse {
  success: boolean;
  message: string;
}

export default function SignInSide() {
  const { setShowSnackbar } = useSnackbarActions();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const resLogin = await axios.post<LoginResponse>(LOGIN_URL(), {
        identifier: data.get("username"),
        password: data.get("password"),
      });

      const getJwt = resLogin.data.jwt;
      const resSaveJwtCookie = await axios.post<SaveJwtResponse>(
        "/api/set-jwt-cookie",
        {
          jwt: getJwt,
        }
      );

      const messageSuccess = resSaveJwtCookie?.data?.message;
      setShowSnackbar({
        show: true,
        message: messageSuccess,
        type: "success",
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const getDataError = err.response?.data as LoginError;
        setShowSnackbar({
          show: true,
          message: getDataError?.error?.message,
          type: "error",
        });
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${carImage.src})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
