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
    LOGO: <JavascriptLogo />,
    HELLO_WORLD: `console.log("Hello World")
`
  },
  {
    ID: LANGUAGE_ID_FOR_PYTHON3,
    NAME: "Python3",
    DEFAULT_LANGUAGE: "python",
    LOGO: <PythonLogo />,
    HELLO_WORLD: `print("Hello World")
`
  },
  {
    ID: LANGUAGE_ID_FOR_CPP,
    NAME: "C++",
    DEFAULT_LANGUAGE: "C++(Clang 7.0.1)",
    LOGO: <CppLogo />,
    HELLO_WORLD: `#include<iostream>
using namespace std;
int main(){
  cout<<"Hello World"<<endl;
  return 0;
}`
  },
  {
    ID: LANGUAGE_ID_FOR_JAVA,
    NAME: "Java",
    DEFAULT_LANGUAGE: "java",
    LOGO: <JavaLogo />,
    HELLO_WORLD: `public class Main
{
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`
  },
]; 
