#!/bin/bash

# 通讯录项目启动脚本 (Linux/macOS)
# 作者: AI Assistant
# 功能: 自动安装依赖并启动前后端服务（普通用户一键启动）

echo "🚀 欢迎使用通讯录管理系统"
echo "================================"

# 获取脚本所在目录的上级目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# 检查是否安装了 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3，请先安装 Python 3.7+"
    exit 1
fi

# 检查是否安装了 python3-venv
if ! python3 -c "import venv" 2>/dev/null; then
    echo "❌ 错误: 缺少 python3-venv 包"
    echo "请手动安装: sudo apt install python3-venv python3-pip"
    echo "或者使用开发者模式（conda环境）"
    exit 1
fi

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

# 检查是否安装了 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

echo "✅ 环境检查通过"

# 创建Python虚拟环境（如果不存在）
if [ ! -d "venv" ]; then
    echo "📦 创建Python虚拟环境..."
    python3 -m venv venv
    if [ ! -d "venv" ]; then
        echo "❌ 虚拟环境创建失败"
        echo "可能需要安装: sudo apt install python3-venv"
        exit 1
    fi
fi

# 激活虚拟环境
echo "🔄 激活Python虚拟环境..."
source venv/bin/activate

# 升级pip
echo "📦 升级pip..."
pip install --upgrade pip

# 安装Python依赖
echo "📦 安装Python依赖..."
pip install -r requirements.txt

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
npm install
cd ..

# 启动后端服务（后台运行）
echo "🚀 启动后端服务..."
cd backend
python3 main.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 3

# 启动前端服务
echo "🚀 启动前端服务..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 服务启动成功！"
echo "================================"
echo "📱 前端地址: http://localhost:5173"
echo "🔧 后端API: http://localhost:8000"
echo "📖 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获中断信号并清理进程
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ 所有服务已停止"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 等待用户中断
while true; do
    sleep 1
done
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT

# 保持脚本运行
wait
