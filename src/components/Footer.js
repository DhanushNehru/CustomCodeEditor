import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa"; 
import { GrInstagram } from "react-icons/gr";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import IconButton from "./IconButton";

function App() {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem" // equivalent to gap-4
  };

  const iconStyle = { color: "white" }; // Style for white icons

  return (
    <div style={containerStyle}>
      <a href="https://github.com/DhanushNehru" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <IconButton text="DhanushNehru">
          <FaGithub size={30} style={iconStyle} />
        </IconButton>
      </a>
      <a href="https://www.linkedin.com/in/dhanushnehru/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <IconButton text="dhanushnehru" color="#316FF6">
          <FaLinkedin size={30} style={iconStyle} />
        </IconButton>
      </a>
      <a href="https://www.instagram.com/dhanush_nehru/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <IconButton text="dhanush_nehru" color="#d62976">
          <GrInstagram size={30} style={iconStyle} />
        </IconButton>
      </a>
      <a href="https://x.com/Dhanush_Nehru" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <IconButton text="Dhanush_Nehru" color="black">
          <FaXTwitter size={30} style={iconStyle} />
        </IconButton>
      </a>
      <a href="https://www.youtube.com/@dhanushnehru" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <IconButton text="@dhanushnehru" color="#FF0000">
          <IoLogoYoutube size={30} style={iconStyle} />
        </IconButton>
      </a>
    </div>
  );
}

export default App;
