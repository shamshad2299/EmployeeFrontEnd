import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContextProvider from "./Store/authContext.jsx";

createRoot(document.getElementById("root")).render(
  
  <AuthContextProvider>
    <StrictMode>
      <App />
      </StrictMode>
  </AuthContextProvider>
);
