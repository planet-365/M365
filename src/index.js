import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import App from './App';
import './index.css';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL and render app
msalInstance.initialize().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App msalInstance={msalInstance} />
    </React.StrictMode>
  );
});
