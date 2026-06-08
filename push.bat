@echo off
cd /d C:\Users\tamar\studio-flow
del /f .git\index.lock 2>nul
del /f .git\HEAD.lock 2>nul
del /f ".git\refs\heads\main.lock" 2>nul
git add -A
git commit -m "fix: Instagram connect button always visible"
git push origin main
echo Done!
