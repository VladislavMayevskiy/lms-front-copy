import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Providers from "./providers";
import App from "./app";

import './assets/css/main.css';
import './i18n';

// TEMP DEBUG (remove after diagnosing slow loads)
console.time("boot:main");
console.timeLog("boot:main", "main.tsx module loaded");

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);

// React render scheduling continues after this; use provider/app logs for runtime bottlenecks.
console.timeLog("boot:main", "root.render called");
