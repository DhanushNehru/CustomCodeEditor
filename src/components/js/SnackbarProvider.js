// src/index.js
import React from "react";
import { SnackbarProvider as Notistack, closeSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";

const SnackbarProvider = ({children}) => {
  
  return (
    <Notistack
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={2000}
      preventDuplicate
      hideIconVariant
      action={(key) => (
        <IconButton onClick={() => closeSnackbar(key)}>
          <IoCloseCircleOutline color='#fff' />
        </IconButton>
      )}
      style={{width: "auto", minWidth: "100px", fontSize: "1em"}}
    >
      {children}
    </Notistack>
  )
}

export default SnackbarProvider