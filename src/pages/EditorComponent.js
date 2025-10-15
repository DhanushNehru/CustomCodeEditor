// src/pages/EditorComponent.js
// (All your existing imports remain the same)
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Avatar,
  Button,
  CircularProgress,
  FormControlLabel,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Editor } from "@monaco-editor/react";
import { FaPlay, FaFileUpload, FaFileDownload, FaCopy, FaTrash } from "react-icons/fa";
import "@fortawesome/fontawesome-free/css/all.css";

import GithubSignIn from "../components/GithubSignIn";
import GoogleSignIn from "../components/GoogleSignIn";
import "../components/css/EditorComponent.css";
import EditorThemeSelect from "../components/js/EditorThemeSelect";
import LanguageSelect from "../components/js/LanguageSelect";
import Stars from "../components/js/Stars";
import ToggleTheme from "../components/js/ToggleTheme";
import { defineEditorTheme } from "../components/js/defineEditorTheme";
import {
  EDITOR_THEMES,
  LANGUAGES,
  judge0SubmitUrl,
  rapidApiHost,
  rapidApiKey,
} from "../constants/constants";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const StyledButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
});

const StyledLayout = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "80%",
  margin: "0.5rem",
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: "1rem",
  "@media (min-width: 1024px)": {
    flexDirection: "row",
    padding: "1.5rem",
    alignItems: "center",
  },
}));

const OutputLayout = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "50vh",
  margin: "1rem 0",
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: "1rem",
  "@media (min-width: 1024px)": {
    height: "30vh",
    padding: "1rem",
  },
}));

const WelcomeText = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: "bold",
}));

function EditorComponent() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0].DEFAULT_LANGUAGE);
  const [languageDetails, setLanguageDetails] = useState(LANGUAGES[0]);
  const [currentEditorTheme, setCurrentEditorTheme] = useState(EDITOR_THEMES[1]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const { currentUser, logOut } = useAuth();

  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const [isImporting, setIsImporting] = useState(false);
  const isImportingRef = useRef(false);
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isDownloading, setDownloading] = useState(false);

  const styles = {
    flex: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    languageDropdown: {
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
    },
    "@media (min-width: 576px)": {
      flex: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.6em",
      },
    },
  };

  useEffect(() => {
    if (isImportingRef.current) return;

    const selectedLanguage = LANGUAGES.find(
      (lang) => lang.DEFAULT_LANGUAGE === currentLanguage
    );
    if (!selectedLanguage) return;

    setLanguageDetails({
      ID: selectedLanguage.ID,
      LANGUAGE_NAME: selectedLanguage.NAME,
      DEFAULT_LANGUAGE: selectedLanguage.DEFAULT_LANGUAGE,
      NAME: selectedLanguage.NAME,
      HELLO_WORLD: selectedLanguage.HELLO_WORLD,
      LOGO: selectedLanguage.LOGO,
    });
    setCode(selectedLanguage.HELLO_WORLD || "");
  }, [currentLanguage]);

  const handleEditorThemeChange = async (_, theme) => {
    if (["light", "vs-dark"].includes(theme.ID)) {
      setCurrentEditorTheme(theme);
    } else {
      setCurrentEditorTheme(theme);
      try {
        await defineEditorTheme(theme);
        setCurrentEditorTheme(theme);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error("Failed defineEditorTheme:", err);
      }
    }
  };

  const getLanguageLogoById = (id) => {
    const language = LANGUAGES.find((lang) => parseInt(lang.ID, 10) === parseInt(id, 10));
    return language ? language.LOGO : null;
  };

  const submitCode = useCallback(async () => {
    if (!editorRef.current) {
      enqueueSnackbar("Editor not ready", { variant: "error" });
      return;
    }
    const codeToSubmit = editorRef.current.getValue() ?? "";
    if (codeToSubmit.trim() === "") {
      enqueueSnackbar("Please enter valid code", { variant: "error" });
      return;
    }

    setLoading(true);
    setOutput([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      const encodedCode = btoa(codeToSubmit);
      const response = await fetch(
        `${judge0SubmitUrl}?base64_encoded=true&wait=false&fields=*`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": rapidApiKey,
            "X-RapidAPI-Host": rapidApiHost,
          },
          body: JSON.stringify({
            source_code: encodedCode,
            language_id: languageDetails.ID,
            stdin: "",
            expected_output: "",
          }),
        }
      );

      if (!response.ok) {
        enqueueSnackbar(`Failed to create submission. Status code: ${response.status}`, { variant: "error" });
        setLoading(false);
        return;
      }

      const data = await response.json();
      const submissionToken = data?.token || data?.id || null;

      if (!submissionToken) {
        enqueueSnackbar("Failed to get submission token", { variant: "error" });
        setLoading(false);
        return;
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `${judge0SubmitUrl}/${submissionToken}?base64_encoded=true&fields=*`,
            {
              method: "GET",
              headers: {
                "X-RapidAPI-Key": rapidApiKey,
                "X-RapidAPI-Host": rapidApiHost,
              },
            }
          );

          if (!res.ok) {
            enqueueSnackbar(`Failed to retrieve output. Status: ${res.status}`, { variant: "error" });
            setLoading(false);
            return;
          }

          const result = await res.json();

          if (result && result.stdout) {
            const decoded = atob(result.stdout);
            setOutput(decoded.split("\n"));
          } else if (result && result.compile_output) {
            const decoded = atob(result.compile_output);
            setOutput(decoded.split("\n"));
            enqueueSnackbar("Compilation error. See output.", { variant: "error" });
          } else if (result && result.stderr) {
            const decoded = atob(result.stderr);
            setOutput(decoded.split("\n"));
            enqueueSnackbar("Runtime error. See output.", { variant: "error" });
          } else if (result && result.message) {
            setOutput([String(result.message)]);
            enqueueSnackbar("No output produced", { variant: "warning" });
          } else {
            setOutput([]);
            enqueueSnackbar("No output received from judge", { variant: "warning" });
          }
        } catch (err) {
          enqueueSnackbar("Error retrieving output: " + err.message, { variant: "error" });
        } finally {
          setLoading(false);
          timeoutRef.current = null;
        }
      }, 2000);
    } catch (error) {
      enqueueSnackbar("Error submitting code: " + error.message, { variant: "error" });
      setLoading(false);
    }
  }, [enqueueSnackbar, languageDetails]);

  // --- START: KEYBOARD SHORTCUT HANDLER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!editorRef.current) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+S → Export file
      if (ctrlKey && e.key === "s") {
        e.preventDefault();
        exportFile();
      }
      // Ctrl+O → Import file
      else if (ctrlKey && e.key === "o") {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      // Ctrl+L → Clear output
      else if (ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        clearOutput();
      }
      // Ctrl+C → Copy output
      else if (ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyOutput();
      }
      // Ctrl+/ → Toggle line numbers
      else if (ctrlKey && e.key === "/") {
        e.preventDefault();
        setShowLineNumbers((prev) => !prev);
      }
      // Ctrl+Shift+W → Toggle word wrap
      else if (ctrlKey && e.shiftKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        setWordWrap((prev) => !prev);
      }
      // Ctrl+Enter → Run code
      else if (ctrlKey && e.key === "Enter") {
        e.preventDefault();
        submitCode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [exportFile, fileInputRef, clearOutput, copyOutput, submitCode]);
  // --- END: KEYBOARD SHORTCUT HANDLER ---

  // (All your existing EditorComponent code remains unchanged after this point)

  // For brevity: existing Editor rendering, import/export buttons, output area, settings, and footer remain unchanged

  return (
    <div className="editor-container">
      {/* existing JSX remains */}
      {/* ... */}
    </div>
  );
}

export default EditorComponent;
