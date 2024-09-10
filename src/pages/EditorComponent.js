import React, { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import "../components/css/EditorComponent.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useSnackbar } from "notistack";
import { Button, CircularProgress, styled } from "@mui/material";
import Stars from "../components/js/Stars";
import {
  LANGUAGES,
  judge0SubmitUrl,
  rapidApiHost,
  rapidApiKey,
} from "../constants/constants";
import LanguageSelect from "../components/js/LanguageSelect";

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
    LANGUAGES[0].DEFAULT_LANGUAGE,
  );
  const [languageDetails, setLanguageDetails] = useState(LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const editorRef = useRef(null);

  useEffect(() => {
    const selectedLanguage = LANGUAGES.find(
      (lang) => lang.DEFAULT_LANGUAGE === currentLanguage,
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

  const getLanguageLogoById = (id) => {
    const language = LANGUAGES.find(
      (lang) => parseInt(lang.ID) === parseInt(id),
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
          { variant: "error" },
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
            const formatedData = data.stdout.split("\n")
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
      <div style={{ height: "auto", margin: "0.5rem", paddingLeft:"0.5rem", paddingRight: "0.5rem", border: "3px solid rgba(0, 0, 0, 0.096)", borderRadius: "1rem" }}>
        <div style={styles.flex}>
          {getLanguageLogoById(languageDetails.LANGUAGE_ID)}
          <div style={{ fontWeight: "bold" }}>
            {languageDetails.LANGUAGE_NAME}
          </div>
          <Stars />
        </div>
      </div>
      <div className="layout">
        <Editor
          className="editor"
          theme="vs-dark"
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
            onClick={submitCode}
            style={styles.button}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            <span>
              {loading ? <CircularProgress size={16} /> : <FaPlay size="16" />}
            </span>
            Run {languageDetails.LANGUAGE_NAME}
          </StyledButton>
        </div>
      </div>
      <div className="output">
        {
          output && output.map((result, i)=>{
            return <div key={i}>{result}</div>
          })
        }
      </div>
    </div>
  );
}

const styles = {
  flex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.6em",
  },
  button: {
    marginLeft: "5px",
    marginTop: "5px",
    padding: "10px 20px",
    backgroundColor: "#252525",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "0.8em",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  languageDropdown: {
    marginTop: "2rem",
    display: "flex",
    alignItems: "center",
  },
};

export default EditorComponent;
