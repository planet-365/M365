import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { intuneScopes } from '../authConfig';
import { getManagedDevices } from '../services/graphService';

function ManagedDevices() {
  const { instance, accounts } = useMsal();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await instance.acquireTokenSilent({
          ...intuneScopes,
          account: accounts[0]
        });

        const deviceData = await getManagedDevices(response.accessToken);
        setDevices(deviceData);
      } catch (err) {
        console.error('Error fetching managed devices:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchDevices();
    }
  }, [instance, accounts]);

  if (loading) {
    return <div className="loading">Loading managed devices...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="devices-page">
      <h1>Managed Devices</h1>

      <div className="devices-list">
        {devices.length === 0 ? (
          <p>No managed devices found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Device Name</th>
                <th>User</th>
                <th>OS</th>
                <th>Compliance</th>
                <th>Last Sync</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.deviceName}</td>
                  <td>{device.userPrincipalName || device.emailAddress || 'N/A'}</td>
                  <td>{device.operatingSystem} {device.osVersion}</td>
                  <td>
                    <span className={`status ${device.complianceState?.toLowerCase()}`}>
                      {device.complianceState || 'Unknown'}
                    </span>
                  </td>
                  <td>{device.lastSyncDateTime ? new Date(device.lastSyncDateTime).toLocaleString() : 'Never'}</td>
                  <td>
                    <button onClick={() => setSelectedDevice(device)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedDevice && (
        <div className="modal" onClick={() => setSelectedDevice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedDevice.deviceName}</h2>
            <button className="close-btn" onClick={() => setSelectedDevice(null)}>×</button>
            <div className="device-details">
              <p><strong>ID:</strong> {selectedDevice.id}</p>
              <p><strong>User:</strong> {selectedDevice.userPrincipalName || 'N/A'}</p>
              <p><strong>OS:</strong> {selectedDevice.operatingSystem} {selectedDevice.osVersion}</p>
              <p><strong>Manufacturer:</strong> {selectedDevice.manufacturer || 'N/A'}</p>
              <p><strong>Model:</strong> {selectedDevice.model || 'N/A'}</p>
              <p><strong>Serial Number:</strong> {selectedDevice.serialNumber || 'N/A'}</p>
              <p><strong>Enrollment Date:</strong> {selectedDevice.enrolledDateTime ? new Date(selectedDevice.enrolledDateTime).toLocaleString() : 'N/A'}</p>
              <p><strong>Last Sync:</strong> {selectedDevice.lastSyncDateTime ? new Date(selectedDevice.lastSyncDateTime).toLocaleString() : 'Never'}</p>
              <p><strong>Compliance State:</strong> {selectedDevice.complianceState || 'Unknown'}</p>
              <details>
                <summary>Raw JSON</summary>
                <pre>{JSON.stringify(selectedDevice, null, 2)}</pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagedDevices;
