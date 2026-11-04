---
title: "Resolving GitHub repository reconnection failures in Azure App Service"
author_name: "Akshay Kumar"
toc: true
toc_sticky: true
---

If you disconnected a private GitHub repository from Azure App Service and cannot reconnect it, the issue may be an existing **2048-bit RSA deploy key**.

App Service has deployed an update across all regions so newly generated deploy keys use **3072-bit RSA**. Existing keys remain unchanged to avoid disrupting working integrations. Apps retaining an older key may therefore require a one-time reset before reconnecting.

## What changed?

Starting **October 14, 2026**, GitHub requires newly uploaded RSA SSH keys to be at least **3072 bits**. See GitHub's announcement, [Security improvements for SSH](https://github.blog/changelog/2026-09-22-security-improvements-for-ssh/).

An existing 2048-bit key already registered with GitHub is not invalidated by this upload requirement. However, registering that key again can fail with:

```text
GitHub AddSSHKey: key is too short.
GitHub recommends using ssh-keygen to generate a RSA key of at least 3072 bits.
```

This guidance applies to **Kudu-based private GitHub repository integration**, where App Service fetches repository content using an SSH deploy key. It does not apply to GitHub Actions checkout and deployment.

## Why can reconnecting fail?

During integration, App Service registers a public deploy key with GitHub and stores the corresponding private key in the app's Kudu environment. Git uses this identity to fetch repository content during deployment.

Disconnecting the repository removes its deploy-key registration, but can leave the local key pair in Kudu. When you reconnect, App Service may attempt to register the same 2048-bit public key. GitHub treats this as a new upload and rejects it.

The App Service update generates larger keys when a key pair needs to be created; it does **not** automatically replace existing keys. Normal deployment sync also does not generate or rotate the key pair.

## How to resolve it

For an integration failing with the **"key is too short"** error, remove the affected app's persisted key pair and reconnect the repository.

> **Important:** Deleting the key pair temporarily prevents SSH access until reconnection succeeds. Before proceeding, check whether custom deployment scripts or private submodules also use this SSH identity; those dependencies may need the replacement public key registered separately.

### 1. Disconnect the repository

In the Azure portal, open the affected app, navigate to **Deployment Center**, and disconnect the GitHub repository if it is still configured.

### 2. Delete the persisted key pair

Run the following in **PowerShell with Azure CLI installed**. Replace the placeholders with your app's details. Sign in with an account that has permission to access the app's Kudu endpoint.

```powershell
az login

$subscriptionId = "<subscription-id>"
$resourceGroup = "<resource-group>"
$appName = "<app-name>"

$scmHost = az webapp show `
  --subscription $subscriptionId `
  --resource-group $resourceGroup `
  --name $appName `
  --query "enabledHostNames[?contains(@, '.scm.')]|[0]" `
  --output tsv

if ($LASTEXITCODE -ne 0 -or -not $scmHost) {
    throw "Could not determine the app's SCM hostname."
}

az rest `
  --subscription $subscriptionId `
  --method delete `
  --url "https://$scmHost/api/sshkey" `
  --resource "https://management.azure.com/"

if ($LASTEXITCODE -ne 0) {
    throw "SSH key deletion failed. Resolve the error before reconnecting."
}
```

This calls Kudu's `DELETE /api/sshkey` endpoint to remove the local private/public key pair. It does not delete your repository or application content.

The example targets the **production slot**. For a deployment slot, open that slot's Deployment Center in step 1 and add `--slot "<slot-name>"` to the `az webapp show` command so the reset targets that slot's SCM endpoint. Reconnect and verify deployment on the same slot.

**Do not delete the entire `.ssh` directory.** Preserve files such as `known_hosts` and SSH configuration. Deleting only the deploy key in GitHub is also insufficient: the old local pair must be removed so App Service can generate a replacement.

### 3. Reconnect the repository

Return to **Deployment Center** and reconnect the GitHub repository and branch using the Kudu-based integration.

With the old local pair removed, App Service generates a new **3072-bit RSA key pair** and registers its public key with GitHub. Triggering deployment sync alone is not a substitute for this integration step.

### 4. Verify deployment

Trigger a sync or push a commit to the configured branch. Check Deployment Center logs for a successful repository fetch and deployment.

If reconnection still reports that the key is too short, contact Azure Support rather than repeatedly deleting keys.

## Do working integrations need a reset?

**No.** Do not delete keys from a working integration simply because its RSA key is 2048 bits. GitHub's minimum-size upload requirement applies when a key is newly registered.

Use this reset for the specific reconnection failure described above. Integrations that generate a new key pair now receive a 3072-bit key, and existing working integrations do not require a proactive reset for this upload requirement.
 