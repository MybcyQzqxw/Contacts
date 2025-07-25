@echo off
chcp 65001 >nul
title 通讯录管理系统 - 停止服务

echo 🛑 正在停止通讯录管理系统服务...
echo ================================

REM 停止指定窗口标题的进程
echo 🔄 停止后端服务...
taskkill /fi "WindowTitle eq 后端服务*" /f /t 2>nul
if %errorlevel% == 0 (
    echo ✅ 后端服务窗口已关闭
) else (
    echo ℹ️ 未找到运行的后端服务窗口，尝试停止Python进程...
    REM 更精确地停止Python进程（只停止运行main.py的进程）
    wmic process where "name='python.exe' and commandline like '%%main.py%%'" delete 2>nul
    if %errorlevel% == 0 (
        echo ✅ 后端Python进程已停止
    ) else (
        echo ℹ️ 未找到运行main.py的Python进程
    )
)

echo 🔄 停止前端服务...
taskkill /fi "WindowTitle eq 前端服务*" /f /t 2>nul
if %errorlevel% == 0 (
    echo ✅ 前端服务窗口已关闭
) else (
    echo ℹ️ 未找到运行的前端服务窗口，尝试停止Node.js进程...
    REM 更精确地停止Node.js进程（只停止Vite开发服务器）
    wmic process where "name='node.exe' and commandline like '%%vite%%'" delete 2>nul
    if %errorlevel% == 0 (
        echo ✅ 前端Node.js进程已停止
    ) else (
        echo ℹ️ 未找到运行Vite的Node.js进程
    )
)

REM 额外清理：停止可能残留的端口占用
echo 🔄 检查端口占用情况...

REM 检查8000端口占用
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000.*LISTENING" 2^>nul') do (
    echo 发现占用8000端口的进程: %%a
    taskkill /f /pid %%a 2>nul
    if not errorlevel 1 (
        echo ✅ 已停止占用8000端口的进程: %%a
    )
)

REM 检查5173端口占用
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173.*LISTENING" 2^>nul') do (
    echo 发现占用5173端口的进程: %%a
    taskkill /f /pid %%a 2>nul
    if not errorlevel 1 (
        echo ✅ 已停止占用5173端口的进程: %%a
    )
)

echo.
echo ✅ 所有服务已停止
echo ================================
echo 按任意键关闭此窗口...
pause >nul
echo ================================
echo 按任意键关闭此窗口...
pause >nul
