# Azure Functions Flex Consumption Migration Notes

This project is configured for .NET 10 isolated worker and CI deploy with remote build, which is required for Flex Consumption deployments.

## Package/runtime baseline for .NET 10
- `TargetFramework`: `net10.0`
- `Microsoft.Azure.Functions.Worker`: `2.51.0`
- `Microsoft.Azure.Functions.Worker.Sdk`: `2.0.7`
- `Microsoft.Azure.Functions.Worker.Extensions.Http`: `3.3.0`
- `Microsoft.Azure.Functions.Worker.ApplicationInsights`: `2.50.0`

## CI/CD updates already applied
- GitHub Actions uses `DOTNET_VERSION: 10.0.x`
- Deployment uses `remote-build: true`
- Slot deployment removed from the Functions action (Flex plans do not support deployment slots)

## Required Azure migration actions (outside repo)
Use the Microsoft guide for exact steps:
https://learn.microsoft.com/en-us/azure/azure-functions/migration/migrate-plan-consumption-to-flex

Typical high-level sequence:
1. Create a new Function App on Flex Consumption (Linux).
2. Configure managed identity and storage access required by Flex.
3. Copy/validate app settings from the old app.
4. Update CI secrets/variables to deploy to the new Flex app.
5. Run smoke tests against the new app.
6. Cut over traffic (DNS/front door/CDN), then decommission old app.

## App settings to double-check after migration
- `FUNCTIONS_EXTENSION_VERSION=~4`
- `FUNCTIONS_WORKER_RUNTIME=dotnet-isolated`
- `WEBSITE_RUN_FROM_PACKAGE` should not be used for Flex remote build deployments
- Existing project settings:
  - `AllowedEmails`
  - `ProductsDir`
  - `ProductsStorePath`
  - `BlobContainer`
  - `SendGridApiKey`
  - `SendGridTemplateId`
  - `SenderIdentityAddress`
  - `SenderIdentityName`
  - `ContactAddress`
