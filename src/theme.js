import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "#2F1888",
        },
        secondary: {
          main: "#2837BA",
        },
        divider: ["#868e96"]
      }
    }
  },
  palette: {
    primary: {
      main: "#2F1888",
    },
    secondary: {
      main: "#2837BA",
    },
    divider: ["#868e96"]
  },
  typography: {
    h1: {
      fontSize: "2rem",
    },
    fontFamily: ["Poppins"],
  },
});

export default theme;
