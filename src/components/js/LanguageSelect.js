import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../constants/constants";

function LanguageSelect({ handleLanguageChange, defaultLanguage }) {
  const { t } = useTranslation();
  return (
    <Autocomplete
      size="small"
      disableClearable
      isOptionEqualToValue={(option, value) => option.DEFAULT_LANGUAGE === value.DEFAULT_LANGUAGE}
      options={LANGUAGES}
      getOptionLabel={(option) => option.NAME}
      value={defaultLanguage}
      onChange={(event, value) => handleLanguageChange(event, value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("editor.selectLanguage")}
          variant="outlined"
          sx={{ width: 150 }}
        />
      )}
    />
  );
}

export default LanguageSelect;
