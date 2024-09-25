import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    h1: {
      fontSize: "2rem",
    },
    fontFamily: ["Poppins"],
  },
});

export default theme;
