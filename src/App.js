import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import EditorComponent from "./pages/EditorComponent";
import theme from "./theme";
import SnackbarProvider from "./components/js/SnackbarProvider";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<EditorComponent/>} />
              <Route path="/editor" element={<EditorComponent />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
