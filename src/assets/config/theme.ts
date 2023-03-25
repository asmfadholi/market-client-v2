import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const generateTheme = (isDark: boolean) => {
  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: "#19316C",
      },
      secondary: {
        main: "#094067",
      },
      error: {
        main: "#ff4d4d",
      },
    },
  });
};

export default generateTheme;
