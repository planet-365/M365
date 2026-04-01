import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DeviceConfigurations from './components/DeviceConfigurations';
import CompliancePolicies from './components/CompliancePolicies';
import ManagedDevices from './components/ManagedDevices';
import './App.css';

function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.error(e);
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Intune Configuration Viewer</h1>
        <p>View and manage your Microsoft Intune configurations</p>
        <button onClick={handleLogin} className="login-btn">
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <>
      <AuthenticatedTemplate>
        <Router>
          <div className="app">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/configurations" element={<DeviceConfigurations />} />
                <Route path="/compliance" element={<CompliancePolicies />} />
                <Route path="/devices" element={<ManagedDevices />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
    </>
  );
}

function App({ msalInstance }) {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
}

export default App;
