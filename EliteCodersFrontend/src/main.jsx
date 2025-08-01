import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ContextProvider from "./Context/ContextProvider.jsx";
import UserProvider from "./Context/UserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </ContextProvider>
);
