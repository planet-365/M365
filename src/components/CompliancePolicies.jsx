import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { intuneScopes } from '../authConfig';
import { getDeviceCompliancePolicies } from '../services/graphService';

function CompliancePolicies() {
  const { instance, accounts } = useMsal();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await instance.acquireTokenSilent({
          ...intuneScopes,
          account: accounts[0]
        });

        const policyData = await getDeviceCompliancePolicies(response.accessToken);
        setPolicies(policyData);
      } catch (err) {
        console.error('Error fetching compliance policies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accounts.length > 0) {
      fetchPolicies();
    }
  }, [instance, accounts]);

  if (loading) {
    return <div className="loading">Loading compliance policies...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="policies-page">
      <h1>Device Compliance Policies</h1>

      <div className="policies-list">
        {policies.length === 0 ? (
          <p>No compliance policies found.</p>
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
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.displayName}</td>
                  <td>{policy['@odata.type']?.split('.').pop() || 'N/A'}</td>
                  <td>{policy.version || 'N/A'}</td>
                  <td>{new Date(policy.lastModifiedDateTime).toLocaleString()}</td>
                  <td>
                    <button onClick={() => setSelectedPolicy(policy)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedPolicy && (
        <div className="modal" onClick={() => setSelectedPolicy(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPolicy.displayName}</h2>
            <button className="close-btn" onClick={() => setSelectedPolicy(null)}>×</button>
            <div className="policy-details">
              <p><strong>ID:</strong> {selectedPolicy.id}</p>
              <p><strong>Description:</strong> {selectedPolicy.description || 'No description'}</p>
              <p><strong>Created:</strong> {new Date(selectedPolicy.createdDateTime).toLocaleString()}</p>
              <p><strong>Last Modified:</strong> {new Date(selectedPolicy.lastModifiedDateTime).toLocaleString()}</p>
              <p><strong>Version:</strong> {selectedPolicy.version}</p>
              <details>
                <summary>Raw JSON</summary>
                <pre>{JSON.stringify(selectedPolicy, null, 2)}</pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompliancePolicies;
