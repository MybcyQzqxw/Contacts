@echo off
echo Contacts System Launcher
echo ================================

REM Go to project root
cd /d "%~dp0.."
echo Current directory: %CD%

REM Check environment
echo Checking environment...
python --version
if errorlevel 1 (
    echo Error: Python not found
    pause
    exit /b 1
)

node --version
if errorlevel 1 (
    echo Error: Node.js not found
    pause
    exit /b 1
)

REM Create virtual environment if not exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Failed to activate virtual environment
    pause
    exit /b 1
)

REM Install backend dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install --no-audit --silent
echo Frontend dependencies installed, errorlevel: %errorlevel%
cd ..
echo Back to project root: %CD%

REM Start backend service
echo Starting backend service...
cd backend
echo Current directory: %CD%
start "Backend Service" cmd /k "cd /d %CD% && call ..\venv\Scripts\activate.bat && python main.py"
cd ..
echo Back to project root: %CD%

REM Wait for backend to start
echo Waiting for backend to start...
ping localhost -n 4 >nul

REM Start frontend service
echo Starting frontend service...
cd frontend
echo Current directory: %CD%
start "Frontend Service" cmd /k "cd /d %CD% && npm run dev"
cd ..
echo Back to project root: %CD%

echo.
echo Launch completed!
echo ================================
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Tips:
echo - Two service windows have been started in background
echo - Closing this window will not affect running services
echo - To stop services, run scripts\stop.bat
echo - Or manually close "Backend Service" and "Frontend Service" windows
echo.
echo Press any key to close this window...
pause >nul
