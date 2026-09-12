import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "@/style/global.css";

import { AppProvider } from "@/context/appcontext";

import App from "@/app";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
);