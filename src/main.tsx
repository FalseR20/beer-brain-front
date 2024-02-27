import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeContextWrapper from "./contexts/themeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeContextWrapper>
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  </ThemeContextWrapper>,
);
