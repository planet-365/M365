#!/bin/bash

# Azure AD App Registration Automation Script
# This script creates and configures an Azure AD app for the Intune Configuration Viewer

set -e

echo "=================================================="
echo "Azure AD App Registration Setup"
echo "=================================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "ERROR: Azure CLI is not installed."
    echo "Please install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Get configuration from user
read -p "Enter the app name [Intune Configuration Viewer]: " APP_NAME
APP_NAME=${APP_NAME:-"Intune Configuration Viewer"}

read -p "Enter the redirect URI [http://localhost:3000]: " REDIRECT_URI
REDIRECT_URI=${REDIRECT_URI:-"http://localhost:3000"}

echo ""
echo "Configuration:"
echo "  App Name: $APP_NAME"
echo "  Redirect URI: $REDIRECT_URI"
echo ""

# Login to Azure (if not already logged in)
echo "Checking Azure login status..."
az account show &> /dev/null || az login

# Get tenant ID
TENANT_ID=$(az account show --query tenantId -o tsv)
echo "Tenant ID: $TENANT_ID"

# Create the Azure AD application
echo ""
echo "Creating Azure AD application..."
APP_ID=$(az ad app create \
    --display-name "$APP_NAME" \
    --sign-in-audience AzureADMyOrg \
    --web-redirect-uris "$REDIRECT_URI" \
    --enable-access-token-issuance true \
    --enable-id-token-issuance true \
    --query appId -o tsv)

echo "Application created with Client ID: $APP_ID"

# Get the application object ID
APP_OBJECT_ID=$(az ad app show --id "$APP_ID" --query id -o tsv)

# Microsoft Graph App ID (constant)
GRAPH_APP_ID="00000003-0000-0000-c000-000000000000"

# Required permissions (Microsoft Graph)
# User.Read: e1fe6dd8-ba31-4d61-89e7-88639da4683d
# DeviceManagementConfiguration.Read.All: f1493658-876a-4e5d-b7dc-68cfe8374d6e
# DeviceManagementApps.Read.All: 7a6ee1e7-141e-4cec-ae74-d9db155731ff
# DeviceManagementManagedDevices.Read.All: 314874da-47d6-4978-88dc-cf0d37f0bb82

echo ""
echo "Adding API permissions..."

# Add User.Read permission
az ad app permission add \
    --id "$APP_ID" \
    --api "$GRAPH_APP_ID" \
    --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope

# Add DeviceManagementConfiguration.Read.All permission
az ad app permission add \
    --id "$APP_ID" \
    --api "$GRAPH_APP_ID" \
    --api-permissions f1493658-876a-4e5d-b7dc-68cfe8374d6e=Scope

# Add DeviceManagementApps.Read.All permission
az ad app permission add \
    --id "$APP_ID" \
    --api "$GRAPH_APP_ID" \
    --api-permissions 7a6ee1e7-141e-4cec-ae74-d9db155731ff=Scope

# Add DeviceManagementManagedDevices.Read.All permission
az ad app permission add \
    --id "$APP_ID" \
    --api "$GRAPH_APP_ID" \
    --api-permissions 314874da-47d6-4978-88dc-cf0d37f0bb82=Scope

echo "API permissions added successfully."

# Grant admin consent
echo ""
read -p "Grant admin consent for these permissions? (y/n) [y]: " GRANT_CONSENT
GRANT_CONSENT=${GRANT_CONSENT:-y}

if [[ "$GRANT_CONSENT" == "y" ]]; then
    echo "Granting admin consent..."
    az ad app permission admin-consent --id "$APP_ID" || {
        echo "WARNING: Could not grant admin consent automatically."
        echo "You may need to grant it manually in the Azure Portal."
    }
else
    echo "Skipping admin consent. You'll need to grant it manually in the Azure Portal."
fi

# Configure the app as a SPA (Single Page Application)
echo ""
echo "Configuring as Single Page Application..."
az rest \
    --method PATCH \
    --uri "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
    --headers "Content-Type=application/json" \
    --body "{
        \"spa\": {
            \"redirectUris\": [\"$REDIRECT_URI\"]
        },
        \"web\": {
            \"redirectUris\": []
        }
    }"

# Create .env file
echo ""
echo "Creating .env file..."
cat > .env << EOF
# Azure AD App Registration Configuration
# Generated on $(date)

# Your Azure AD App Client ID
REACT_APP_CLIENT_ID=$APP_ID

# Your Azure AD Tenant ID
REACT_APP_TENANT_ID=$TENANT_ID

# Redirect URI (must match what's configured in Azure AD)
REACT_APP_REDIRECT_URI=$REDIRECT_URI
EOF

echo ""
echo "=================================================="
echo "Setup Complete!"
echo "=================================================="
echo ""
echo "Configuration saved to .env file:"
echo "  Client ID: $APP_ID"
echo "  Tenant ID: $TENANT_ID"
echo "  Redirect URI: $REDIRECT_URI"
echo ""
echo "Next steps:"
echo "  1. Review the .env file"
echo "  2. Run 'npm install' to install dependencies"
echo "  3. Run 'npm start' to start the application"
echo ""
echo "If admin consent was not granted automatically, please:"
echo "  1. Go to Azure Portal > Azure AD > App registrations"
echo "  2. Find '$APP_NAME'"
echo "  3. Go to API permissions"
echo "  4. Click 'Grant admin consent'"
echo ""
