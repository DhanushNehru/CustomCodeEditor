// App.js
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import EditorComponent from "./pages/EditorComponent";
import { lightTheme, darkTheme } from "./theme";
import SnackbarProvider from "./components/js/SnackbarProvider";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <EditorComponent darkMode={darkMode} toggleTheme={toggleTheme} />
              }
            />
            <Route
              path="/editor"
              element={
                <EditorComponent darkMode={darkMode} toggleTheme={toggleTheme} />
              }
            />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
