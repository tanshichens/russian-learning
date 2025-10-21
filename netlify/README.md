# Netlify Functions 说明

## 📁 目录结构

```
netlify/
├── functions/              # Netlify Functions 目录
│   ├── models/            # MongoDB 数据模型
│   │   ├── User.js        # 用户模型
│   │   ├── RegistrationRequest.js  # 注册申请模型
│   │   └── Device.js      # 设备模型
│   ├── utils/             # 工具函数
│   │   ├── db.js          # 数据库连接
│   │   └── response.js    # 响应格式化
│   ├── users-get.js       # 获取用户列表
│   ├── users-create.js    # 创建用户
│   ├── users-update.js    # 更新用户
│   ├── users-delete.js    # 删除用户
│   ├── auth-validate.js   # 验证用户凭证
│   ├── registration-get.js       # 获取注册申请
│   ├── registration-create.js    # 提交注册申请
│   ├── registration-approve.js   # 批准申请
│   ├── registration-reject.js    # 拒绝申请
│   ├── registration-delete.js    # 删除申请
│   ├── devices-login.js   # 设备登录
│   ├── devices-get.js     # 获取设备列表
│   ├── devices-logout.js  # 设备登出
│   ├── devices-kick.js    # 踢出设备
│   ├── health.js          # 健康检查
│   ├── db-status.js       # 数据库状态
│   ├── init-admin.js      # 初始化管理员
│   └── package.json       # 依赖配置
└── README.md              # 本文件
```

## 🔧 工作原理

### 1. Netlify Functions 是什么？

Netlify Functions 是基于 AWS Lambda 的 serverless 函数，可以处理后端逻辑。

**特点：**
- ✅ 自动扩展
- ✅ 按需付费
- ✅ 零运维
- ✅ 全球分布

### 2. 如何工作？

```
用户请求 /api/users
    ↓
Netlify 路由重定向 (netlify.toml)
    ↓
调用对应的 Function (users-get.js)
    ↓
连接 MongoDB (utils/db.js)
    ↓
返回 JSON 响应 (utils/response.js)
```

### 3. 路由映射

| 前端请求 | Netlify Function | 功能 |
|---------|-----------------|------|
| `GET /api/users` | `users-get.js` | 获取用户列表 |
| `POST /api/users` | `users-create.js` | 创建用户 |
| `PUT /api/users/:username` | `users-update.js` | 更新用户 |
| `DELETE /api/users/:username` | `users-delete.js` | 删除用户 |
| `POST /api/auth/validate` | `auth-validate.js` | 验证凭证 |
| ... | ... | ... |

完整映射见 `netlify.toml`

## 🚀 本地开发

### 安装依赖

```bash
cd netlify/functions
npm install
```

### 本地测试 Functions

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 在项目根目录运行
netlify dev
```

这会启动一个本地服务器，模拟 Netlify 环境。

### 环境变量

创建项目根目录的 `.env` 文件：

```env
MONGODB_URI=mongodb+srv://...
```

## 📦 依赖说明

### mongoose
- MongoDB ODM（对象文档映射）
- 提供 Schema、Model、Query 等功能
- 处理数据验证和类型转换

### bcryptjs
- 密码加密库
- 用于 hash 用户密码
- 确保密码安全存储

## 🔒 安全考虑

### 1. 密码加密
- 使用 bcrypt 加密存储
- 盐值强度：10

### 2. 环境变量
- 敏感信息存储在 Netlify 环境变量中
- 不提交到 Git

### 3. CORS 配置
- 允许跨域请求
- 在 `utils/response.js` 中配置

### 4. 输入验证
- 检查必填字段
- 验证数据类型
- 防止注入攻击

## 📊 性能优化

### 1. 数据库连接复用

```javascript
// utils/db.js
let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }
  // 建立新连接...
}
```

这样可以在多次 Function 调用之间复用连接。

### 2. 冷启动

首次调用可能需要 1-2 秒（冷启动）。后续调用会更快。

**优化建议：**
- 使用定时器保持 Functions 温暖
- 优化代码减少依赖
- 使用 MongoDB 连接池

## 🐛 调试

### 查看日志

1. Netlify 控制面板 → **Functions**
2. 点击具体的 Function
3. 查看 **Function log**

### 本地调试

```bash
netlify dev
```

在浏览器控制台查看网络请求和响应。

## 📈 监控

### Netlify 免费额度

- Functions 调用：125,000 次/月
- Functions 运行时间：100 小时/月
- 带宽：100 GB/月

### 查看使用情况

Netlify 控制面板 → **Usage**

## 🔄 部署流程

1. **提交代码**
   ```bash
   git add netlify/
   git commit -m "更新 Functions"
   git push
   ```

2. **自动部署**
   - Netlify 检测到代码变更
   - 自动构建和部署
   - 约 2-3 分钟完成

3. **验证**
   - 访问 `/api/health` 检查状态
   - 查看 Functions 日志确认无错误

## 💡 常见问题

### Q: Functions 调用失败？
**A:** 检查环境变量 `MONGODB_URI` 是否设置正确。

### Q: 数据库连接超时？
**A:** 确认 MongoDB Atlas 网络访问允许 0.0.0.0/0。

### Q: 本地开发连不上数据库？
**A:** 确保本地有 `.env` 文件，包含 `MONGODB_URI`。

### Q: 如何查看详细错误？
**A:** 在 Netlify Functions 日志中查看，或使用 `netlify dev` 本地调试。

## 📚 相关文档

- [Netlify Functions 官方文档](https://docs.netlify.com/functions/overview/)
- [MongoDB Node.js 驱动](https://www.mongodb.com/docs/drivers/node/)
- [Mongoose 文档](https://mongoosejs.com/)

## 🎯 下一步

1. ✅ 了解每个 Function 的功能
2. ✅ 学习如何添加新的 API 端点
3. ✅ 探索 MongoDB 查询优化
4. ✅ 实现更多业务逻辑

**祝开发愉快！** 🚀

