import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './styles/index.css'
import './styles/App.css'
import './styles/main.scss';

const AppWrapper = ({ children }) => {
  // Only use StrictMode in production
  return import.meta.env.PROD ? (
    <StrictMode>{children}</StrictMode>
  ) : (
    children
  );
};

createRoot(document.getElementById('root')).render(
  <AppWrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppWrapper>
);