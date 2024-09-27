import React, { useState, useRef, useEffect } from "react";
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

function EditorComponent() {
  const [code, setCode] = useState(null);
  const [output, setOutput] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(
    LANGUAGES[0].DEFAULT_LANGUAGE
  );
  const [languageDetails, setLanguageDetails] = useState(LANGUAGES[0]);
  const [currentEditorTheme, setCurrentEditorTheme] = useState(EDITOR_THEMES[1]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const editorRef = useRef(null);

  const StyledLayout = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
    padding: "0.5rem",
    border: `3px solid ${theme.palette.divider}`,
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
    border: `3px solid ${theme.palette.divider}`,
    borderRadius: "1rem",
  }));

  const styles = {
    flex: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "0.6em",
    },
    languageDropdown: {
      marginTop: "2rem",
      display: "flex",
      alignItems: "center",
    },
  };

  useEffect(() => {
    const selectedLanguage = LANGUAGES.find(
      (lang) => lang.DEFAULT_LANGUAGE === currentLanguage
    );
    setLanguageDetails({
      LANGUAGE_ID: selectedLanguage.ID,
      LANGUAGE_NAME: selectedLanguage.NAME,
      DEFAULT_LANGUAGE: selectedLanguage.DEFAULT_LANGUAGE,
      NAME: selectedLanguage.NAME,
    });
    setCode(selectedLanguage.HELLO_WORLD);
  }, [currentLanguage]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      submitCode();
    });
  }

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

  async function submitCode() {
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
          language_id: languageDetails.LANGUAGE_ID,
          stdin: "",
          expected_output: "",
        }),
      });

      if (!response.ok) {
        enqueueSnackbar(
          `Failed to create submission. Status code: ${response.status}`,
          { variant: "error" }
        );
        setLoading(false);
        return;
      }
      const data = await response.json();
      const submissionId = data["token"];

      setTimeout(() => {
        fetch(`${judge0SubmitUrl}/${submissionId}`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": rapidApiKey,
            "X-RapidAPI-Host": rapidApiHost,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.stdout) {
              enqueueSnackbar("Please check the code", { variant: "error" });
              setOutput(data.message);
              return;
            }
            const formatedData = data.stdout.split("\n");
            setOutput(formatedData);
          })
          .catch((error) => {
            enqueueSnackbar("Error retrieving output: " + error.message, {
              variant: "error",
            });
          })
          .finally(() => setLoading(false));
      }, 2000);
    } catch (error) {
      enqueueSnackbar("Error: " + error.message, { variant: "error" });
    }
  }

  function handleLanguageChange(_, value) {
    setCurrentLanguage(value.DEFAULT_LANGUAGE);
    setOutput("");
    setCode(null);
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
            border: `3px solid ${theme.palette.divider}`,
            borderRadius: "1rem",
          }),
        ]}
      >
        <div style={styles.flex}>
          {getLanguageLogoById(languageDetails.LANGUAGE_ID)}
          <div style={{ fontWeight: "bold" }}>
            {languageDetails.LANGUAGE_NAME}
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
                marginTop: "5px",
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
              {loading ? <CircularProgress size={16} /> : <FaPlay size="16" />}
            </span>
            Run {languageDetails.LANGUAGE_NAME}
          </StyledButton>
          <div style={{ marginTop: "50px" }}>
            <EditorThemeSelect
              handleEditorThemeChange={handleEditorThemeChange}
              defaultEditorTheme={currentEditorTheme}
            />
          </div>
        </div>
      </StyledLayout>
      <OutputLayout>
        {output &&
          output.map((result, i) => {
            return <div key={i}>{result}</div>;
          })}
      </OutputLayout>
    </div>
  );
}

export default EditorComponent;
