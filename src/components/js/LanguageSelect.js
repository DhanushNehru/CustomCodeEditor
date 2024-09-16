import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { LANGUAGES } from "../../constants/constants";

function LanguageSelect({ handleLanguageChange, defaultLanguage, darkMode }) {
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
          sx={{
            width: 150,
            backgroundColor: darkMode ? "#333" : "#fff", // Background changes with dark mode
            color: darkMode ? "#fff" : "#000", // Text color changes
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: darkMode ? "#555" : "#ccc", // Border color for dark mode
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#aaa" : "#1976d2", // Hover state
              },
              "&.Mui-focused fieldset": {
                borderColor: darkMode ? "#bbb" : "#1976d2", // Focus state
              },
            },
            "& .MuiInputLabel-root": {
              color: darkMode ? "#bbb" : "#000", // Label color in dark mode
            },
          }}
        />
      )}
    />
  );
}

export default LanguageSelect;
