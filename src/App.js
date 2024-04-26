// import { useState, useRef } from 'react'
// import Editor from "@monaco-editor/react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EditorComponent from './components/EditorComponent'; // Your refactored code
// import Documentation from './components/Documentation';

import './App.css'
/**
 const submitUrl = "http://13.233.194.10:2358/submissions";
 const LANGUAGE_ID_FOR_JAVASCRIPT = 63;
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorComponent />} />
        {/* <Route path="/documentation" element={<Documentation />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

/**
function App() {
  const [code, setCode] = useState(null); // change to "index.html"
  const editorRef = useRef(null);
  const [output, setOutput] = useState("");

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  async function submitCode() {
    const codeToSubmit = editorRef.current.getValue();

    console.log(" Code to submit ",codeToSubmit )

    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: codeToSubmit,
          language_id: LANGUAGE_ID_FOR_JAVASCRIPT,
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
        fetch(`${submitUrl}/${submissionId}`)
        .then(response => response.json())
        .then(data => {
            console.log(" DATA ", data)
            console.log("Output:", data.stdout);
            setOutput(data.stdout)
        })
        .catch(error => {
            console.error("Error retrieving output:", error.message);
        });

      }, 2000); // Delay added to give Judge0 some time to process the submission


    } catch (error) {
      console.error("Error:", error.message);
      setOutput("Error: " + error.message); // Display error in the output
    }
  }

  return (
      <div className="App">
      <Editor
        height="50vh"
        width="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        // path={file.name}
        // defaultLanguage={file.language}
        // defaultValue={file.value}
        value={code} // Set initial value
        onChange={(value) => setCode(value)} // Update code state on change
        language="javascript" // Set default language to JavaScript
      />
      <button onClick={submitCode}>
        Run Code
      </button>

      <div className="output">
        <pre><p>{output}</p></pre>
      </div>
      </div>
  )
}
*/

export default App