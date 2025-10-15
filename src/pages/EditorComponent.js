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

// Local imports after external imports
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
  // Keep types consistent: code is always string, output always array of lines
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

  // Editor settings state
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  // file import/export state
  const [isImporting, setIsImporting] = useState(false);
  const isImportingRef = useRef(false);
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  // Styles object (kept small)
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

  // Keep languageDetails in sync whenever currentLanguage changes (but avoid during import)
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
    // For standard themes we can set directly; for custom themes define them first
    if (["light", "vs-dark"].includes(theme.ID)) {
      setCurrentEditorTheme(theme);
    } else {
      setCurrentEditorTheme(theme);
      try {
        await defineEditorTheme(theme);
        setCurrentEditorTheme(theme);
      } catch (err) {
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV !== "production") console.error("Failed defineEditorTheme:", err);
      }
    }
  };

  const getLanguageLogoById = (id) => {
    const language = LANGUAGES.find((lang) => parseInt(lang.ID, 10) === parseInt(id, 10));
    return language ? language.LOGO : null;
  };

  // Submit code to Judge0 via RapidAPI wrapper (non-blocking, single poll)
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
    // Clear any previous timeout
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

      // single delayed fetch to check result (keeps simple). Store timeout so we can clear on unmount
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

          // judge0 returns stdout as base64 when base64_encoded=true
          if (result && result.stdout) {
            try {
              const decoded = atob(result.stdout);
              const formatted = decoded.split("\n");
              setOutput(formatted);
            } catch (err) {
              // fallback: if decoding fails, show raw stdout
              setOutput([String(result.stdout)]);
            }
          } else if (result && result.compile_output) {
            // compile errors
            try {
              const decoded = atob(result.compile_output);
              setOutput(decoded.split("\n"));
            } catch (err) {
              setOutput([String(result.compile_output)]);
            }
            enqueueSnackbar("Compilation error. See output.", { variant: "error" });
          } else if (result && result.stderr) {
            try {
              const decoded = atob(result.stderr);
              setOutput(decoded.split("\n"));
            } catch (err) {
              setOutput([String(result.stderr)]);
            }
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

  // File import handler
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // reset editor content while importing
    setCode("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    isImportingRef.current = true;
    setIsImporting(true);

    const extension = file.name.split(".").pop().toLowerCase();

    const languageMap = {
      js: "Javascript",
      jsx: "Javascript",
      ts: "Typescript",
      py: "Python3",
      cpp: "C++",
      c: "C",
      java: "Java",
    };

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

  // Export file handler
  const [isDownloading, setDownloading] = useState(false);
  const exportFile = () => {
    if (typeof code !== "string" || code.length === 0) {
      enqueueSnackbar("No code to export", { variant: "warning" });
      return;
    }

    setDownloading(true);
    const fileContent = code;

    const extensionMap = {
      javascript: "js",
      javascriptreact: "js",
      typescript: "ts",
      python: "py",
      cpp: "cpp",
      c: "c",
      java: "java",
    };

    const langKey = (languageDetails?.DEFAULT_LANGUAGE || "").toString().toLowerCase();
    const extension = extensionMap[langKey] || "txt";

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `code.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  // Editor mount
  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // register Ctrl/Cmd + Enter only once per editor instance
      try {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          submitCode();
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV !== "production") console.error("Failed to register command:", err);
      }
    },
    [submitCode]
  );

  // Global key handler for convenience (also triggers submit)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        submitCode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [submitCode]);

  // Cleanup any pending timeout on unmount to avoid setState-after-unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Language change from selector
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
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV !== "production") console.error("Sign out error:", error);
    }
  };

  // Editor settings handlers
  const handleLineNumbersToggle = (event) => {
    setShowLineNumbers(event.target.checked);
  };

  const handleWordWrapToggle = (event) => {
    setWordWrap(event.target.checked);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  // Output management handlers
  const copyOutput = async () => {
    if (!output || output.length === 0) {
      enqueueSnackbar("No output to copy", { variant: "warning" });
      return;
    }

    const outputText = Array.isArray(output) ? output.join("\n") : String(output);
    try {
      await navigator.clipboard.writeText(outputText);
      enqueueSnackbar("Output copied to clipboard!", { variant: "success" });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = outputText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        enqueueSnackbar("Output copied to clipboard!", { variant: "success" });
      } catch (fallbackErr) {
        enqueueSnackbar("Failed to copy output", { variant: "error" });
      }
      document.body.removeChild(textArea);
    }
  };

  const clearOutput = () => {
    setOutput([]);
    enqueueSnackbar("Output cleared", { variant: "info" });
  };

  // Renderers for authenticated vs unauthenticated users
  const renderAuthenticatedContent = () => (
    <>
      <StyledLayout>
        <Editor
          className="editor"
          theme={currentEditorTheme.NAME}
          onMount={handleEditorDidMount}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          language={languageDetails.DEFAULT_LANGUAGE}
          options={{
            minimap: { enabled: false },
            lineNumbers: showLineNumbers ? "on" : "off",
            wordWrap: wordWrap ? "on" : "off",
            fontSize,
          }}
        />
        <div
          className="sidebar"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* import and export btn */}
          <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
            <StyledButton
              onClick={() => fileInputRef.current.click()}
              disabled={isImporting}
              sx={(theme) => ({
                padding: "8px 10px",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                border: `1px solid ${theme.palette.primary.dark}`,
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
                "&:disabled": {
                  backgroundColor: theme.palette.action.disabled,
                  color: theme.palette.action.disabledBackground,
                  cursor: "not-allowed",
                  transform: "none",
                },
                "@media (max-width: 768px)": {
                  padding: "8px 12px",
                  fontSize: "0.8125rem",
                },
              })}
            >
              {isImporting ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  Importing...
                </>
              ) : (
                <>
                  <FaFileUpload fontSize="small" />
                  Import
                </>
              )}
            </StyledButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".java,.js,.jsx,.ts,.py,.cpp,.c"
              onChange={handleFileImport}
            />

            <StyledButton
              onClick={exportFile}
              sx={(theme) => ({
                padding: "8px 10px",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                border: `1px solid ${theme.palette.primary.dark}`,
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
                "&:disabled": {
                  backgroundColor: theme.palette.action.disabled,
                  color: theme.palette.action.disabledBackground,
                  cursor: "not-allowed",
                  transform: "none",
                },
                "@media (max-width: 768px)": {
                  padding: "8px 12px",
                  fontSize: "0.8125rem",
                },
              })}
            >
              {isDownloading ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  Exporting...
                </>
              ) : (
                <>
                  <FaFileDownload fontSize="small" />
                  Export
                </>
              )}
            </StyledButton>
          </div>

          {getLanguageLogoById(languageDetails?.ID)}
          <div style={{ fontWeight: "bold" }}>
            {languageDetails?.LANGUAGE_NAME || languageDetails?.NAME}
          </div>
          <div style={styles.languageDropdown}>
            <EditorThemeSelect
              handleEditorThemeChange={handleEditorThemeChange}
              defaultEditorTheme={currentEditorTheme}
            />
          </div>
          <div style={styles.languageDropdown}>
            <LanguageSelect
              handleLanguageChange={handleLanguageChange}
              defaultLanguage={languageDetails}
            />
          </div>

          {/* Editor Settings Section */}
          <div className="editor-settings">
            <Typography variant="subtitle2" className="editor-settings-title">
              Editor Settings
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={showLineNumbers}
                  onChange={handleLineNumbersToggle}
                  size="small"
                />
              }
              label="Line Numbers"
              className="editor-settings-control"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={wordWrap}
                  onChange={handleWordWrapToggle}
                  size="small"
                />
              }
              label="Word Wrap"
              className="editor-settings-control"
            />

            <Typography
              variant="body2"
              sx={{ margin: "0.5rem 0 0.25rem 0" }}
            >
              Font Size: {fontSize}px
            </Typography>
            <div className="editor-settings-slider">
              <Slider
                value={fontSize}
                onChange={handleFontSizeChange}
                min={12}
                max={20}
                step={1}
                marks={[
                  { value: 12, label: "12" },
                  { value: 14, label: "14" },
                  { value: 16, label: "16" },
                  { value: 18, label: "18" },
                  { value: 20, label: "20" },
                ]}
                size="small"
              />
            </div>
          </div>
          <StyledButton
            sx={(theme) => ({
              marginTop: "1rem",
              padding: "10px 20px",
              bgcolor: theme.palette.text.primary,
              color: theme.palette.background.default,
              border: "none",
              borderRadius: "15px",
              fontSize: "0.8em",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "50%",
              "@media (min-width: 1024px)": {
                width: "100%",
              },
            })}
            onClick={submitCode}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            <span>
              {loading ? <CircularProgress size={13} /> : <FaPlay size="13" />}
            </span>
            Run {languageDetails?.LANGUAGE_NAME || languageDetails?.NAME}
          </StyledButton>
        </div>
      </StyledLayout>
      <OutputLayout>
        <div className="output-header">
          <Typography
            variant="h6"
            sx={{ fontSize: "1rem", fontWeight: "bold" }}
          >
            Output
          </Typography>
          <div className="output-controls">
            <Button
              size="small"
              onClick={copyOutput}
              startIcon={<FaCopy />}
              variant="outlined"
              sx={{ minWidth: "auto", padding: "4px 8px" }}
            >
              Copy
            </Button>
            <Button
              size="small"
              onClick={clearOutput}
              startIcon={<FaTrash />}
              variant="outlined"
              sx={{ minWidth: "auto", padding: "4px 8px", marginLeft: "0.5rem" }}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="output-content">
          {Array.isArray(output) && output.length > 0 ? (
            output.map((result, i) => (
              <div key={i} className="output-line">
                {result}
              </div>
            ))
          ) : (
            <div className="output-empty">
              No output yet. Run your code to see results!
            </div>
          )}
        </div>
      </OutputLayout>
    </>
  );

  const renderUnauthenticatedContent = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        flexDirection: "column",
      }}
    >
      <h2>Please sign in to use the Code Editor</h2>
      <GoogleSignIn />
      <br />
      <GithubSignIn />
    </div>
  );

  return (
    <div className="editor-container">
      <Box
        sx={[
          (theme) => ({
            height: "auto",
            margin: "0.5rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            border: `2px solid ${theme.palette.divider}`,
            borderRadius: "1rem",
          }),
        ]}
      >
        <div style={styles.flex}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="./images/custom-code-editor-rounded.svg"
              alt="Custom Code Editor icon"
              width={32}
              style={{ marginLeft: "0.5rem" }}
            />
            <span
              style={{
                backgroundClip: "text",
                background: "linear-gradient(#2837BA 0%, #2F1888 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                marginLeft: "0.5rem",
                fontWeight: "bold",
                fontSize: "1.5em",
              }}
            >
              Custom Code Editor
            </span>
          </div>
          <Stars />
          <ToggleTheme />
          {currentUser && (
            <div className="flex-container">
              <div className="flex items-center space-x-2">
                <>
                  <WelcomeText>Welcome, {currentUser.displayName}</WelcomeText>
                  <Avatar
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    sx={{
                      width: 32,
                      height: 32,
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  <div className="signout-container">
                    <button onClick={handleSignOut} className="signout-button">
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              </div>
            </div>
          )}
        </div>
      </Box>
      {currentUser ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default EditorComponent;
