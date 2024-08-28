import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import EditorComponent from "./pages/EditorComponent";
import theme from "./theme";
import SnackbarProvider from "./components/js/SnackbarProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
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

export default App
