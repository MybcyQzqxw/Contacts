@echo off
chcp 65001 >nul
title 通讯录管理系统启动器

echo 🚀 欢迎使用通讯录管理系统
echo ================================

REM 切换到项目根目录
cd /d "%~dp0.."

REM 检查是否安装了 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python，请先安装 Python 3.7+
    pause
    exit /b 1
)

REM 检查是否安装了 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 16+
    pause
    exit /b 1
)

REM 检查是否安装了 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 npm，请先安装 npm
    pause
    exit /b 1
)

echo ✅ 环境检查通过

REM 创建Python虚拟环境（如果不存在）
if not exist "venv" (
    echo 📦 创建Python虚拟环境...
    python -m venv venv
)

REM 激活虚拟环境
echo 🔄 激活Python虚拟环境...
call venv\Scripts\activate.bat

REM 安装Python依赖
echo 📦 安装Python依赖...
pip install -r requirements.txt

REM 安装前端依赖
echo 📦 安装前端依赖...
cd frontend
npm install
cd ..

REM 启动后端服务（后台运行）
echo 🚀 启动后端服务...
cd backend
start "后端服务" cmd /c "call ..\venv\Scripts\activate.bat && python main.py"
cd ..

REM 等待后端启动
echo ⏳ 等待后端服务启动...
timeout /t 5 /nobreak >nul

REM 启动前端服务
echo 🚀 启动前端服务...
cd frontend
start "前端服务" cmd /c "npm run dev"
cd ..

echo.
echo ✅ 服务启动成功！
echo ================================
echo 📱 前端地址: http://localhost:5173
echo 🔧 后端API: http://localhost:8000
echo 📖 API文档: http://localhost:8000/docs
echo.
echo 💡 提示:
echo - 两个服务窗口已在后台启动
echo - 关闭此窗口不会影响服务运行
echo - 要停止服务，请运行 scripts\stop.bat
echo - 或手动关闭 "后端服务" 和 "前端服务" 窗口
echo.
echo 按任意键关闭此窗口...
pause >nul
