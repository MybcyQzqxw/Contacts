# 使用官方 Python 镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY ../requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建数据库目录
RUN mkdir -p /app/database

# 暴露端口
EXPOSE 8000

# 设置环境变量
ENV PYTHONPATH=/app

# 启动命令
CMD ["python", "main.py"]
