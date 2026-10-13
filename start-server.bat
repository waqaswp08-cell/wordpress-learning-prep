@echo off
echo ========================================================
echo  WP Mastery - WordPress Learning & Preparation Portal
echo ========================================================
echo.
echo Starting local preview server on http://localhost:8080...
start http://localhost:8080
py -m http.server 8080
pause
