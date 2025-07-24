@echo off
chcp 65001 >nul
title 通讯录管理系统 - 停止服务

echo 🛑 正在停止通讯录管理系统服务...
echo ================================

REM 停止Python进程（后端服务）
echo 🔄 停止后端服务...
taskkill /f /im python.exe 2>nul
if %errorlevel% == 0 (
    echo ✅ 后端服务已停止
) else (
    echo ℹ️ 未找到运行的后端服务
)

REM 停止Node.js进程（前端服务）
echo 🔄 停止前端服务...
taskkill /f /im node.exe 2>nul
if %errorlevel% == 0 (
    echo ✅ 前端服务已停止
) else (
    echo ℹ️ 未找到运行的前端服务
)

echo.
echo ✅ 所有服务已停止
echo ================================
echo 按任意键关闭此窗口...
pause >nul
