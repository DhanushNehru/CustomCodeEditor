import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const EmbeddedUrl = ({ url }) => {
  const portalRef = useRef(null);
  const portalRefCopy = useRef(null);

  return <iframe src="https://www.twitter.com" sandbox="" />;

  return (
    <div>
      <embed
        src="https://www.youtube.com/@dhanushnehru"
        // referrerPolicy="origin"
      ></embed>
      {/* <h1> Hello world </h1> */}
    </div>
  );
};

export default EmbeddedUrl;
