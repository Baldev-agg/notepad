@echo off
cd /d "c:\Users\Baldev Aggarwal\notepad-ui"
echo Fetching from origin...
git fetch origin main
echo.
echo Resetting to origin/main...
git reset --hard origin/main
echo.
echo Current status:
git status
echo.
echo Committing any new changes...
git add -A
git commit -m "Clean version - remove unwanted files" --allow-empty 2>nul
echo.
echo Pushing to GitHub...
git push origin main -f
echo.
echo Checking final log:
git log --oneline -3
pause
