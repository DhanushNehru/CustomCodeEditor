import CppLogo from "../Images/CppLogo"
import JavaLogo from "../Images/JavaLogo"
import JavascriptLogo from "../Images/JavaScriptLogo"
import PythonLogo from "../Images/PythonLogo"

export const judge0SubmitUrl =
  process.env.JUDGE0_SUMBISSION_URL || process.env.REACT_APP_RAPID_API_URL
export const rapidApiHost = process.env.REACT_APP_RAPID_API_HOST
export const rapidApiKey = process.env.REACT_APP_RAPID_API_KEY

export const LANGUAGE_ID_FOR_JAVASCRIPT = 63
export const LANGUAGE_ID_FOR_PYTHON3 = 71
export const LANGUAGE_ID_FOR_CPP = 76
export const LANGUAGE_ID_FOR_JAVA = 62;

export const LANGUAGES = [
  {
    ID: LANGUAGE_ID_FOR_JAVASCRIPT,
    NAME: "Javascript",
    DEFAULT_LANGUAGE: "javascript",
    LOGO: <JavascriptLogo/>
  },
  {
    ID: LANGUAGE_ID_FOR_PYTHON3,
    NAME: "Python3",
    DEFAULT_LANGUAGE: "python",
    LOGO: <PythonLogo/>
  },
  {
    ID: LANGUAGE_ID_FOR_CPP,
    NAME: "C++",
    DEFAULT_LANGUAGE: "C++(Clang 7.0.1)",
    LOGO: <CppLogo/>
  },
  {
    ID: LANGUAGE_ID_FOR_JAVA,
    NAME: "Java",
    DEFAULT_LANGUAGE: "java",
    LOGO: <JavaLogo/>
  },
]; 
