import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { EDITOR_THEMES } from "../../constants/constants";

function EditorThemeSelect({ handleEditorThemeChange, defaultEditorTheme }) {
  const { t } = useTranslation();
  return (
    <Autocomplete
      size="small"
      disableClearable
      isOptionEqualToValue={(option, value) => option.ID === value.ID}
      options={EDITOR_THEMES}
      getOptionLabel={(option) => option.NAME}
      value={defaultEditorTheme}
      onChange={(event, value) => handleEditorThemeChange(event, value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("editor.selectTheme")}
          variant="outlined"
          sx={{ width: 150 }}
        />
      )}
    />
  );
}

export default EditorThemeSelect;
