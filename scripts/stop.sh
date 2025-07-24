#!/bin/bash

# 停止通讯录项目服务脚本

echo "🛑 正在停止通讯录服务..."

# 停止 Python 进程（FastAPI）
echo "🔄 停止后端服务..."
pkill -f "python.*main.py" 2>/dev/null || echo "后端服务未运行"

# 停止 Node.js 进程（Vite）
echo "🔄 停止前端服务..."
pkill -f "vite" 2>/dev/null || echo "前端服务未运行"

# 停止可能的 npm run dev 进程
pkill -f "npm.*run.*dev" 2>/dev/null

echo "✅ 所有服务已停止"
