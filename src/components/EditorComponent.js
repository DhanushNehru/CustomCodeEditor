import React, { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import './EditorComponent.css';  // Optional for styling
import '@fortawesome/fontawesome-free/css/all.css';

const judge0SubmitUrl = process.env.JUDGE0_SUMBISSION_URL;

const LANGUAGE_ID_FOR_JAVASCRIPT = 63;
const LANGUAGE_ID_FOR_PYTHON3 = 71;

const LANGUAGES = [
  {
    ID:LANGUAGE_ID_FOR_JAVASCRIPT,
    NAME:"Javascript",
    DEFAULT_LANGUAGE: "javascript"
  }
  ,
  {
    ID:LANGUAGE_ID_FOR_PYTHON3,
    NAME:"Python3",
    DEFAULT_LANGUAGE: "python"
  }
]

// need to incorporate toggle
const LANGUAGE = LANGUAGES[0]

const LANGUAGE_ID = LANGUAGE['ID']
const LANGUAGE_NAME = LANGUAGE['NAME']
const DEFAULT_LANGUAGE = LANGUAGE['DEFAULT_LANGUAGE']

function EditorComponent() {
  // State variables for code, output, and potential error messages
  const [code, setCode] = useState(null); // Consider setting an initial value if needed
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);

  // Reference to the Monaco editor instance
  const editorRef = useRef(null);

  // Function to handle editor mounting
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  // Function to handle code submission
  async function submitCode() {
    const codeToSubmit = editorRef.current.getValue();

    console.log(" Code to submit ", codeToSubmit );

    try {
      const response = await fetch(judge0SubmitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: codeToSubmit,
          language_id: LANGUAGE_ID,
          stdin: "", // Input for the code (if any)
          expected_output: "", // Expected output for the code (if any)
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create submission. Status code: ${response.status}`);
      }

      const data = await response.json();
      const submissionId = data['token'];
      console.log(`Submission created successfully. ID: ${submissionId}`);

      setTimeout(() => {
        fetch(`${judge0SubmitUrl}/${submissionId}`)
        .then(response => response.json())
        .then(data => {
            console.log(" DATA ", data)
            console.log("Output:", data.stdout);
            setOutput(data.stdout)
            setError(null); // Clear any previous error messages
        })
        .catch(error => {
            console.error("Error retrieving output:", error.message);
            setError("Error retrieving output: " + error.message); // Display error message
        });

      }, 2000); // Delay added to give Judge0 some time to process the submission

    } catch (error) {
      console.error("Error:", error.message);
      setError("Error: " + error.message); // Display error message in the UI
    }
  }

  return (
      <div className="editor-container" style={styles.container}>
      {error && <div className="error-message">{error}</div>}

      {/* Language toggle button (top right corner) */}
      <div>
        {LANGUAGE_NAME}
      </div>


      <Editor
        height="70vh"
        width="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        // ... other editor configuration options
        value={code} // Set initial value
        onChange={(value) => setCode(value)} // Update code state on change
        language={DEFAULT_LANGUAGE} // Set default language to JavaScript
      />
      <button onClick={submitCode} style={styles.button}>
      <i class="fa fa-play"></i> Run {LANGUAGE_NAME} Code
      </button>
      <div className="output">
        <pre><p>{output}</p></pre>
      </div>
      </div>
  )
}

const styles = {
  
  //container:{
   // textAlign: 'center',
  //},
  button: {
    marginLeft: '5px',
    marginTop: '5px',
    padding: '10px 20px',
    backgroundColor: '#252525',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.2em',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default EditorComponent;
