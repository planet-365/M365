// Azure AD and Microsoft Graph configuration

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || "YOUR_CLIENT_ID_HERE",
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID || "YOUR_TENANT_ID_HERE"}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphIntuneEndpoint: "https://graph.microsoft.com/v1.0/deviceManagement"
};

// Scopes needed for Intune access
export const intuneScopes = {
  scopes: [
    "DeviceManagementConfiguration.Read.All",
    "DeviceManagementApps.Read.All",
    "DeviceManagementManagedDevices.Read.All"
  ]
};
