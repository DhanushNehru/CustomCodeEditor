import React from "react";
import ReactDOM from "react-dom/client";
import "./components/css/index.css";
import App from "./App";
import { SocketProvider } from "./context/socket";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SocketProvider>
    <App />
    </SocketProvider>


)
