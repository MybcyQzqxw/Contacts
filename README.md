# 通讯录项目 (Contacts)

一个功能完整的通讯录应用，支持联系人的增删改查操作。

## 项目结构

```
Contacts/
├── frontend/          # Vue3 + Tailwind CSS 前端
│   ├── src/
│   │   ├── api/       # API 服务
│   │   ├── components/# Vue 组件
│   │   ├── views/     # 页面视图
│   │   ├── stores/    # Pinia 状态管理
│   │   └── router/    # 路由配置
│   ├── package.json   # 前端依赖
│   └── vite.config.js # Vite 配置
├── backend/           # Python FastAPI 后端
│   ├── app/
│   │   ├── models/    # 数据模型
│   │   ├── schemas/   # 数据验证
│   │   ├── routers/   # API 路由
│   │   └── database/  # 数据库配置
│   └── main.py        # 应用入口
├── database/          # SQLite 数据库文件
├── scripts/           # 启动脚本
│   ├── start.bat      # Windows 启动脚本
│   ├── start.sh       # Linux/macOS 启动脚本
│   └── stop.bat       # Windows 停止脚本
├── README.md          # 项目说明
├── requirements.txt   # Python 依赖
└── docker-compose.yml # Docker 部署配置
```

## 技术栈

- **前端**: Vue 3 + Vite + Tailwind CSS + Pinia + Vue Router
- **后端**: Python + FastAPI + SQLAlchemy + Uvicorn
- **数据库**: SQLite
- **开发工具**: Vite, ESLint, Prettier

## 功能特性

- ✅ 添加联系人
- ✅ 查看联系人列表
- ✅ 编辑联系人信息
- ✅ 删除联系人
- ✅ 搜索联系人
- ✅ 响应式设计
- ✅ RESTful API
- ✅ 数据验证
- ✅ 错误处理
- ✅ 跨域支持

## 快速启动

### � 系统要求

#### 基础环境
- Python 3.7+ 
- Node.js 16+
- npm 或 yarn

#### Linux/Ubuntu 额外依赖
```bash
# 如果使用一键启动脚本，需要先安装
sudo apt install python3-venv python3-pip
```

### �🚀 一键启动（推荐）

#### Windows 系统
```bash
# 双击运行或在命令行执行
scripts/start.bat

# 停止服务
scripts/stop.bat
```

#### Linux/macOS 系统
```bash
# 先安装系统依赖（仅首次需要）
sudo apt install python3-venv python3-pip

# 给脚本执行权限
chmod +x scripts/start.sh

# 启动服务
./scripts/start.sh

# 停止服务：按 Ctrl+C
```

## 开发者调试指南

### 环境要求

- Python 3.7+ 
- Node.js 16+
- npm 或 yarn

### 1. 创建并激活 Conda 环境

```bash
# 创建虚拟环境
conda create --name contacts python=3.12 -y

# 激活环境
conda activate contacts
```

### 2. 安装后端依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt
```

### 3. 安装前端依赖
```bash
cd frontend
npm install
```

### 4. 启动后端服务（开发模式）
```bash
cd backend
python main.py
```

### 5. 启动前端开发服务器
```bash
cd frontend
npm run dev
```

### 6. 数据库初始化

后端服务启动时会自动创建数据库表，无需手动操作。

## 访问地址

- **前端应用**: http://localhost:5173
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs
- **API交互**: http://localhost:8000/redoc

## 项目特点

- 🚀 **开箱即用**: 支持Windows和Linux系统一键启动
- 📱 **响应式设计**: 适配桌面和移动设备
- 🔧 **代码规范**: ESLint + Prettier 代码格式化
- 📦 **依赖管理**: 完整的前后端依赖配置
- 🐳 **容器化**: 支持Docker部署
- 🔒 **数据验证**: Pydantic 数据验证和序列化
- 🌐 **跨域支持**: 完整的CORS配置
- 📊 **API文档**: 自动生成的Swagger文档

## API接口说明

### 联系人管理

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| GET | `/api/contacts` | 获取所有联系人 | - |
| POST | `/api/contacts` | 添加联系人 | `{name, phone, email?, address?}` |
| GET | `/api/contacts/{id}` | 获取指定联系人 | - |
| PUT | `/api/contacts/{id}` | 更新联系人 | `{name?, phone?, email?, address?}` |
| DELETE | `/api/contacts/{id}` | 删除联系人 | - |
| GET | `/api/contacts/search/{query}` | 搜索联系人 | - |

### 数据模型

联系人表包含以下字段：
- `id` (Integer): 主键，自动递增
- `name` (String): 姓名，必填，最大100字符
- `phone` (String): 电话，必填，最大20字符
- `email` (String): 邮箱，可选，最大100字符
- `address` (String): 地址，可选，最大200字符
- `created_at` (DateTime): 创建时间，自动生成
- `updated_at` (DateTime): 更新时间，自动更新

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -ano | findstr :8000
   netstat -ano | findstr :5173
   
   # 终止占用进程
   taskkill /PID <进程ID> /F
   ```

2. **Python依赖安装失败**
   ```bash
   # 升级pip
   python -m pip install --upgrade pip
   
   # 清理缓存
   pip cache purge
   ```

3. **Node.js依赖安装失败**
   ```bash
   # 清理npm缓存
   npm cache clean --force
   
   # 删除node_modules重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **数据库连接错误**
   - 检查 `database/` 目录是否存在
   - 确保有写入权限
   - 重启后端服务

### 开发环境重置

```bash
# 停止所有服务
scripts/stop.bat  # Windows
# 或按 Ctrl+C    # Linux/macOS

# 清理Python环境
conda deactivate
conda remove --name contacts --all -y

# 清理前端依赖
cd frontend
rm -rf node_modules package-lock.json

# 重新开始设置
conda create --name contacts python=3.12 -y
conda activate contacts
```

## 许可证

MIT License
