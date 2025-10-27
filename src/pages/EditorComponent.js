// src/pages/EditorComponent.js
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
  overflow: "auto",
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

const decodeFormat = (data) => {
  return data ? atob(data).split("\n") : [];
}

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
            setOutput(decodeFormat(result.stdout));
          } else if (result && result.compile_output) {
            setOutput(decodeFormat(result.compile_output));
            enqueueSnackbar("Compilation error. See output.", { variant: "error" });
          } else if (result && result.stderr) {
            setOutput(decodeFormat(result.stderr));
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

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCode("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    isImportingRef.current = true;
    setIsImporting(true);

    const extension = file.name.split(".").pop().toLowerCase();
    const languageMap = { js: "Javascript", jsx: "Javascript", ts: "Typescript", py: "Python3", cpp: "C++", c: "C", java: "Java" };
    const languageName = languageMap[extension];
    const selectedLanguage = LANGUAGES.find((lang) => lang.NAME === languageName);

    if (!selectedLanguage) {
      enqueueSnackbar("Unsupported file type", { variant: "error" });
      isImportingRef.current = false;
      setIsImporting(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCurrentLanguage(selectedLanguage.DEFAULT_LANGUAGE);
      setLanguageDetails({
        ID: selectedLanguage.ID,
        NAME: selectedLanguage.NAME,
        DEFAULT_LANGUAGE: selectedLanguage.DEFAULT_LANGUAGE,
        LANGUAGE_NAME: selectedLanguage.NAME,
        HELLO_WORLD: selectedLanguage.HELLO_WORLD,
        LOGO: selectedLanguage.LOGO,
      });
      setCode(String(event.target.result ?? ""));
      setOutput([]);
      isImportingRef.current = false;
      setIsImporting(false);
    };
    reader.onerror = () => {
      enqueueSnackbar("Error reading file", { variant: "error" });
      isImportingRef.current = false;
      setIsImporting(false);
    };
    reader.readAsText(file);
  };

  // ------------------- MISSING FUNCTIONS FIX -------------------
  const copyOutput = async () => {
    if (!output || output.length === 0) {
      enqueueSnackbar("No output to copy", { variant: "warning" });
      return;
    }
    const outputText = Array.isArray(output) ? output.join("\n") : String(output);
    try {
      await navigator.clipboard.writeText(outputText);
      enqueueSnackbar("Output copied to clipboard!", { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to copy output", { variant: "error" });
    }
  };

  const clearOutput = () => {
    setOutput([]);
    enqueueSnackbar("Output cleared", { variant: "info" });
  };

  const exportFile = () => {
    if (!code || code.length === 0) {
      enqueueSnackbar("No code to export", { variant: "warning" });
      return;
    }

    const extensionMap = { javascript: "js", javascriptreact: "js", typescript: "ts", python: "py", cpp: "cpp", c: "c", java: "java" };
    const langKey = (languageDetails?.DEFAULT_LANGUAGE || "").toLowerCase();
    const extension = extensionMap[langKey] || "txt";

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `code.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // --------------------------------------------------------------

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      try {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          submitCode();
        });
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error("Failed to register command:", err);
      }
    },
    [submitCode]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        submitCode();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [submitCode]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  function handleLanguageChange(_, value) {
    if (isImporting) return;
    setCurrentLanguage(value.DEFAULT_LANGUAGE);
    setOutput([]);
    setCode((prev) => (prev ? prev : value.HELLO_WORLD || ""));
  }

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error("Sign out error:", error);
    }
  };

  const handleLineNumbersToggle = (event) => setShowLineNumbers(event.target.checked);
  const handleWordWrapToggle = (event) => setWordWrap(event.target.checked);
  const handleFontSizeChange = (event, newValue) => setFontSize(newValue);

  // ------------------- JSX RENDER -------------------
  const renderAuthenticatedContent = () => (
    <>
      {/* Editor + Sidebar */}
      <StyledLayout>
        <Editor
          className="editor"
          theme={currentEditorTheme.NAME}
          onMount={handleEditorDidMount}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          language={languageDetails.DEFAULT_LANGUAGE}
          options={{ minimap: { enabled: false }, lineNumbers: showLineNumbers ? "on" : "off", wordWrap: wordWrap ? "on" : "off", fontSize }}
        />
        <div className="sidebar">
          {/* Import / Export */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <StyledButton onClick={() => fileInputRef.current.click()} disabled={isImporting}>
              {isImporting ? <CircularProgress size={16} /> : <><FaFileUpload /> Import</>}
            </StyledButton>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".java,.js,.jsx,.ts,.py,.cpp,.c" onChange={handleFileImport} />
            <StyledButton onClick={exportFile}>
              {isDownloading ? <CircularProgress size={16} /> : <><FaFileDownload /> Export</>}
            </StyledButton>
          </div>
          {/* Run, Copy, Clear */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <StyledButton onClick={submitCode}><FaPlay /> Run</StyledButton>
            <StyledButton onClick={copyOutput}><FaCopy /> Copy Output</StyledButton>
            <StyledButton onClick={clearOutput}><FaTrash /> Clear Output</StyledButton>
          </div>
          {/* Output */}
          <OutputLayout>
            <pre>{output && output.length ? output.join("\n") : "Output will appear here..."}</pre>
          </OutputLayout>
        </div>
      </StyledLayout>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {currentUser ? renderAuthenticatedContent() : (
        <div>
          <GithubSignIn />
          <GoogleSignIn />
        </div>
      )}
      <Footer />
    </Box>
  );
}

export default EditorComponent;
