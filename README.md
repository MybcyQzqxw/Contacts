# 通讯录项目 (Contacts)

一个功能完整的通讯录应用，支持联系人的增删改查操作。

## 📁 项目结构

```bash
Contacts/
├── .vscode/           # VS Code 配置文件
├── frontend/          # Vue3 + Tailwind CSS 前端
│   ├── src/
│   │   ├── api/       # API 服务
│   │   ├── components/# Vue 组件
│   │   ├── views/     # 页面视图
│   │   ├── stores/    # Pinia 状态管理
│   │   ├── router/    # 路由配置
│   │   ├── App.vue    # 根组件
│   │   ├── main.js    # 应用入口
│   │   └── style.css  # 全局样式
│   ├── public/        # 静态资源
│   ├── dist/          # 构建输出目录
│   ├── package.json   # 前端依赖
│   ├── vite.config.js # Vite 配置
│   ├── tailwind.config.js # Tailwind CSS 配置
│   ├── postcss.config.js  # PostCSS 配置
│   ├── .eslintrc.js   # ESLint 配置
│   ├── .prettierrc    # Prettier 配置
│   └── Dockerfile     # 前端容器化配置
├── backend/           # Python FastAPI 后端
│   ├── app/
│   │   ├── models/    # SQLAlchemy 数据模型
│   │   ├── schemas/   # Pydantic 数据验证模式
│   │   ├── routers/   # FastAPI 路由
│   │   ├── database/  # 数据库配置
│   │   └── __init__.py
│   ├── main.py        # FastAPI 应用入口
│   └── Dockerfile     # 后端容器化配置
├── database/          # SQLite 数据库文件
├── scripts/           # 启动脚本
│   ├── start.bat      # Windows 启动脚本
│   ├── start.sh       # Linux/macOS 启动脚本
│   └── stop.bat       # Windows 停止脚本
├── .git/              # Git 版本控制
├── .gitignore         # Git 忽略文件
├── README.md          # 项目说明文档
├── LICENSE            # 项目许可证
├── requirements.txt   # Python 依赖
└── docker-compose.yml # Docker 部署配置
```

## 🛠️ 技术栈

- **前端**: Vue 3 + Vite + Tailwind CSS + Pinia + Vue Router
- **后端**: Python + FastAPI + SQLAlchemy + Uvicorn
- **数据库**: SQLite
- **开发工具**: Vite, ESLint, Prettier

## ⭐ 功能特性

- ✅ 添加联系人
- ✅ 查看联系人
- ✅ 编辑联系人
- ✅ 删除联系人
- ✅ 搜索联系人
- ✅ 收藏联系人
- ✅ 联系人首字母排序
- ✅ 支持实时统计数据
- ✅ 支持联系历史记录
- ✅ 响应式前端布局
- ✅ RESTful API

## 🚀 用户快速启动

### 环境要求

- Node.js 16+
- npm

### Windows 系统

```bash
# 双击运行或在命令行执行
scripts/start.bat

# 停止服务
scripts/stop.bat
```

### Linux/macOS 系统

```bash
# 先安装系统依赖（仅首次需要）
sudo apt install python3-venv python3-pip

# 给脚本执行权限
chmod +x scripts/start.sh

# 启动服务
./scripts/start.sh

# 停止服务：按 Ctrl+C
```

## 🔧 开发者调试指南

### 0. 环境要求

- conda
- Node.js 16+
- npm

### 1. 创建并激活 Conda 环境

```bash
# 创建虚拟环境
conda create --name contacts python=3.12 -y

# 激活环境
conda activate contacts
```

### 2. 安装后端依赖

```bash
pip install -r requirements.txt
```

### 3. 启动后端服务

```bash
cd backend
python main.py
```

### 4. 安装前端依赖（新开一个终端）

```bash
# 激活环境
conda activate contacts

cd frontend
npm install
```

### 5. 启动前端开发服务器

```bash
npm run dev
```

### 6. 数据库初始化

后端服务启动时会自动创建数据库表，无需手动操作。

## 🌐 访问地址

- **前端应用**: <http://localhost:5173>
- **后端API**: <http://localhost:8000>
- **API文档**: <http://localhost:8000/docs>
- **API交互**: <http://localhost:8000/redoc>

## ✨ 项目特点

- 🚀 **开箱即用**: 支持 Windows 和 Linux 系统一键启动
- 📱 **响应式设计**: 适配桌面和移动设备
- 🔧 **代码规范**: ESLint + Prettier 代码格式化
- 📦 **依赖管理**: 完整的前后端依赖配置
- 🐳 **容器化**: 支持 Docker 部署
- 🔒 **数据验证**: Pydantic 数据验证和序列化

## 📚 API接口说明

### 联系人管理

| 方法 | 路径 | 说明 | 请求体/参数 |
|------|------|------|--------|
| GET | `/contacts/stats` | 获取统计信息（总数、收藏数）| - |
| GET | `/contacts` | 获取所有联系人 | `?favorites_only=true` (可选) |
| POST | `/contacts` | 添加联系人 | `{name, phone, email?, address?, is_favorite?}` |
| GET | `/contacts/{id}` | 获取指定联系人详情 | - |
| PUT | `/contacts/{id}` | 完整更新联系人信息 | `{name?, phone?, email?, address?, is_favorite?}` |
| PATCH | `/contacts/{id}/favorite` | 切换收藏状态 | - |
| DELETE | `/contacts/{id}` | 删除联系人 | - |
| GET | `/contacts/search/{query}` | 按姓名或电话搜索联系人 | query 参数 |
| POST | `/contacts/{id}/call` | 记录通话历史 | - |
| POST | `/contacts/{id}/email` | 记录邮箱联系历史 | - |
| DELETE | `/contacts/{id}/call` | 撤销最后一次通话记录 | - |
| DELETE | `/contacts/{id}/history/{index}` | 删除指定索引的联系历史记录 | index 参数 |

### 数据模型

**Contact 表结构**：

- `id` (Integer): 主键，自动递增，建立索引
- `name` (String, 100): 姓名，必填，最大100字符，建立索引
- `phone` (String, 20): 电话号码，必填，最大20字符
- `email` (String, 100): 邮箱地址，可选，最大100字符
- `address` (String, 200): 联系地址，可选，最大200字符
- `is_favorite` (Boolean): 是否收藏，默认false，建立索引
- `contact_history` (JSON): 联系历史记录，默认空数组，存储通话和邮件记录
- `created_at` (DateTime): 创建时间，自动生成，带时区
- `updated_at` (DateTime): 更新时间，自动更新，带时区

**contact_history JSON 结构**：

```json
[
  {
    "timestamp": "2025-07-25T10:30:00.123456",
    "action": "通话"
  },
  {
    "timestamp": "2025-07-25T14:15:30.654321", 
    "action": "邮箱"
  }
]
```

## 📄 许可证

MIT License
