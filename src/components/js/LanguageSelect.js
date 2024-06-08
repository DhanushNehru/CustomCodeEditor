import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { LANGUAGES } from "../../constants/constants";

function LanguageSelect({ handleLanguageChange, defaultLanguage }) {
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
          label="Select Language"
          variant="outlined"
          sx={{ width: 150 }}
        />
      )}
    />
  );
}

export default LanguageSelect;
