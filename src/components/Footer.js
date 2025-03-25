import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import {
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import IconButton from "./IconButton";

function App() {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexDirection: "row",
    width: "100%",
  };

  const iconStyle = { color: "white" };

  const socialMediaStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginLeft: "1rem",
    flex: 1,
  };

  const shareStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  };

  const madeWithStyle = {
    display: "flex",
    alignItems: "center",
    marginLeft: "0.5rem",
  };

  return (
    <div style={containerStyle}>
      <div style={madeWithStyle}>
        <span> Made with ❤️ by {"  "}</span>
        <a
          href="https://www.github.com/DhanushNehru"
          style={{ color: "#4CAF50", marginLeft: "0.3rem" }}
        >
          Dhanush Nehru
        </a>
      </div>
      <div style={socialMediaStyle}>
        <a
          href="https://github.com/DhanushNehru"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <IconButton text="DhanushNehru">
            <FaGithub size={15} style={iconStyle} />
          </IconButton>
        </a>
        <a
          href="https://www.linkedin.com/in/dhanushnehru/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <IconButton text="dhanushnehru" color="#316FF6">
            <FaLinkedin size={15} style={iconStyle} />
          </IconButton>
        </a>
        <a
          href="https://www.instagram.com/dhanush_nehru/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <IconButton text="dhanush_nehru" color="#d62976">
            <GrInstagram size={15} style={iconStyle} />
          </IconButton>
        </a>
        <a
          href="https://x.com/Dhanush_Nehru"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <IconButton text="Dhanush_Nehru" color="black">
            <FaXTwitter size={15} style={iconStyle} />
          </IconButton>
        </a>
        <a
          href="https://www.youtube.com/@dhanushnehru"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <IconButton text="@dhanushnehru" color="#FF0000">
            <IoLogoYoutube size={15} style={iconStyle} />
          </IconButton>
        </a>
      </div>
      <div style={shareStyle}>
        <div className="flex space-x-2">
          <span>Share</span>
          <div>
            <RedditShareButton url={"custom-code-editor.vercel.app/"}>
              <RedditIcon size={32} round />
            </RedditShareButton>
          </div>
          <div>
            <WhatsappShareButton url={"custom-code-editor.vercel.app/"}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
          <div>
            <LinkedinShareButton url={"custom-code-editor.vercel.app/"}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
          <div>
            <PinterestShareButton
              media={"custom-code-editor.vercel.app/"}
              url={"custom-code-editor.vercel.app/"}
            >
              <PinterestIcon size={32} round />
            </PinterestShareButton>
          </div>
          <div>
            <TwitterShareButton
              url={"custom-code-editor.vercel.app/"}
              style={{ marginRight: "40px" }}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
