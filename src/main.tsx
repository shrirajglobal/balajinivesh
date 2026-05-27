import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Reload on stale chunk errors after deployments
window.addEventListener("vite:preloadError", () => window.location.reload());

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found. Check your index.html.");
}

createRoot(rootElement).render(<App />);
