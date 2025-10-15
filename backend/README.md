# 俄语学习网站 - 后端API服务

## 🎯 功能

提供跨设备数据同步的后端API服务，支持：
- 用户账号管理
- 注册申请审批
- 设备登录限制
- 数据持久化

## 🚀 快速启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动服务
```bash
npm start
```

服务将在 http://localhost:3001 启动

## 📖 使用说明

### 默认账号
- 管理员：admin / admin000
- 测试用户：user1 / password123

### API地址
- 本地开发：http://localhost:3001/api
- 生产环境：配置你的服务器地址

## 🔧 配置

所有配置在 `server.js` 顶部：
- `PORT`: 服务器端口（默认3001）
- CORS允许所有来源（生产环境需限制）

## 💾 数据存储

数据保存在 `data/` 目录：
- `users.json` - 用户账号
- `requests.json` - 注册申请
- `devices.json` - 设备登录记录

## 📝 注意事项

**开发环境**：
- 适合本地测试
- 数据保存在本地JSON文件

**生产环境部署**：
- 建议使用PM2保持运行
- 配置Nginx反向代理
- 添加HTTPS证书
- 考虑使用MongoDB替代JSON文件

详细说明请查看：`BACKEND-API-SETUP.md`

