#!/bin/bash

# Setup Verification Script
# Verifies that the Azure AD app and configuration are correct

set -e

echo "=================================================="
echo "Setup Verification"
echo "=================================================="
echo ""

# Check if .env file exists
if [[ ! -f .env ]]; then
    echo "❌ .env file not found"
    echo "   Run './scripts/setup-azure-app.sh' or './scripts/configure-env.sh' first"
    exit 1
fi

echo "✓ .env file found"

# Source the .env file
source .env

# Check required variables
MISSING_VARS=()

if [[ -z "$REACT_APP_CLIENT_ID" ]]; then
    MISSING_VARS+=("REACT_APP_CLIENT_ID")
fi

if [[ -z "$REACT_APP_TENANT_ID" ]]; then
    MISSING_VARS+=("REACT_APP_TENANT_ID")
fi

if [[ -z "$REACT_APP_REDIRECT_URI" ]]; then
    MISSING_VARS+=("REACT_APP_REDIRECT_URI")
fi

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
    echo "❌ Missing required variables in .env:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    exit 1
fi

echo "✓ All required environment variables are set"
echo ""
echo "Configuration:"
echo "  Client ID: $REACT_APP_CLIENT_ID"
echo "  Tenant ID: $REACT_APP_TENANT_ID"
echo "  Redirect URI: $REACT_APP_REDIRECT_URI"
echo ""

# Check if node_modules exists
if [[ ! -d node_modules ]]; then
    echo "⚠ node_modules not found"
    echo "   Run 'npm install' to install dependencies"
else
    echo "✓ node_modules found"
fi

# Check if package.json exists
if [[ ! -f package.json ]]; then
    echo "❌ package.json not found"
    exit 1
fi

echo "✓ package.json found"
echo ""

# Verify Azure CLI is installed
if command -v az &> /dev/null; then
    echo "✓ Azure CLI is installed"

    # Try to verify the app registration
    if az account show &> /dev/null; then
        echo "✓ Logged in to Azure CLI"
        echo ""
        echo "Verifying app registration..."

        APP_INFO=$(az ad app show --id "$REACT_APP_CLIENT_ID" 2>/dev/null || echo "")

        if [[ -n "$APP_INFO" ]]; then
            APP_NAME=$(echo "$APP_INFO" | jq -r '.displayName')
            echo "✓ App registration found: $APP_NAME"

            # Check redirect URIs
            REDIRECT_URIS=$(echo "$APP_INFO" | jq -r '.spa.redirectUris[]?' 2>/dev/null || echo "")
            if echo "$REDIRECT_URIS" | grep -q "$REACT_APP_REDIRECT_URI"; then
                echo "✓ Redirect URI is configured correctly"
            else
                echo "⚠ Redirect URI '$REACT_APP_REDIRECT_URI' not found in app registration"
                echo "   Configured URIs: $REDIRECT_URIS"
            fi
        else
            echo "⚠ Could not verify app registration (may require admin access)"
        fi
    else
        echo "⚠ Not logged in to Azure CLI (run 'az login' to verify app)"
    fi
else
    echo "⚠ Azure CLI not installed (skipping app verification)"
fi

echo ""
echo "=================================================="
echo "Verification Summary"
echo "=================================================="
echo ""
echo "Your setup appears to be ready!"
echo ""
echo "Required manual checks:"
echo "  1. Verify the app has the correct redirect URI in Azure Portal"
echo "  2. Verify these API permissions are granted with admin consent:"
echo "     - User.Read"
echo "     - DeviceManagementConfiguration.Read.All"
echo "     - DeviceManagementApps.Read.All"
echo "     - DeviceManagementManagedDevices.Read.All"
echo ""
echo "To start the application:"
echo "  npm install  # If not already done"
echo "  npm start"
echo ""
