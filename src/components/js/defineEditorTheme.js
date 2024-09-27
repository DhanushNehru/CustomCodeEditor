import { loader } from "@monaco-editor/react";

const defineEditorTheme = (theme) => {

  return new Promise(() => {
    Promise.all([
      loader.init(),
      import(`monaco-themes/themes/${theme.NAME}.json`),
    ]).then(([monaco, themeData]) => {
      monaco.editor.defineTheme(theme.ID, themeData);
      monaco.editor.setTheme(theme.ID);
    });
  });
};

export { defineEditorTheme };
