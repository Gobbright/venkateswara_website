import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { initializeAnalytics } from './utils/analytics'
import "@fontsource/rowdies/400.css";
import "@fontsource/rowdies/700.css"; // optional bold

// Initialize analytics on app load
initializeAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
