import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserContext from "./context/UserContext";
ReactDOM.render(
  <React.StrictMode>
    <UserContext.Provider>
    <App />
    </UserContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
