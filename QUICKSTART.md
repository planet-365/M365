# Quick Start Guide

Get up and running with the Intune Configuration Viewer in minutes!

## Automated Setup (Recommended)

### For Linux/macOS/WSL Users

```bash
# 1. Run the automated setup script
./scripts/setup-azure-app.sh

# 2. Follow the prompts:
#    - Press Enter to accept default app name
#    - Press Enter to accept default redirect URI (http://localhost:3000)
#    - Login to Azure when prompted
#    - Type 'y' to grant admin consent

# 3. Install dependencies
npm install

# 4. Start the app
npm start
```

### For Windows PowerShell Users

```powershell
# 1. Install required modules (first time only)
Install-Module -Name Az.Accounts -Scope CurrentUser
Install-Module -Name Microsoft.Graph.Applications -Scope CurrentUser

# 2. Run the automated setup script
.\scripts\Setup-AzureApp.ps1

# 3. Follow the prompts:
#    - Press Enter to accept default app name
#    - Press Enter to accept default redirect URI (http://localhost:3000)
#    - Login to Azure when prompted
#    - Type 'y' to grant admin consent

# 4. Install dependencies
npm install

# 5. Start the app
npm start
```

## What the Setup Script Does

The automation script will:

1. ✅ Login to your Azure account
2. ✅ Create an Azure AD app registration
3. ✅ Configure it as a Single Page Application (SPA)
4. ✅ Add all required API permissions for Intune
5. ✅ Grant admin consent (if you have permissions)
6. ✅ Generate your `.env` configuration file

## Manual Setup (Alternative)

If you prefer to set up manually or already have an app registration:

### Option 1: Use Existing App

```bash
# Run the configuration script
./scripts/configure-env.sh

# Enter your existing:
#   - Application (Client) ID
#   - Directory (Tenant) ID
#   - Redirect URI (or accept default)
```

### Option 2: Manual Azure Portal Setup

See the full [README.md](README.md) for detailed manual setup instructions.

## Verify Your Setup

Before running the app, verify everything is configured correctly:

```bash
./scripts/verify-setup.sh
```

This will check:
- ✅ `.env` file exists with all required variables
- ✅ Dependencies are installed
- ✅ App registration exists in Azure AD
- ✅ Redirect URI is configured correctly

## Start Using the App

Once setup is complete:

```bash
# Install dependencies (if not done already)
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`. Sign in with your Microsoft account that has access to Intune.

## Required Azure Permissions

Your Azure account needs:
- **Azure AD Admin** permissions to create app registrations
- **Intune Administrator** role to view Intune data

If you don't have admin permissions:
1. Ask your IT admin to run the setup script
2. Or ask them to manually create the app registration and grant permissions

## Troubleshooting

### "Command not found: az"
Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

### "Cannot grant admin consent"
You may not have sufficient permissions. Options:
1. Ask an Azure AD admin to grant consent
2. Manually grant consent in Azure Portal:
   - Go to Azure AD → App registrations
   - Find your app → API permissions
   - Click "Grant admin consent"

### "Module not found" (PowerShell)
```powershell
Install-Module -Name Az.Accounts -Scope CurrentUser -Force
Install-Module -Name Microsoft.Graph.Applications -Scope CurrentUser -Force
```

### Permission denied when running scripts
```bash
chmod +x scripts/*.sh
```

## Next Steps

After the app is running:

1. **Explore the Dashboard** - View statistics about your Intune environment
2. **Browse Configurations** - Check device configuration profiles
3. **Review Compliance** - See compliance policies
4. **Monitor Devices** - View managed devices and their status

## Getting Help

- Check the full [README.md](README.md) for detailed documentation
- Review [API Endpoints](README.md#api-endpoints-used) to understand what data is accessed
- See [Troubleshooting](README.md#troubleshooting) for common issues

## Production Deployment

To deploy to production:

1. Update the redirect URI in the setup script or manually add it in Azure AD
2. Deploy to Azure Static Web Apps or Azure App Service
3. Update environment variables with production values

See the [Deploying to Azure](README.md#deploying-to-azure) section for detailed instructions.
