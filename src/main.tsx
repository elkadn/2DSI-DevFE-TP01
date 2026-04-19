import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'; 
  
createRoot(document.getElementById('root')!).render( 
  <StrictMode> 
    <BrowserRouter> 
      <AuthProvider> 
        <App /> 
      </AuthProvider> 
    </BrowserRouter> 
  </StrictMode> 
); 