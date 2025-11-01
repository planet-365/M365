#!/bin/bash

# Configuration Generator Script
# Use this if you already have an Azure AD app registration

echo "=================================================="
echo "Environment Configuration Generator"
echo "=================================================="
echo ""
echo "This script will help you create the .env file."
echo "You'll need your Azure AD app registration details."
echo ""

# Get Client ID
read -p "Enter your Application (Client) ID: " CLIENT_ID
while [[ -z "$CLIENT_ID" ]]; do
    echo "Client ID is required."
    read -p "Enter your Application (Client) ID: " CLIENT_ID
done

# Get Tenant ID
read -p "Enter your Directory (Tenant) ID: " TENANT_ID
while [[ -z "$TENANT_ID" ]]; do
    echo "Tenant ID is required."
    read -p "Enter your Directory (Tenant) ID: " TENANT_ID
done

# Get Redirect URI
read -p "Enter the Redirect URI [http://localhost:3000]: " REDIRECT_URI
REDIRECT_URI=${REDIRECT_URI:-"http://localhost:3000"}

echo ""
echo "Configuration:"
echo "  Client ID: $CLIENT_ID"
echo "  Tenant ID: $TENANT_ID"
echo "  Redirect URI: $REDIRECT_URI"
echo ""

# Create .env file
cat > .env << EOF
# Azure AD App Registration Configuration
# Generated on $(date)

# Your Azure AD App Client ID
REACT_APP_CLIENT_ID=$CLIENT_ID

# Your Azure AD Tenant ID
REACT_APP_TENANT_ID=$TENANT_ID

# Redirect URI (must match what's configured in Azure AD)
REACT_APP_REDIRECT_URI=$REDIRECT_URI
EOF

echo "✓ Configuration saved to .env file"
echo ""
echo "Next steps:"
echo "  1. Verify the .env file contains correct values"
echo "  2. Ensure your Azure AD app has the following redirect URI: $REDIRECT_URI"
echo "  3. Ensure the following API permissions are granted:"
echo "     - User.Read"
echo "     - DeviceManagementConfiguration.Read.All"
echo "     - DeviceManagementApps.Read.All"
echo "     - DeviceManagementManagedDevices.Read.All"
echo "  4. Run 'npm install' to install dependencies"
echo "  5. Run 'npm start' to start the application"
echo ""
