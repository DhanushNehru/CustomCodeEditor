import CppLogo from "../components/images/CppLogo";
import JavaLogo from "../components/images/JavaLogo";
import JavascriptLogo from "../components/images/JavaScriptLogo";
import PythonLogo from "../components/images/PythonLogo";
import CLogo from "../components/images/CLogo";
import GoLogo from "../components/images/GoLogo";
import PhpLogo from "../components/images/PhpLogo";
import RLogo from "../components/images/RLogo";
import RubyLogo from "../components/images/RubyLogo";
import TypescriptLogo from "../components/images/TypescriptLogo";

export const judge0SubmitUrl =
  process.env.JUDGE0_SUMBISSION_URL || process.env.REACT_APP_RAPID_API_URL;
export const rapidApiHost = process.env.REACT_APP_RAPID_API_HOST;
export const rapidApiKey = process.env.REACT_APP_RAPID_API_KEY;

export const LANGUAGE_ID_FOR_JAVASCRIPT = 63;
export const LANGUAGE_ID_FOR_PYTHON3 = 71;
export const LANGUAGE_ID_FOR_CPP = 76;
export const LANGUAGE_ID_FOR_JAVA = 62;
export const LANGUAGE_ID_FOR_C = 103;
export const LANGUAGE_ID_FOR_GO = 95;
export const LANGUAGE_ID_FOR_PHP = 98;
export const LANGUAGE_ID_FOR_R = 99;
export const LANGUAGE_ID_FOR_RUBY = 72;
export const LANGUAGE_ID_FOR_TYPESCRIPT = 101;


export const LANGUAGES = [
  {
    ID: LANGUAGE_ID_FOR_JAVASCRIPT,
    NAME: "Javascript",
    DEFAULT_LANGUAGE: "javascript",
    LOGO: <JavascriptLogo />,
    HELLO_WORLD: `console.log("Hello World")
`,
  },
  {
    ID: LANGUAGE_ID_FOR_PYTHON3,
    NAME: "Python3",
    DEFAULT_LANGUAGE: "python",
    LOGO: <PythonLogo/>,
    HELLO_WORLD: `print("Hello World")
`,
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
}`,
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
}`,
  },
  {
    ID: LANGUAGE_ID_FOR_C,
    NAME: "C",
    DEFAULT_LANGUAGE: "C (gcc 9.3.0)",
    LOGO: <CLogo />,
    HELLO_WORLD: `#include <stdio.h>
int main() {
   printf("Hello World\\n");
   return 0;
}`,
  },
  {
    ID: LANGUAGE_ID_FOR_GO,
    NAME: "Go",
    DEFAULT_LANGUAGE: "go",
    LOGO: <GoLogo />,
    HELLO_WORLD: `package main
import "fmt"
func main() {
    fmt.Println("Hello World")
}`,
  },
  {
    ID: LANGUAGE_ID_FOR_PHP,
    NAME: "PHP",
    DEFAULT_LANGUAGE: "php",
    LOGO: <PhpLogo />,
    HELLO_WORLD: `<?php
echo "Hello World";
?>`,
  },
  {
    ID: LANGUAGE_ID_FOR_R,
    NAME: "R",
    DEFAULT_LANGUAGE: "R",
    LOGO: <RLogo />,
    HELLO_WORLD: `cat("Hello World\\n")`,
  },
  {
    ID: LANGUAGE_ID_FOR_RUBY,
    NAME: "Ruby",
    DEFAULT_LANGUAGE: "ruby",
    LOGO: <RubyLogo />,
    HELLO_WORLD: `puts 'Hello World'`,
  },
  {
    ID: LANGUAGE_ID_FOR_TYPESCRIPT,
    NAME: "TypeScript",
    DEFAULT_LANGUAGE: "typescript",
    LOGO: <TypescriptLogo />,
    HELLO_WORLD: `console.log("Hello World")`,
  },
];

export const EDITOR_THEMES = [
  {
    ID: "light",
    NAME: "light",
  },
  {
    ID: "vs-dark",
    NAME: "vs-dark",
  },
  {
    ID: "active4d",
    NAME: "Active4D",
  },
  {
    ID: "all-hallows-eve",
    NAME: "All Hallows Eve",
  },
  {
    ID: "amy",
    NAME: "Amy",
  },
  {
    ID: "birds-of-paradise",
    NAME: "Birds of Paradise",
  },
  {
    ID: "blackboard",
    NAME: "Blackboard",
  },
  {
    ID: "brilliance-black",
    NAME: "Brilliance Black",
  },
  {
    ID: "brilliance-dull",
    NAME: "Brilliance Dull",
  },
  {
    ID: "chrome-devtools",
    NAME: "Chrome DevTools",
  },
  {
    ID: "clouds-midnight",
    NAME: "Clouds Midnight",
  },
  {
    ID: "clouds",
    NAME: "Clouds",
  },
  {
    ID: "cobalt",
    NAME: "Cobalt",
  },
  {
    ID: "cobalt2",
    NAME: "Cobalt2",
  },
  {
    ID: "dawn",
    NAME: "Dawn",
  },
  {
    ID: "dracula",
    NAME: "Dracula",
  },
  {
    ID: "dreamweaver",
    NAME: "Dreamweaver",
  },
  {
    ID: "eiffel",
    NAME: "Eiffel",
  },
  {
    ID: "espresso-libre",
    NAME: "Espresso Libre",
  },
  {
    ID: "github-dark",
    NAME: "GitHub Dark",
  },
  {
    ID: "github-light",
    NAME: "GitHub Light",
  },
  {
    ID: "github",
    NAME: "GitHub",
  },
  {
    ID: "idle",
    NAME: "IDLE",
  },
  {
    ID: "katzenmilch",
    NAME: "Katzenmilch",
  },
  {
    ID: "kuroir-theme",
    NAME: "Kuroir Theme",
  },
  {
    ID: "lazy",
    NAME: "LAZY",
  },
  {
    ID: "magicwb--amiga-",
    NAME: "MagicWB (Amiga)",
  },
  {
    ID: "merbivore-soft",
    NAME: "Merbivore Soft",
  },
  {
    ID: "merbivore",
    NAME: "Merbivore",
  },
  {
    ID: "monokai-bright",
    NAME: "Monokai Bright",
  },
  {
    ID: "monokai",
    NAME: "Monokai",
  },
  {
    ID: "night-owl",
    NAME: "Night Owl",
  },
  {
    ID: "nord",
    NAME: "Nord",
  },
  {
    ID: "oceanic-next",
    NAME: "Oceanic Next",
  },
  {
    ID: "pastels-on-dark",
    NAME: "Pastels on Dark",
  },
  {
    ID: "slush-and-poppies",
    NAME: "Slush and Poppies",
  },
  {
    ID: "solarized-dark",
    NAME: "Solarized-dark",
  },
  {
    ID: "solarized-light",
    NAME: "Solarized-light",
  },
  {
    ID: "spacecadet",
    NAME: "SpaceCadet",
  },
  {
    ID: "sunburst",
    NAME: "Sunburst",
  },
  {
    ID: "textmate--mac-classic-",
    NAME: "Textmate (Mac Classic)",
  },
  {
    ID: "tomorrow-night-blue",
    NAME: "Tomorrow-Night-Blue",
  },
  {
    ID: "tomorrow-night-bright",
    NAME: "Tomorrow-Night-Bright",
  },
  {
    ID: "tomorrow-night-eighties",
    NAME: "Tomorrow-Night-Eighties",
  },
  {
    ID: "tomorrow-night",
    NAME: "Tomorrow-Night",
  },
  {
    ID: "tomorrow",
    NAME: "Tomorrow",
  },
  {
    ID: "twilight",
    NAME: "Twilight",
  },
  {
    ID: "upstream-sunburst",
    NAME: "Upstream Sunburst",
  },
  {
    ID: "vibrant-ink",
    NAME: "Vibrant Ink",
  },
  {
    ID: "xcode-default",
    NAME: "Xcode_default",
  },
  {
    ID: "zenburnesque",
    NAME: "Zenburnesque",
  },
  {
    ID: "iplastic",
    NAME: "iPlastic",
  },
  {
    ID: "idlefingers",
    NAME: "idleFingers",
  },
  {
    ID: "krtheme",
    NAME: "krTheme",
  },
  {
    ID: "monoindustrial",
    NAME: "monoindustrial",
  },
];
