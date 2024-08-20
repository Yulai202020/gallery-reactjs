import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

fetch("/config.json")
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  localStorage.setItem("server_path", data.server_path);
})
.catch(error => {
  console.error("Failed to fetch config:", error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
