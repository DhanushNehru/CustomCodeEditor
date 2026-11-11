import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MdCheck, MdExpandMore, MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { UI_LANGUAGES, UI_LANGUAGE_STORAGE_KEY } from "../../i18n";

function UiLanguageSelect() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const currentCode = i18n.resolvedLanguage || "en";
  const current =
    UI_LANGUAGES.find((language) => language.code === currentCode) ||
    UI_LANGUAGES[0];

  const handleSelect = (code) => {
    setAnchorEl(null);
    if (code === currentCode) return;
    i18n.changeLanguage(code);
    try {
      localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, code);
    } catch (e) {
      console.error("Local storage save error:", e);
    }
  };

  return (
    <>
      <Button
        id="ui-language-button"
        aria-controls={open ? "ui-language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label={`${t("header.uiLanguage")}: ${current.name}`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        variant="outlined"
        size="small"
        startIcon={<MdLanguage aria-hidden="true" />}
        endIcon={
          <MdExpandMore
            aria-hidden="true"
            style={{
              transition: "transform 0.2s ease",
              transform: open ? "rotate(180deg)" : "none",
            }}
          />
        }
        sx={{
          color: "text.primary",
          borderColor: "divider",
          borderRadius: "999px",
          textTransform: "none",
          whiteSpace: "nowrap",
          px: 1.5,
          "&:hover": { borderColor: "text.primary" },
          "& .MuiButton-startIcon": { mr: 0.75 },
          "& .MuiButton-endIcon": { ml: 0.25 },
        }}
      >
        <span lang={current.code}>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            {current.name}
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            {current.code.toUpperCase()}
          </Box>
        </span>
      </Button>
      <Menu
        id="ui-language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ "aria-labelledby": "ui-language-button", dense: true }}
        PaperProps={{ sx: { mt: 0.75, minWidth: 160, borderRadius: 2 } }}
      >
        {UI_LANGUAGES.map((language) => {
          const selected = language.code === currentCode;
          return (
            <MenuItem
              key={language.code}
              lang={language.code}
              selected={selected}
              onClick={() => handleSelect(language.code)}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                {selected && <MdCheck aria-hidden="true" />}
              </ListItemIcon>
              <ListItemText>{language.name}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

export default UiLanguageSelect;
