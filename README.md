# 通讯录项目 (Contacts)

一个功能完整的通讯录应用，支持联系人的增删改查操作。

## 项目结构

```
Contacts/
├── frontend/          # Vue3 + Tailwind CSS 前端
├── backend/           # Python FastAPI 后端
├── database/          # SQLite 数据库文件
├── scripts/           # 启动脚本
├── README.md          # 项目说明
├── requirements.txt   # Python 依赖
└── docker-compose.yml # Docker 部署配置
```

## 技术栈

- **前端**: Vue 3 + Vite + Tailwind CSS
- **后端**: Python + FastAPI + SQLAlchemy
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

## 快速启动

### Windows 系统
```bash
# 安装依赖并启动
scripts/start.bat
```

### Linux/macOS 系统
```bash
# 给脚本执行权限
chmod +x scripts/start.sh
# 安装依赖并启动
./scripts/start.sh
```

## 项目调试

### 1. 创建虚拟环境

```bash
conda create --name contacts python=3.12 -y
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

### 4. 安装前端依赖
```bash
cd frontend
npm install
```

### 5. 启动前端开发服务器
```bash
npm run dev
```

## 访问地址

- 前端应用: http://localhost:5173
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 项目特点

- 🚀 开箱即用，支持Windows和Linux系统
- 📱 响应式设计，适配各种设备
- 🔧 代码结构清晰，易于维护和扩展
- 📦 包含完整的依赖管理
- 🐳 支持Docker部署

## 开发说明

### 后端API接口

- `GET /api/contacts` - 获取所有联系人
- `POST /api/contacts` - 添加联系人
- `GET /api/contacts/{id}` - 获取指定联系人
- `PUT /api/contacts/{id}` - 更新联系人
- `DELETE /api/contacts/{id}` - 删除联系人

### 数据库模型

联系人表包含以下字段：
- id (主键)
- name (姓名)
- phone (电话)
- email (邮箱)
- address (地址)
- created_at (创建时间)
- updated_at (更新时间)

## 许可证

MIT License
