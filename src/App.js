import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import LandingPage from "./pages/LandingPage";
import EditorComponent from "./pages/EditorComponent";
import "./components/css/App.css"
import theme from "./theme";
import SnackbarProvider from "./components/js/SnackbarProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/editor" element={<EditorComponent />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App
