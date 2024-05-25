import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EditorComponent from "./pages/EditorComponent";
import "./components/css/App.css"
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorComponent />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App
