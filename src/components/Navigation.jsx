import React from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

function Navigation() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Intune Config Viewer</h2>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/configurations">Device Configurations</Link></li>
        <li><Link to="/compliance">Compliance Policies</Link></li>
        <li><Link to="/devices">Managed Devices</Link></li>
      </ul>
      <div className="nav-actions">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navigation;
