import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaPlay } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import "../components/css/EditorComponent.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { useSnackbar } from "notistack";
import Box from "@mui/material/Box";
import {Avatar, Button, CircularProgress, styled } from "@mui/material";
import GoogleSignIn from "../components/GoogleSignIn";
import Stars from "../components/js/Stars";
import { useContext } from "react";
import { SocketContext } from "../context/socket";

import EditorThemeSelect from "../components/js/EditorThemeSelect";
import LanguageSelect from "../components/js/LanguageSelect";

import ToggleTheme from "../components/js/ToggleTheme";
import { defineEditorTheme } from "../components/js/defineEditorTheme";
import {
  EDITOR_THEMES,
  LANGUAGES,
  judge0SubmitUrl,
  rapidApiHost,
  rapidApiKey,
} from "../constants/constants";

import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


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
  const roomId=useParams().id;

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
    console.log(LANGUAGES);
    const selectedLanguage = LANGUAGES.find(
      (lang) => lang.DEFAULT_LANGUAGE === currentLanguage
    );
    setLanguageDetails({
      ID: selectedLanguage.ID,
      LANGUAGE_NAME: selectedLanguage.NAME,
      DEFAULT_LANGUAGE: selectedLanguage.DEFAULT_LANGUAGE,
      NAME: selectedLanguage.NAME,
    });
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
  useEffect(() => {console.log(currentLanguage)},[currentLanguage])

  const socket=useContext(SocketContext);
  

  useEffect(() => {
    
     socket.emit('joinroom',{roomId:roomId})
     socket.emit('leaveroom',{roomId:roomId});
     socket.on('welcomeToRoom',({userlist})=>{
      console.log(userlist);
     })
     socket.on('syncCode',({code})=>{
      setCode(code);
     })
  }, [socket])

  

  const handleCodeChange=(e)=>{
    const lang=encodeURIComponent(currentLanguage);
    socket.emit('codeChange',{roomId,code:e,lang});
  }
  
  useEffect(()=>{
    const getSyncCode=async()=>{
      const lang=encodeURIComponent(currentLanguage);
      try{
        const res=await axios.get(`${process.env.REACT_APP_BACKEND}/api/code/getcode?id=${roomId}&language=${lang}`);
        console.log(res.data);
       setCurrentLanguage(res.data.code.language);
       setCode(res.data.code.code);
      }catch(err){
        console.log(err);
      }
    }
   getSyncCode();
  },[currentLanguage])

  const {currentUser,setCurrentUser,logOut}=useAuth();
    

    const handleSignOut = async () => {
        try {
          await logOut();
          window.location.href='/'
        } catch (error) {
          console.log(error);
        }
      };

      const WelcomeText = styled("span")(({ theme }) => ({
        color: theme.palette.text.primary,
        fontWeight: "bold",
      }));

  return (
    <>
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
              src="../images/custom-code-editor-rounded.svg"
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
          {currentUser ? (
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
              ) : (
                <GoogleSignIn />
              )}
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
          onChange={(e)=>handleCodeChange(e)}
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
        </div>
      </StyledLayout>
      <OutputLayout>
        {output &&
          output.map((result, i) => {
            return <div key={i}>{result}</div>;
          })}
      </OutputLayout>
    </div>
    </>
  );
}

export default EditorComponent;
