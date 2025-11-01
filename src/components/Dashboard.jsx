import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { intuneScopes } from '../authConfig';
import {
  getDeviceConfigurations,
  getDeviceCompliancePolicies,
  getManagedDevices,
  getMobileApps,
  getUserInfo
} from '../services/graphService';

function Dashboard() {
  const { instance, accounts } = useMsal();
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    deviceConfigs: 0,
    compliancePolicies: 0,
    managedDevices: 0,
    mobileApps: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await instance.acquireTokenSilent({
          ...intuneScopes,
          account: accounts[0]
        });

        // Fetch user info
        const user = await getUserInfo(response.accessToken);
        setUserInfo(user);

        // Fetch statistics
        const [configs, policies, devices, apps] = await Promise.all([
          getDeviceConfigurations(response.accessToken),
          getDeviceCompliancePolicies(response.accessToken),
          getManagedDevices(response.accessToken),
          getMobileApps(response.accessToken)
        ]);

        setStats({
          deviceConfigs: configs.length,
          compliancePolicies: policies.length,
          managedDevices: devices.length,
          mobileApps: apps.length
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchData();
    }
  }, [instance, accounts]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Intune Configuration Dashboard</h1>

      {userInfo && (
        <div className="user-info">
          <h2>Welcome, {userInfo.displayName}</h2>
          <p>Email: {userInfo.userPrincipalName}</p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Device Configurations</h3>
          <div className="stat-number">{stats.deviceConfigs}</div>
          <p>Active configuration profiles</p>
        </div>

        <div className="stat-card">
          <h3>Compliance Policies</h3>
          <div className="stat-number">{stats.compliancePolicies}</div>
          <p>Device compliance policies</p>
        </div>

        <div className="stat-card">
          <h3>Managed Devices</h3>
          <div className="stat-number">{stats.managedDevices}</div>
          <p>Devices under management</p>
        </div>

        <div className="stat-card">
          <h3>Mobile Apps</h3>
          <div className="stat-number">{stats.mobileApps}</div>
          <p>Deployed applications</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
