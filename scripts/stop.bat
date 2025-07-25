@echo off
echo Contacts System Stopper
echo ================================

REM Stop processes by window title
echo Stopping backend service...
taskkill /fi "WindowTitle eq Backend Service*" /f /t 2>nul
if %errorlevel% == 0 (
    echo Backend service window closed
) else (
    echo Backend service window not found, trying to stop Python processes...
    wmic process where "name='python.exe' and commandline like '%%main.py%%'" delete 2>nul
    if %errorlevel% == 0 (
        echo Backend Python process stopped
    ) else (
        echo No Python process running main.py found
    )
)

echo Stopping frontend service...
taskkill /fi "WindowTitle eq Frontend Service*" /f /t 2>nul
if %errorlevel% == 0 (
    echo Frontend service window closed
) else (
    echo Frontend service window not found, trying to stop Node.js processes...
    wmic process where "name='node.exe' and commandline like '%%vite%%'" delete 2>nul
    if %errorlevel% == 0 (
        echo Frontend Node.js process stopped
    ) else (
        echo No Node.js process running Vite found
    )
)

REM Clean up port usage
echo Checking port usage...

REM Check port 8000 usage
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000.*LISTENING" 2^>nul') do (
    echo Found process occupying port 8000: %%a
    taskkill /f /pid %%a 2>nul
    if not errorlevel 1 (
        echo Stopped process occupying port 8000: %%a
    )
)

REM Check port 5173 usage
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173.*LISTENING" 2^>nul') do (
    echo Found process occupying port 5173: %%a
    taskkill /f /pid %%a 2>nul
    if not errorlevel 1 (
        echo Stopped process occupying port 5173: %%a
    )
)

echo.
echo All services stopped
echo ================================
echo Press any key to close this window...
pause >nul
