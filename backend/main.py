from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.routers import contacts

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="通讯录 API",
    description="一个简单的通讯录管理系统",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vue开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(contacts.router, prefix="/api", tags=["contacts"])

@app.get("/")
async def root():
    return {"message": "欢迎使用通讯录 API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
