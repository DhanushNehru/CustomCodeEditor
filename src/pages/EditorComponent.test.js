/* eslint-env jest */
import React, { act } from "react";
import { Simulate } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import { LANGUAGES } from "../constants/constants";
import theme from "../theme";
import EditorComponent from "./EditorComponent";

const mockSnackbar = jest.fn();
let mockEditorProps;
let mockLanguageProps;

jest.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockSnackbar }),
}));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ currentUser: { displayName: "Test user" }, logOut: jest.fn() }),
}));
jest.mock("@monaco-editor/react", () => ({
  Editor: (props) => { mockEditorProps = props; return null; },
}));
jest.mock("../components/js/LanguageSelect", () => (props) => {
  mockLanguageProps = props;
  return null;
});
jest.mock("../components/js/EditorThemeSelect", () => () => null);
jest.mock("../components/js/Stars", () => () => null);
jest.mock("../components/js/ToggleTheme", () => () => null);
jest.mock("../components/GoogleSignIn", () => () => null);
jest.mock("../components/GithubSignIn", () => () => null);
jest.mock("../components/Footer", () => () => null);

describe("language configuration for file import and export", () => {
  let container;
  let root;
  let reader;
  let originalFileReader;
  let originalCreateObjectURL;
  let originalRevokeObjectURL;
  let originalActEnvironment;
  const originalLanguageCount = LANGUAGES.length;

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    mockSnackbar.mockClear();
    originalActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
    global.IS_REACT_ACT_ENVIRONMENT = true;
    originalFileReader = global.FileReader;
    global.FileReader = jest.fn(() => {
      reader = { readAsText: jest.fn() };
      return reader;
    });
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = jest.fn(() => "blob:test");
    URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(
      <ThemeProvider theme={theme}><EditorComponent /></ThemeProvider>
    ));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    LANGUAGES.splice(originalLanguageCount);
    global.FileReader = originalFileReader;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    global.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
    jest.restoreAllMocks();
    jest.useRealTimers();
    localStorage.clear();
  });

  const chooseFile = (name) => {
    const input = container.querySelector("input[type=file]");
    const file = new File(["fixture"], name, { type: "text/plain" });
    Object.defineProperty(input, "files", { configurable: true, value: [file] });
    act(() => input.dispatchEvent(new Event("change", { bubbles: true })));
    return file;
  };

  test("import restores stdin for the imported language", () => {
    localStorage.setItem("stdin-python", "python input");
    localStorage.setItem("stdin-javascript", "js input");
    chooseFile("example.py");
    act(() => reader.onload({ target: { result: "print(input())" } }));
    const show = Array.from(container.querySelectorAll("button")).find(b => b.textContent === "Show");
    act(() => show.click());
    expect(container.querySelector("textarea[aria-label='Standard input']").value).toBe("python input");
  });

  test("stdin saves after import, clears, switches language, and sends Unicode payload", async () => {
    localStorage.setItem("stdin-python", "python saved");
    chooseFile("example.py");
    act(() => reader.onload({ target: { result: "print(input())" } }));
    const button = text => Array.from(container.querySelectorAll("button")).find(b => b.textContent === text);
    act(() => button("Show").click());
    const input = () => container.querySelector("textarea[aria-label='Standard input']");
    act(() => Simulate.change(input(), { target: { value: "தமிழ் café\n42" } }));
    act(() => jest.advanceTimersByTime(600));
    expect(localStorage.getItem("stdin-python")).toBe("தமிழ் café\n42");
    act(() => mockLanguageProps.handleLanguageChange(null, LANGUAGES[0]));
    expect(input().value).toBe("");
    act(() => mockLanguageProps.handleLanguageChange(null, LANGUAGES[1]));
    expect(input().value).toBe("தமிழ் café\n42");
    const oldFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValueOnce({ ok:true,json:async()=>({ token:"test" }) }).mockResolvedValueOnce({ json:async()=>({ status:{ id:3 },stdout:btoa("ok") }) });
    const editor = { getValue:()=>"print(input())",addCommand:jest.fn() };
    act(() => mockEditorProps.onMount(editor,{ KeyMod:{ CtrlCmd:1 },KeyCode:{ Enter:2 } }));
    const run = Array.from(container.querySelectorAll("button")).find(b=>b.textContent.includes("Run Python"));
    await act(async()=>run.click());
    const payload=JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(Buffer.from(payload.stdin,"base64").toString("utf8")).toBe("தமிழ் café\n42");
    expect(payload.language_id).toBe(71);
    act(() => button("Clear").click());
    act(() => jest.advanceTimersByTime(600));
    expect(input().value).toBe("");
    expect(localStorage.getItem("stdin-python")).toBeNull();
    global.fetch.mockClear();
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ token: "empty", status: { id: 3 }, stdout: btoa("ok") }) });
    await act(async () => run.click());
    expect(JSON.parse(global.fetch.mock.calls[0][1].body).stdin).toBe("");
    global.fetch=oldFetch;
  });

  const expectMetadata = (language) => {
    expect(mockLanguageProps.defaultLanguage).toEqual({
      ...language,
      LANGUAGE_NAME: language.NAME,
    });
    expect(mockEditorProps.language).toBe(language.DEFAULT_LANGUAGE);
    expect(container.textContent).toContain(`Run ${language.NAME}`);
  };

  const expectExport = (extension, content) => {
    const OriginalBlob = global.Blob;
    const blobSpy = jest.spyOn(global, "Blob").mockImplementation(
      (parts, options) => new OriginalBlob(parts, options)
    );
    const exportButton = Array.from(container.querySelectorAll("button"))
      .find((button) => button.textContent.includes("Export"));
    act(() => exportButton.click());
    const anchor = HTMLAnchorElement.prototype.click.mock.instances[0];
    expect(anchor.download).toBe(`code.${extension}`);
    expect(blobSpy).toHaveBeenCalledWith([content], { type: "text/plain" });
    expect(URL.createObjectURL).toHaveBeenCalledWith(blobSpy.mock.results[0].value);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    expect(document.body.contains(anchor)).toBe(false);
  };

  test.each([
    ["example.js", 0], ["example.py", 1], ["example.cpp", 2], ["example.java", 3],
    ["EXAMPLE.JS", 0], ["EXAMPLE.PY", 1], ["EXAMPLE.CPP", 2], ["EXAMPLE.JAVA", 3],
    ["example.test.js", 0], ["example.test.py", 1],
    ["example.test.cpp", 2], ["example.test.java", 3],
  ])("imports and exports %s using its configured metadata", (name, index) => {
    const language = LANGUAGES[index];
    const content = "// Unicode: café\nfirst line\nsecond line\n";
    const file = chooseFile(name);
    expect(reader.readAsText).toHaveBeenCalledWith(file);
    act(() => reader.onload({ target: { result: content } }));
    expectMetadata(language);
    expect(mockEditorProps.value).toBe(content);
    expectExport(language.EXTENSION, content);
  });

  test.each([0, 1, 2, 3])("preserves metadata on normal selection of language %s", (index) => {
    act(() => mockLanguageProps.handleLanguageChange(null, LANGUAGES[index]));
    expectMetadata(LANGUAGES[index]);
    expect(mockEditorProps.value).toBe(LANGUAGES[index].HELLO_WORLD);
    expectExport(LANGUAGES[index].EXTENSION, LANGUAGES[index].HELLO_WORLD);
  });

  test("keeps the existing Judge0 IDs and configured extensions", () => {
    expect(LANGUAGES.map(({ ID, EXTENSION }) => [ID, EXTENSION])).toEqual([
      [63, "js"], [71, "py"], [76, "cpp"], [62, "java"],
    ]);
    expect(container.querySelector("input[type=file]").accept).toBe(".js,.py,.cpp,.java");
  });

  test.each(["unsupported.txt", "no-extension", "trailing."])(
    "retains the existing unsupported-file behavior for %s", (name) => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const previousLanguage = mockLanguageProps.defaultLanguage;
      chooseFile(name);
      expect(mockSnackbar).toHaveBeenCalledWith("Unsupported file type", { variant: "error" });
      expect(global.FileReader).not.toHaveBeenCalled();
      expect(mockLanguageProps.defaultLanguage).toBe(previousLanguage);
      expect(mockEditorProps.value).toBe("");
      expect(container.textContent).not.toContain("Importing...");
    }
  );

  test("a fifth configuration automatically supports selection, accept, import and export", () => {
    const language = {
      ID: 999, NAME: "Test language", DEFAULT_LANGUAGE: "test-language",
      EXTENSION: "fixture", HELLO_WORLD: "test starter", LOGO: <span>Test logo</span>,
    };
    LANGUAGES.push(language);
    act(() => mockLanguageProps.handleLanguageChange(null, language));
    expectMetadata(language);
    expect(container.textContent).toContain("Test logo");
    expect(container.querySelector("input[type=file]").accept)
      .toBe(".js,.py,.cpp,.java,.fixture");
    chooseFile("example.part.FIXTURE");
    act(() => reader.onload({ target: { result: "fifth language content" } }));
    expectMetadata(language);
    expectExport("fixture", "fifth language content");
  });
});

describe("standard input (stdin) support", () => {
  let container;
  let root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    localStorage.clear();
    mockSnackbar.mockClear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test("input textarea is collapsed by default and expands on click", () => {
    act(() => {
      root.render(
        <ThemeProvider theme={theme}>
          <EditorComponent />
        </ThemeProvider>
      );
    });

    expect(container.textContent).toContain("Input (stdin)");
    expect(container.querySelector("textarea[aria-label='Standard input']")).toBeNull();

    const showButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent === "Show"
    );
    expect(showButton).toBeTruthy();

    act(() => {
      showButton.click();
    });

    const textarea = container.querySelector("textarea[aria-label='Standard input']");
    expect(textarea).not.toBeNull();
  });

  test("loads saved stdin from localStorage when language is selected", () => {
    localStorage.setItem("stdin-python", "test input data");

    act(() => {
      root.render(
        <ThemeProvider theme={theme}>
          <EditorComponent />
        </ThemeProvider>
      );
    });

    const pyLang = LANGUAGES.find((l) => l.DEFAULT_LANGUAGE === "python");
    if (pyLang && mockLanguageProps) {
      act(() => {
        mockLanguageProps.handleLanguageChange(null, pyLang);
      });
    }

    const showButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent === "Show"
    );
    act(() => {
      showButton.click();
    });

    const textarea = container.querySelector("textarea[aria-label='Standard input']");
    expect(textarea.value).toBe("test input data");
  });
});
