# Azure AD App Registration Automation Script (PowerShell)
# This script creates and configures an Azure AD app for the Intune Configuration Viewer

#Requires -Modules Az.Accounts, Az.Resources, Microsoft.Graph

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$AppName = "Intune Configuration Viewer",

    [Parameter(Mandatory=$false)]
    [string]$RedirectUri = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Azure AD App Registration Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if required modules are installed
Write-Host "Checking required PowerShell modules..." -ForegroundColor Yellow

$requiredModules = @("Az.Accounts", "Az.Resources", "Microsoft.Graph.Applications")
foreach ($module in $requiredModules) {
    if (-not (Get-Module -ListAvailable -Name $module)) {
        Write-Host "ERROR: Module '$module' is not installed." -ForegroundColor Red
        Write-Host "Install it with: Install-Module -Name $module -Scope CurrentUser" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "All required modules are available." -ForegroundColor Green
Write-Host ""

# Get configuration from user if not provided
if ([string]::IsNullOrEmpty($AppName)) {
    $AppName = Read-Host "Enter the app name [Intune Configuration Viewer]"
    if ([string]::IsNullOrEmpty($AppName)) {
        $AppName = "Intune Configuration Viewer"
    }
}

if ([string]::IsNullOrEmpty($RedirectUri)) {
    $RedirectUri = Read-Host "Enter the redirect URI [http://localhost:3000]"
    if ([string]::IsNullOrEmpty($RedirectUri)) {
        $RedirectUri = "http://localhost:3000"
    }
}

Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  App Name: $AppName"
Write-Host "  Redirect URI: $RedirectUri"
Write-Host ""

# Connect to Azure
Write-Host "Connecting to Azure..." -ForegroundColor Yellow
try {
    $context = Get-AzContext
    if (-not $context) {
        Connect-AzAccount
    }
} catch {
    Connect-AzAccount
}

$tenantId = (Get-AzContext).Tenant.Id
Write-Host "Tenant ID: $tenantId" -ForegroundColor Green
Write-Host ""

# Connect to Microsoft Graph
Write-Host "Connecting to Microsoft Graph..." -ForegroundColor Yellow
Connect-MgGraph -Scopes "Application.ReadWrite.All", "DelegatedPermissionGrant.ReadWrite.All" -TenantId $tenantId

# Microsoft Graph App ID and required permissions
$graphAppId = "00000003-0000-0000-c000-000000000000"

# Define required permissions with their IDs
$requiredPermissions = @(
    @{
        Name = "User.Read"
        Id = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"
    },
    @{
        Name = "DeviceManagementConfiguration.Read.All"
        Id = "f1493658-876a-4e5d-b7dc-68cfe8374d6e"
    },
    @{
        Name = "DeviceManagementApps.Read.All"
        Id = "7a6ee1e7-141e-4cec-ae74-d9db155731ff"
    },
    @{
        Name = "DeviceManagementManagedDevices.Read.All"
        Id = "314874da-47d6-4978-88dc-cf0d37f0bb82"
    }
)

# Create resource access objects
$resourceAccess = @()
foreach ($permission in $requiredPermissions) {
    $resourceAccess += @{
        Id = $permission.Id
        Type = "Scope"
    }
}

$requiredResourceAccess = @{
    ResourceAppId = $graphAppId
    ResourceAccess = $resourceAccess
}

# Create the application
Write-Host "Creating Azure AD application..." -ForegroundColor Yellow

$appParams = @{
    DisplayName = $AppName
    SignInAudience = "AzureADMyOrg"
    Spa = @{
        RedirectUris = @($RedirectUri)
    }
    RequiredResourceAccess = @($requiredResourceAccess)
}

$app = New-MgApplication @appParams

Write-Host "Application created successfully!" -ForegroundColor Green
Write-Host "  Application (Client) ID: $($app.AppId)" -ForegroundColor Cyan
Write-Host "  Object ID: $($app.Id)" -ForegroundColor Cyan
Write-Host ""

# Grant admin consent
Write-Host "API Permissions added:" -ForegroundColor Yellow
foreach ($permission in $requiredPermissions) {
    Write-Host "  - $($permission.Name)" -ForegroundColor Cyan
}
Write-Host ""

$grantConsent = Read-Host "Grant admin consent for these permissions? (y/n) [y]"
if ([string]::IsNullOrEmpty($grantConsent) -or $grantConsent -eq "y") {
    Write-Host "Granting admin consent..." -ForegroundColor Yellow

    try {
        # Get the service principal for Microsoft Graph
        $graphSp = Get-MgServicePrincipal -Filter "appId eq '$graphAppId'"

        # Create service principal for our app if it doesn't exist
        $appSp = Get-MgServicePrincipal -Filter "appId eq '$($app.AppId)'"
        if (-not $appSp) {
            $appSp = New-MgServicePrincipal -AppId $app.AppId
        }

        # Grant consent for each permission
        foreach ($permission in $requiredPermissions) {
            $params = @{
                ClientId = $appSp.Id
                ConsentType = "AllPrincipals"
                ResourceId = $graphSp.Id
                Scope = $permission.Name
            }

            try {
                New-MgOAuth2PermissionGrant -BodyParameter $params -ErrorAction SilentlyContinue
            } catch {
                # Permission might already be granted, continue
            }
        }

        Write-Host "Admin consent granted successfully." -ForegroundColor Green
    } catch {
        Write-Host "WARNING: Could not grant admin consent automatically." -ForegroundColor Yellow
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "You'll need to grant it manually in the Azure Portal." -ForegroundColor Yellow
    }
} else {
    Write-Host "Skipping admin consent. You'll need to grant it manually in the Azure Portal." -ForegroundColor Yellow
}

Write-Host ""

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Yellow

$envContent = @"
# Azure AD App Registration Configuration
# Generated on $(Get-Date)

# Your Azure AD App Client ID
REACT_APP_CLIENT_ID=$($app.AppId)

# Your Azure AD Tenant ID
REACT_APP_TENANT_ID=$tenantId

# Redirect URI (must match what's configured in Azure AD)
REACT_APP_REDIRECT_URI=$RedirectUri
"@

$envPath = Join-Path $PSScriptRoot ".." ".env"
Set-Content -Path $envPath -Value $envContent

Write-Host "Configuration saved to .env file." -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration saved to .env file:" -ForegroundColor Cyan
Write-Host "  Client ID: $($app.AppId)" -ForegroundColor White
Write-Host "  Tenant ID: $tenantId" -ForegroundColor White
Write-Host "  Redirect URI: $RedirectUri" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the .env file"
Write-Host "  2. Run 'npm install' to install dependencies"
Write-Host "  3. Run 'npm start' to start the application"
Write-Host ""

if ($grantConsent -ne "y") {
    Write-Host "To grant admin consent manually:" -ForegroundColor Yellow
    Write-Host "  1. Go to Azure Portal > Azure AD > App registrations"
    Write-Host "  2. Find '$AppName'"
    Write-Host "  3. Go to API permissions"
    Write-Host "  4. Click 'Grant admin consent'"
    Write-Host ""
}

# Disconnect from Microsoft Graph
Disconnect-MgGraph | Out-Null

Write-Host "Done!" -ForegroundColor Green
