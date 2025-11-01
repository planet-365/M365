# Intune Configuration Viewer

A web application built with React that connects to Microsoft Intune via the Microsoft Graph API to view and manage device configurations, compliance policies, and managed devices.

## Features

- **Azure AD Authentication**: Secure login using Microsoft Authentication Library (MSAL)
- **Dashboard**: Overview of Intune configurations with statistics
- **Device Configurations**: View and explore device configuration profiles
- **Compliance Policies**: Browse device compliance policies
- **Managed Devices**: Monitor and view details of managed devices
- **Responsive Design**: Mobile-friendly interface

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (version 14 or higher)
- npm or yarn
- An Azure AD tenant
- Administrator access to Azure Portal
- Microsoft Intune subscription

## Azure AD App Registration Setup

### Step 1: Register the Application in Azure AD

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the application details:
   - **Name**: Intune Configuration Viewer
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Select "Single-page application (SPA)" and enter `http://localhost:3000`
5. Click **Register**

### Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph** > **Delegated permissions**
4. Add the following permissions:
   - `User.Read`
   - `DeviceManagementConfiguration.Read.All`
   - `DeviceManagementApps.Read.All`
   - `DeviceManagementManagedDevices.Read.All`
5. Click **Add permissions**
6. Click **Grant admin consent** for your organization (requires admin privileges)

### Step 3: Get Your Configuration Values

1. From the app registration **Overview** page, copy:
   - **Application (client) ID**
   - **Directory (tenant) ID**

## Installation

1. Clone the repository:
```bash
cd M365
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` file and add your Azure AD configuration:
```env
REACT_APP_CLIENT_ID=your-client-id-here
REACT_APP_TENANT_ID=your-tenant-id-here
REACT_APP_REDIRECT_URI=http://localhost:3000
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Production Build

Build the application for production:
```bash
npm run build
```

The production files will be in the `build` folder.

## Deploying to Azure

### Option 1: Azure Static Web Apps

1. Install Azure Static Web Apps CLI:
```bash
npm install -g @azure/static-web-apps-cli
```

2. Build the app:
```bash
npm run build
```

3. Deploy using Azure CLI or GitHub Actions

### Option 2: Azure App Service

1. Create an Azure App Service (Node.js runtime)
2. Configure deployment from your repository
3. Update the redirect URI in Azure AD app registration to match your production URL
4. Set environment variables in App Service configuration

### Update Production Settings

After deploying, update your Azure AD app registration:
1. Go to **Authentication**
2. Add your production URL as a redirect URI
3. Update the `.env` file or App Service environment variables with the production URL

## Usage

1. **Login**: Click "Sign in with Microsoft" to authenticate
2. **Dashboard**: View overview statistics of your Intune environment
3. **Device Configurations**: Browse and view detailed configuration profiles
4. **Compliance Policies**: Review compliance policies
5. **Managed Devices**: Monitor enrolled devices and their compliance status

## Project Structure

```
M365/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── DeviceConfigurations.jsx
│   │   ├── CompliancePolicies.jsx
│   │   ├── ManagedDevices.jsx
│   │   └── Navigation.jsx
│   ├── services/
│   │   └── graphService.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── authConfig.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints Used

This application uses the following Microsoft Graph API endpoints:

- `/me` - Get user information
- `/deviceManagement/deviceConfigurations` - Get device configurations
- `/deviceManagement/deviceCompliancePolicies` - Get compliance policies
- `/deviceManagement/managedDevices` - Get managed devices
- `/deviceManagement/mobileApps` - Get mobile applications
- `/deviceManagement/deviceEnrollmentConfigurations` - Get enrollment configurations

## Troubleshooting

### Authentication Errors

- Verify that your Client ID and Tenant ID are correct in `.env`
- Ensure the redirect URI matches exactly (including protocol and port)
- Check that admin consent has been granted for API permissions

### Permission Errors

- Verify all required API permissions are added and admin consent is granted
- Ensure your user account has appropriate Intune admin roles

### CORS Errors

- Make sure you're using the correct redirect URI type (Single-page application)
- Verify the redirect URI is registered in Azure AD

## Security Considerations

- Never commit `.env` file to version control
- Store production secrets in Azure Key Vault or App Service Configuration
- Regularly review and update API permissions
- Use HTTPS in production
- Implement proper error handling for production deployments

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for demonstration purposes. Please ensure you comply with Microsoft's licensing and terms of service.

## Additional Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Microsoft Intune API Reference](https://docs.microsoft.com/en-us/graph/api/resources/intune-graph-overview)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
