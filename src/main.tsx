import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </ThemeProvider>
  </StrictMode>
);
