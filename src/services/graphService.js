import { Client } from '@microsoft/microsoft-graph-client';

/**
 * Creating a Graph client instance via options method.
 */
export function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
}

/**
 * Get user information from Microsoft Graph
 */
export async function getUserInfo(accessToken) {
  const client = getGraphClient(accessToken);
  return await client.api('/me').get();
}

/**
 * Get all device configurations from Intune
 */
export async function getDeviceConfigurations(accessToken) {
  const client = getGraphClient(accessToken);
  try {
    const response = await client.api('/deviceManagement/deviceConfigurations').get();
    return response.value || [];
  } catch (error) {
    console.error('Error fetching device configurations:', error);
    throw error;
  }
}

/**
 * Get device compliance policies from Intune
 */
export async function getDeviceCompliancePolicies(accessToken) {
  const client = getGraphClient(accessToken);
  try {
    const response = await client.api('/deviceManagement/deviceCompliancePolicies').get();
    return response.value || [];
  } catch (error) {
    console.error('Error fetching compliance policies:', error);
    throw error;
  }
}

/**
 * Get managed devices from Intune
 */
export async function getManagedDevices(accessToken) {
  const client = getGraphClient(accessToken);
  try {
    const response = await client.api('/deviceManagement/managedDevices').get();
    return response.value || [];
  } catch (error) {
    console.error('Error fetching managed devices:', error);
    throw error;
  }
}

/**
 * Get mobile apps from Intune
 */
export async function getMobileApps(accessToken) {
  const client = getGraphClient(accessToken);
  try {
    const response = await client.api('/deviceManagement/mobileApps').get();
    return response.value || [];
  } catch (error) {
    console.error('Error fetching mobile apps:', error);
    throw error;
  }
}

/**
 * Get device enrollment configurations
 */
export async function getDeviceEnrollmentConfigurations(accessToken) {
  const client = getGraphClient(accessToken);
  try {
    const response = await client.api('/deviceManagement/deviceEnrollmentConfigurations').get();
    return response.value || [];
  } catch (error) {
    console.error('Error fetching enrollment configurations:', error);
    throw error;
  }
}

/**
 * Get conditional access policies
 */
export async function getConditionalAccessPolicies(accessToken) {
  const client = getGraphClient(accessToken);
  try {
    const response = await client.api('/identity/conditionalAccess/policies').get();
    return response.value || [];
  } catch (error) {
    console.error('Error fetching conditional access policies:', error);
    throw error;
  }
}
