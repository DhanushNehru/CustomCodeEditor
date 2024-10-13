import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaPlay } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import "../components/css/EditorComponent.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useSnackbar } from "notistack";
import Box from "@mui/material/Box";
import { Button, CircularProgress, styled } from "@mui/material";
import Stars from "../components/js/Stars";
import {
  LANGUAGES,
  judge0SubmitUrl,
  rapidApiHost,
  rapidApiKey,
  EDITOR_THEMES,
} from "../constants/constants";
import LanguageSelect from "../components/js/LanguageSelect";
import ToggleTheme from "../components/js/ToggleTheme";
import EditorThemeSelect from "../components/js/EditorThemeSelect";
import { defineEditorTheme } from "../components/js/defineEditorTheme";


const StyledButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
});

const StyledLayout = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  marginLeft: "0.5rem",
  marginRight: "0.5rem",
  padding: "0.5rem",
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: "1rem",
  "@media (min-width: 768px)": {
    flexDirection: "row",
  },
}));

const OutputLayout = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "22.3vh",
  overflowY: "auto",
  padding: "1rem",
  margin: "0.5rem",
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: "1rem",
}));

function EditorComponent() {
  const [code, setCode] = useState(null);
  const [output, setOutput] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(
    LANGUAGES[0].DEFAULT_LANGUAGE
  );
  const [languageDetails, setLanguageDetails] = useState(LANGUAGES[0]);
  const [currentEditorTheme, setCurrentEditorTheme] = useState(
    EDITOR_THEMES[1]
  );
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const triggerFind = () => {
    if (editorRef.current) {
      editorRef.current.trigger("keyboard", "actions.find");
    }
  };

  const triggerReplace = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.startFindReplaceAction").run();
    }
  };


  const styles = {
    flex: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.6em",
    },
    languageDropdown: {
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
    },
  };

  useEffect(() => {
    const selectedLanguage = LANGUAGES.find(
      (lang) => lang.DEFAULT_LANGUAGE === currentLanguage
    );
    setLanguageDetails({
      ID: selectedLanguage.ID,
      LANGUAGE_NAME: selectedLanguage.NAME,
      DEFAULT_LANGUAGE: selectedLanguage.DEFAULT_LANGUAGE,
      NAME: selectedLanguage.NAME,
    });
    setCode(selectedLanguage.HELLO_WORLD);
  }, [currentLanguage]);

  const handleEditorThemeChange = async (_, theme) => {
    if (["light", "vs-dark"].includes(theme.ID)) {
      setCurrentEditorTheme(theme);
    } else {
      setCurrentEditorTheme(theme);

      defineEditorTheme(theme).then((_) => setCurrentEditorTheme(theme));
    }
  };

  const getLanguageLogoById = (id) => {
    const language = LANGUAGES.find(
      (lang) => parseInt(lang.ID) === parseInt(id)
    );
    return language ? language.LOGO : null;
  };

  const submitCode = useCallback(async () => {
    const codeToSubmit = editorRef.current.getValue();
    if (codeToSubmit === "") {
      enqueueSnackbar("Please enter valid code", { variant: "error" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(judge0SubmitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": rapidApiHost,
        },
        body: JSON.stringify({
          source_code: codeToSubmit,
          language_id: languageDetails.ID,
          stdin: "",
          expected_output: "",
        }),
      });

      if (!response.ok) {
        enqueueSnackbar("Failed to create submission. Status code: ${response.status}",{ variant: "error" });
        setLoading(false);
        return;
      }
      const data = await response.json();
      const submissionId = data["token"]

      setTimeout(async () => {
        const resultResponse = await fetch(`${judge0SubmitUrl}/${submissionId}?base64_encoded=true&fields=*`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": rapidApiKey,
            "X-RapidAPI-Host": rapidApiHost,
          },
        });

        const resultData = await resultResponse.json();
        if (!resultData.stdout) {
          enqueueSnackbar("Please check the code", { variant: "error" });
          setOutput([resultData.message]); // Check here
          return;
        }
        const formattedOutput = resultData.stdout.split("\n"); // Split by newlines
        setOutput(formattedOutput); // Set the output state
      }, 2000);
    } catch (error) {
      enqueueSnackbar("Error: " + error.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, languageDetails]);


  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        submitCode
      );
    },
    [submitCode]
  );

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      handleEditorDidMount(editor, monaco);
    }
  }, [languageDetails, handleEditorDidMount]);

  function handleLanguageChange(_, value) {
    setCurrentLanguage(value.DEFAULT_LANGUAGE);
    setOutput("");
    setCode(
      code ? code : value.HELLO_WORLD
    );
  }

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
          <div style={{ display: "flex", alignItems: "center" }}>
            <ToggleTheme />
            <Stars />
          </div>
        </div>
      </Box>
      <StyledLayout>
        <Editor
          className="editor"
          theme={currentEditorTheme.NAME}
          onMount={handleEditorDidMount}
          value={code}
          onChange={setCode}
          language={languageDetails.DEFAULT_LANGUAGE}
        />
        <div className="sidebar">
          {getLanguageLogoById(languageDetails.ID)}
          <div style={{ fontWeight: "bold" }}>
            {languageDetails.LANGUAGE_NAME}
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
          <StyledButton
            sx={[
              (theme) => ({
                marginLeft: "5px",
                marginTop: "1rem",
                padding: "10px 20px",
                bgcolor: theme.palette.text.primary,
                color: theme.palette.background.default,
                border: "none",
                borderRadius: "5px",
                fontSize: "0.8em",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }),
            ]}
            onClick={submitCode}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            <span>
              {loading ? <CircularProgress size={13} /> : <FaPlay size="13" />}
            </span>
            Run {languageDetails.LANGUAGE_NAME}
          </StyledButton>
          {/* Find and Replace Buttons */}
          <StyledButton
            onClick={triggerFind}
            variant="outlined"
            color="secondary"
            style={{ marginTop: "1rem" }}
          >
          Find
          </StyledButton>
          <StyledButton
            onClick={triggerReplace}
            variant="outlined"
            color="secondary"
            style={{ marginTop: "1rem" }}
          >
          Replace
          </StyledButton>
        </div>
      </StyledLayout>
      <OutputLayout>
        {output && output.map((result, i) => {
          return <div key={i}>{result}</div>;
        })}
      </OutputLayout>
    </div>
  );
}

export default EditorComponent;
