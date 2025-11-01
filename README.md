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

## Quick Start (Automated Setup)

We provide automated scripts to simplify the Azure AD app registration process:

### Option 1: Using Azure CLI (Linux/macOS/WSL)

```bash
# Install Azure CLI if not already installed
# Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Run the automated setup script
./scripts/setup-azure-app.sh

# Follow the prompts to configure your app
# The script will create the app registration and generate the .env file
```

### Option 2: Using PowerShell (Windows)

```powershell
# Install required modules if not already installed
Install-Module -Name Az.Accounts -Scope CurrentUser
Install-Module -Name Az.Resources -Scope CurrentUser
Install-Module -Name Microsoft.Graph.Applications -Scope CurrentUser

# Run the automated setup script
.\scripts\Setup-AzureApp.ps1

# Follow the prompts to configure your app
# The script will create the app registration and generate the .env file
```

### Option 3: Configure Existing App

If you already have an Azure AD app registration:

```bash
# Run the configuration script
./scripts/configure-env.sh

# Enter your existing Client ID and Tenant ID
```

### Verify Your Setup

```bash
# Run the verification script
./scripts/verify-setup.sh

# This will check your configuration and ensure everything is set up correctly
```

After running the automated setup, skip to the [Running the Application](#running-the-application) section.

## Azure AD App Registration Setup (Manual)

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
├── scripts/
│   ├── setup-azure-app.sh          # Automated Azure AD app setup (Bash)
│   ├── Setup-AzureApp.ps1          # Automated Azure AD app setup (PowerShell)
│   ├── configure-env.sh            # Configure .env for existing app
│   └── verify-setup.sh             # Verify configuration
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

## Automation Scripts Details

### setup-azure-app.sh / Setup-AzureApp.ps1

These scripts automate the entire Azure AD app registration process:

1. **Login to Azure**: Authenticates you with Azure
2. **Create App Registration**: Creates a new Azure AD app with proper configuration
3. **Configure as SPA**: Sets up the app as a Single Page Application
4. **Add API Permissions**: Adds all required Microsoft Graph permissions:
   - User.Read
   - DeviceManagementConfiguration.Read.All
   - DeviceManagementApps.Read.All
   - DeviceManagementManagedDevices.Read.All
5. **Grant Admin Consent**: Attempts to grant admin consent automatically
6. **Generate .env file**: Creates the .env file with your app's configuration

### configure-env.sh

Use this script if you already have an Azure AD app registration. It will:
- Prompt you for your existing Client ID and Tenant ID
- Generate the .env file with your configuration
- Provide a checklist of permissions to verify

### verify-setup.sh

This script verifies your configuration:
- Checks if .env file exists and contains all required variables
- Validates the configuration values
- Verifies the app registration exists (if Azure CLI is available)
- Checks redirect URI configuration
- Confirms dependencies are installed

## Troubleshooting

### Automation Script Issues

**Azure CLI not found**
```bash
# Install Azure CLI
# Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
```

**PowerShell module errors**
```powershell
# Install required modules
Install-Module -Name Az.Accounts -Scope CurrentUser -Force
Install-Module -Name Microsoft.Graph.Applications -Scope CurrentUser -Force
```

**Permission denied when running scripts**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

**Admin consent not granted automatically**
- Go to Azure Portal → Azure AD → App registrations
- Find your app → API permissions
- Click "Grant admin consent for [Your Organization]"

### Authentication Errors

- Verify that your Client ID and Tenant ID are correct in `.env`
- Ensure the redirect URI matches exactly (including protocol and port)
- Check that admin consent has been granted for API permissions
- Run `./scripts/verify-setup.sh` to check your configuration

### Permission Errors

- Verify all required API permissions are added and admin consent is granted
- Ensure your user account has appropriate Intune admin roles
- Check that the app registration has delegated permissions (not application permissions)

### CORS Errors

- Make sure you're using the correct redirect URI type (Single-page application)
- Verify the redirect URI is registered in Azure AD
- Ensure the app is configured as SPA (not Web)

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
