import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Evita H1/ids duplicados en a11y tras hidratar; crawlers ya leyeron #seo-bootstrap.
requestAnimationFrame(() => {
  document.getElementById("seo-bootstrap")?.remove();
});
