import React, { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import "../components/css/EditorComponent.css"; // Optional for styling
import "@fortawesome/fontawesome-free/css/all.css";
import { useSnackbar } from "notistack";
import {Button, CircularProgress, styled} from "@mui/material";

const judge0SubmitUrl =
  process.env.JUDGE0_SUMBISSION_URL || process.env.REACT_APP_RAPID_API_URL;
const rapidApiHost = process.env.REACT_APP_RAPID_API_HOST;
const rapidApiKey = process.env.REACT_APP_RAPID_API_KEY;

const LANGUAGE_ID_FOR_JAVASCRIPT = 63;
const LANGUAGE_ID_FOR_PYTHON3 = 71;
const LANGUAGE_ID_FOR_CPP = 76;
const LANGUAGES = [
  {
    ID: LANGUAGE_ID_FOR_JAVASCRIPT,
    NAME: "Javascript",
    DEFAULT_LANGUAGE: "javascript",
  },
  {
    ID: LANGUAGE_ID_FOR_PYTHON3,
    NAME: "Python3",
    DEFAULT_LANGUAGE: "python",
  },
  {
    ID: LANGUAGE_ID_FOR_CPP,
    NAME: "C++",
    DEFAULT_LANGUAGE: "C++(Clang 7.0.1)"
  },
];

const StyledButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
});
// need to incorporate toggle
// const LANGUAGE = LANGUAGES[0];

// const LANGUAGE_ID = LANGUAGE["ID"];
// const LANGUAGE_NAME = LANGUAGE["NAME"];
// const DEFAULT_LANGUAGE = LANGUAGE["DEFAULT_LANGUAGE"];

function EditorComponent() {
  // State variables for code, output, and potential error messages
  const [code, setCode] = useState(null); // Consider setting an initial value if needed
  const [output, setOutput] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState(
    LANGUAGES[0].DEFAULT_LANGUAGE
  );
  const [languageDetails, setLanguageDetails] = useState({
    LANGUAGE_ID: "",
    LANGUAGE_NAME: "",
    DEFAULT_LANGUAGE: "",
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const selectedLanguage =
      currentLanguage === LANGUAGES[0].DEFAULT_LANGUAGE
        ? LANGUAGES[0]
        : currentLanguage === LANGUAGES[1].DEFAULT_LANGUAGE ? LANGUAGES[1] : LANGUAGES[2];

    setLanguageDetails({
      LANGUAGE_ID: selectedLanguage.ID,
      LANGUAGE_NAME: selectedLanguage.NAME,
      DEFAULT_LANGUAGE: selectedLanguage.DEFAULT_LANGUAGE,
    });
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
      let request = parseInt(localStorage.getItem("requestCount")) || 0;
      let lastRequest = localStorage.getItem("lastRequest") || new Date().toISOString();
      if (new Date() - new Date(lastRequest) > 86400000) {
        request = 0;
        localStorage.setItem("requestCount", 0);
        localStorage.setItem("lastRequest", new Date().toISOString());
      }
      if (request >= 50) {
        throw new Error(
          "Your daily requests have been finished please come tomorrow"
        );
      }
      else {
        request++;
        localStorage.setItem("requestCount", request);
        document.getElementById("requestCounter").innerText = 50 - request;

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
            if(!data.stdout) {
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

  return (
    <div className="editor-container" style={styles.container}>
      {/* Language toggle button (top right corner) */}
      <div style={styles.flexBetween}>
        {/* Current Language Logo */}
        <div style={styles.flexStart}>
          {currentLanguage === LANGUAGES[0].DEFAULT_LANGUAGE ? (
            <JavascriptLogo />
          ) : (
            <PythonLogo />
          )}

          <div style={{ fontWeight: "bold" }}>
            {languageDetails.LANGUAGE_NAME}
          </div>
        </div>
        {/* DropDown to Change Language */}
        <div>
          <select
            style={{ padding: "0.5em 1em" }}
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
        </div>
      </div>

      <Editor
        height="70vh"
        width="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        // ... other editor configuration options
        value={code} // Set initial value
        onChange={(value) => setCode(value)} // Update code state on change
        language={languageDetails.DEFAULT_LANGUAGE} // Set default language to JavaScript
      />
      <StyledButton onClick={submitCode} style={styles.button} variant="contained" color="primary" disabled={loading}>
        <span>        
          {loading ? (
            <CircularProgress size={16} />
          ):(
            <FaPlay size="16" />
          )}
        </span>
          Run {languageDetails.LANGUAGE_NAME} Code
      </StyledButton>
      <div id="counter">Requests left for today: <span id = "requestCounter">{50 - localStorage.getItem("requestCount")}</span></div>
      <div className="output">
        <pre>
          <p>{output}</p>
        </pre>
      </div>
    </div>
  );
}

const styles = {
  //container:{
  // textAlign: 'center',
  //},
  flexStart: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0.6em",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "1em",
  },
  button: {
    marginLeft: "5px",
    marginTop: "5px",
    padding: "10px 20px",
    backgroundColor: "#252525",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.2em",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

function JavascriptLogo({ width = 40, height = 40 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0,0,256,256"
    >
      <g transform="">
        <g
          fill="none"
          fillRule="nonzero"
          stroke="none"
          strokeWidth="1"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          strokeDasharray=""
          strokeDashoffset="0"
          fontFamily="none"
          fontWeight="none"
          fontSize="none"
          textAnchor="none"
          style={{ mixBlendMode: "normal" }}
        >
          <g transform="scale(5.33333,5.33333)">
            <path d="M6,42v-36h36v36z" fill="#ffd600"></path>
            <path
              d="M29.538,32.947c0.692,1.124 1.444,2.201 3.037,2.201c1.338,0 2.04,-0.665 2.04,-1.585c0,-1.101 -0.726,-1.492 -2.198,-2.133l-0.807,-0.344c-2.329,-0.988 -3.878,-2.226 -3.878,-4.841c0,-2.41 1.845,-4.244 4.728,-4.244c2.053,0 3.528,0.711 4.592,2.573l-2.514,1.607c-0.553,-0.988 -1.151,-1.377 -2.078,-1.377c-0.946,0 -1.545,0.597 -1.545,1.377c0,0.964 0.6,1.354 1.985,1.951l0.807,0.344c2.745,1.169 4.293,2.363 4.293,5.047c0,2.892 -2.284,4.477 -5.35,4.477c-2.999,0 -4.702,-1.505 -5.65,-3.368zM17.952,33.029c0.506,0.906 1.275,1.603 2.381,1.603c1.058,0 1.667,-0.418 1.667,-2.043v-10.589h3.333v11.101c0,3.367 -1.953,4.899 -4.805,4.899c-2.577,0 -4.437,-1.746 -5.195,-3.368z"
              fill="#000001"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

function PythonLogo({ width = 40, height = 40 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0,0,256,256"
    >
      <g transform="translate(30.72,30.72) scale(0.76,0.76)">
        <g
          fill="none"
          fillRule="nonzero"
          stroke="none"
          strokeWidth="1"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          strokeDasharray=""
          strokeDashoffset="0"
          fontFamily="none"
          fontWeight="none"
          fontSize="none"
          textAnchor="none"
          style={{ mixBlendMode: "normal" }}
        >
          <g transform="scale(5.33333,5.33333)">
            <path
              d="M24.047,5c-1.555,0.005 -2.633,0.142 -3.936,0.367c-3.848,0.67 -4.549,2.077 -4.549,4.67v3.963h9v2h-9.342h-4.35c-2.636,0 -4.943,1.242 -5.674,4.219c-0.826,3.417 -0.863,5.557 0,9.125c0.655,2.661 2.098,4.656 4.735,4.656h3.632v-5.104c0,-2.966 2.686,-5.896 5.764,-5.896h7.236c2.523,0 5,-1.862 5,-4.377v-8.586c0,-2.439 -1.759,-4.263 -4.218,-4.672c0.061,-0.006 -1.756,-0.371 -3.298,-0.365zM19.063,9c0.821,0 1.5,0.677 1.5,1.502c0,0.833 -0.679,1.498 -1.5,1.498c-0.837,0 -1.5,-0.664 -1.5,-1.498c0,-0.822 0.663,-1.502 1.5,-1.502z"
              fill="#0277bd"
            ></path>
            <path
              d="M23.078,43c1.555,-0.005 2.633,-0.142 3.936,-0.367c3.848,-0.67 4.549,-2.077 4.549,-4.67v-3.963h-9v-2h9.343h4.35c2.636,0 4.943,-1.242 5.674,-4.219c0.826,-3.417 0.863,-5.557 0,-9.125c-0.656,-2.661 -2.099,-4.656 -4.736,-4.656h-3.632v5.104c0,2.966 -2.686,5.896 -5.764,5.896h-7.236c-2.523,0 -5,1.862 -5,4.377v8.586c0,2.439 1.759,4.263 4.218,4.672c-0.061,0.006 1.756,0.371 3.298,0.365zM28.063,39c-0.821,0 -1.5,-0.677 -1.5,-1.502c0,-0.833 0.679,-1.498 1.5,-1.498c0.837,0 1.5,0.664 1.5,1.498c0,0.822 -0.664,1.502 -1.5,1.502z"
              fill="#ffc107"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default EditorComponent;
