@echo off
echo 通讯录管理系统启动器
echo ================================

REM 进入项目根目录
cd /d "%~dp0.."
echo 当前目录: %CD%

REM 检查环境
echo 检查环境...
python --version
if errorlevel 1 (
    echo 错误: 未找到Python，请先安装Python
    pause
    exit /b 1
)

node --version
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 创建虚拟环境（如果不存在）
if not exist venv (
    echo 创建虚拟环境...
    python -m venv venv
    if errorlevel 1 (
        echo 创建虚拟环境失败
        pause
        exit /b 1
    )
)

REM 激活虚拟环境
echo 激活虚拟环境...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo 激活虚拟环境失败
    pause
    exit /b 1
)

REM 安装后端依赖
echo 安装Python依赖...
pip install -r requirements.txt
if errorlevel 1 (
    echo 安装Python依赖失败
    pause
    exit /b 1
)

REM 安装前端依赖
echo 安装前端依赖...
cd frontend
npm install
if errorlevel 1 (
    echo 安装前端依赖失败
    cd ..
    pause
    exit /b 1
)
cd ..

REM 启动后端服务
echo 启动后端服务...
cd backend
start "后端服务" cmd /k "cd /d %CD% && call ..\venv\Scripts\activate.bat && python main.py"
cd ..

REM 等待后端启动
echo 等待后端启动...
ping localhost -n 4 >nul

REM 启动前端服务
echo 启动前端服务...
cd frontend
start "前端服务" cmd /k "cd /d %CD% && npm run dev"
cd ..

echo.
echo 启动完成！
echo ================================
echo 前端地址: http://localhost:5173
echo 后端API: http://localhost:8000
echo API文档: http://localhost:8000/docs
echo.
echo 提示:
echo - 两个服务窗口已在后台启动
echo - 关闭此窗口不会影响服务运行
echo - 要停止服务，请运行 scripts\stop.bat
echo - 或手动关闭 "后端服务" 和 "前端服务" 窗口
echo.
echo 按任意键关闭此窗口...
pause >nul
