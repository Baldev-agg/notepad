#!/usr/bin/env pwsh

# Cleanup and push to GitHub

cd "c:\Users\Baldev Aggarwal\notepad-ui"

# Fetch latest from remote
Write-Host "Fetching from remote..."
git fetch origin main

# Reset to clean state
Write-Host "Resetting to clean state..."
git reset --hard origin/main

# Check status
Write-Host "Current status:"
git status

# Add all current files
Write-Host "Adding files..."
git add -A

# Check what we're committing
Write-Host "Files to commit:"
git diff --cached --name-only

# Commit if there are changes
$changes = git diff --cached --name-only | Measure-Object -Line
if ($changes.Lines -gt 0) {
    Write-Host "Committing changes..."
    git commit -m "Final clean version - remove unwanted files"
} else {
    Write-Host "No changes to commit"
}

# Push to GitHub
Write-Host "Pushing to GitHub..."
git push origin main -f

Write-Host "Done!"
git log --oneline -3
