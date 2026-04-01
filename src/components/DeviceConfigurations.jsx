import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { intuneScopes } from '../authConfig';
import { getDeviceConfigurations } from '../services/graphService';

function DeviceConfigurations() {
  const { instance, accounts } = useMsal();
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        setLoading(true);
        const response = await instance.acquireTokenSilent({
          ...intuneScopes,
          account: accounts[0]
        });

        const configs = await getDeviceConfigurations(response.accessToken);
        setConfigurations(configs);
      } catch (err) {
        console.error('Error fetching device configurations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchConfigurations();
    }
  }, [instance, accounts]);

  if (loading) {
    return <div className="loading">Loading device configurations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="configurations-page">
      <h1>Device Configurations</h1>

      <div className="configurations-list">
        {configurations.length === 0 ? (
          <p>No device configurations found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Platform</th>
                <th>Version</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {configurations.map((config) => (
                <tr key={config.id}>
                  <td>{config.displayName}</td>
                  <td>{config['@odata.type']?.split('.').pop() || 'N/A'}</td>
                  <td>{config.version || 'N/A'}</td>
                  <td>{new Date(config.lastModifiedDateTime).toLocaleString()}</td>
                  <td>
                    <button onClick={() => setSelectedConfig(config)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedConfig && (
        <div className="modal" onClick={() => setSelectedConfig(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedConfig.displayName}</h2>
            <button className="close-btn" onClick={() => setSelectedConfig(null)}>×</button>
            <div className="config-details">
              <p><strong>ID:</strong> {selectedConfig.id}</p>
              <p><strong>Description:</strong> {selectedConfig.description || 'No description'}</p>
              <p><strong>Created:</strong> {new Date(selectedConfig.createdDateTime).toLocaleString()}</p>
              <p><strong>Last Modified:</strong> {new Date(selectedConfig.lastModifiedDateTime).toLocaleString()}</p>
              <p><strong>Version:</strong> {selectedConfig.version}</p>
              <details>
                <summary>Raw JSON</summary>
                <pre>{JSON.stringify(selectedConfig, null, 2)}</pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeviceConfigurations;
