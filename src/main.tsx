import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import Providers from "./providers";
import App from "./app";

import './assets/css/main.css';
import './i18n';

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
