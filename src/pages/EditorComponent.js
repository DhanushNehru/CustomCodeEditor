import React, { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import "../components/css/EditorComponent.css"; // Optional for styling
import "@fortawesome/fontawesome-free/css/all.css";
import { useSnackbar } from "notistack";
import {Button, CircularProgress, styled} from "@mui/material";
import {LANGUAGES, judge0SubmitUrl, rapidApiHost, rapidApiKey} from "../constants/constants";

const StyledButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
});

function EditorComponent() {
  // State variables for code, output, and potential error messages
  const [code, setCode] = useState(null); // Consider setting an initial value if needed
  const [output, setOutput] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES[0].DEFAULT_LANGUAGE);
  const [languageDetails, setLanguageDetails] = useState(LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const selectedLanguage = LANGUAGES.find((lang) => lang.DEFAULT_LANGUAGE === currentLanguage);

    setLanguageDetails({
      LANGUAGE_ID: selectedLanguage.ID,
      LANGUAGE_NAME: selectedLanguage.NAME,
      DEFAULT_LANGUAGE: selectedLanguage.DEFAULT_LANGUAGE,
    });
    setCode(selectedLanguage.HELLO_WORLD);
  }, [currentLanguage]);

  // Reference to the Monaco editor instance
  const editorRef = useRef(null);

  // Function to handle editor mounting
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    //event listner which submits code upon pressing ctrl+enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      submitCode();
    });
  }
  
  // Function to retrieve logo based on language ID
  const getLanguageLogoById = (id) => {
    const language = LANGUAGES.find(lang => lang.ID == id);
    return language ? language.LOGO : null;
  };
  
  // Function to handle code submission
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
          stdin: "", // Input for the code (if any)
          expected_output: "", // Expected output for the code (if any)
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
            setOutput(data.stdout);
          })
          .catch((error) => {
            enqueueSnackbar("Error retrieving output: " + error.message, {
              variant: "error",
            });
          })
          .finally(() => setLoading(false));
      }, 2000); // Delay added to give Judge0 some time to process the submission
    } catch (error) {
      enqueueSnackbar("Error: " + error.message, { variant: "error" });
    }
  }

  function handleLanguageChange(e) {
    setCurrentLanguage(e.target.value);
    setOutput("");
    setCode(null);
  }

  function handleCancel(e) {
    const errElement = e.target.parentElement;
    errElement.style.display = "none";
  }

  return (
    <div style={styles.container}>
      {/* className="editor-container"  */}
      {error && (
        <div style={styles.error}>
          {error}
          <button style={styles.cancel} onClick={handleCancel}>
            x
          </button>
        </div>
      )}
      {/* className="error-message" > */}

      {/* error-message */}
      {/* Language toggle button (top right corner) */}
      <div style={{ backgroundColor: "#b7b8a9" }}>
        {/* Current Language Logo */}
        <div style={styles.flexStart}>
          {getLanguageLogoById(languageDetails.LANGUAGE_ID)}
          <div style={{ fontWeight: "bold" }}>
            {languageDetails.LANGUAGE_NAME}
          </div>
        </div>
      </div>
      <div className="layout">
        <Editor
          height="70vh"
          width="85vw"
          theme="vs-dark"
          onMount={handleEditorDidMount}
          // ... other editor configuration options
          value={code} // Set initial value
          onChange={(value) => setCode(value)} // Update code state on change
          language={languageDetails.DEFAULT_LANGUAGE} // Set default language to JavaScript
        />
        <div className="sidebar">
          <select
            style={styles.select}
            // style={{ padding: "0.5em 1em" }}
            onChange={handleLanguageChange}
          >
            {LANGUAGES.map((language, index) => (
              <option
                key={index}
                style={{ padding: "0.2em 0.5em" }}
                value={language.DEFAULT_LANGUAGE}
              >
                {language.NAME}
              </option>
            ))}
          </select>
          <button onClick={submitCode} style={styles.button}>
            <FaPlay size="16" /> Run {languageDetails.LANGUAGE_NAME} Code
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#eceddd",
          height: "22.3vh",
        }}
      >
        {output}
        {/* className="output" */}
        {/* <pre> */}
        {/* <p>{output}</p> */}
        {/* </pre> */}
      </div>
    </div>
  );
}

const styles = {
  // container: {
  //   textAlign: 'center',
  // },
  flexStart: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0.6em",
    padding: ".5rem",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "1em",
  },
  button: {
    // marginLeft: "2.5rem",
    marginTop: "5px",
    padding: "10px",
    backgroundColor: "#252525",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: ".9em",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    height: "3rem",
    width: "11rem",
  },
  select: {
    width: "11rem",
    height: "2.5rem",
    borderRadius: "5px",
    padding: "0.5em 1em",
    marginTop: "1rem",
  },
  error: {
    backgroundColor: "#e5ebce",
    display: "flex",
    justifyContent: "space-between",
    position: "fixed",
    top: "10rem",
    left: "10rem",
    width: "60%",
    height: "20%",
    borderRadius: ".5rem",
    fontSize: "20px",
    padding: "5px 0 0 15px",
    zIndex: "1000",
  },
  cancel: {
    backgroundColor: "#e5ebce",
    height: "1.5rem",
    border: "none",
    fontSize: "20px",
    marginRight: "1rem",
    cursor: "pointer",
  },
};

export default EditorComponent;
