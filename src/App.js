import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import EditorComponent from "./pages/EditorComponent";
import theme from "./theme";
import SnackbarProvider from "./components/js/SnackbarProvider";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EditorComponent />} />
            <Route path="/editor" element={<EditorComponent />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
