# MongoDB 版本快速开始指南

## 🚀 3步完成MongoDB版本部署

---

## 📖 第1步：申请 MongoDB Atlas（5分钟）

### 1. 注册账号
访问：https://www.mongodb.com/cloud/atlas/register

用Google账号注册最快！

### 2. 创建免费集群
- 选择：**AWS** + **新加坡** (ap-southeast-1)
- 集群名：`russian-learning`
- 点击 **Create Cluster**

### 3. 创建数据库用户
- 用户名：`russianlearning`
- 密码：点击自动生成，**立即复制保存！**

### 4. 配置网络访问
- 选择：**Allow Access from Anywhere** (0.0.0.0/0)

### 5. 获取连接字符串
1. 点击 **Connect** → **Drivers**
2. 复制连接字符串
3. 替换 `<password>` 为真实密码
4. 在末尾添加数据库名：`/russian-learning`

**最终格式：**
```
mongodb+srv://russianlearning:你的密码@russian-learning.xxxxx.mongodb.net/russian-learning?retryWrites=true&w=majority
```

✅ 完成！保存这个连接字符串！

---

## 🔧 第2步：部署后端到 Railway（3分钟）

### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "添加MongoDB支持"
git push
```

### 2. 创建 Railway 项目
访问：https://railway.app/new
- 登录 GitHub
- 选择 `russian-learning` 仓库
- 点击 **Deploy Now**

### 3. 配置后端
**设置根目录：**
```
Settings → Root Directory → backend
```

**添加环境变量：**
```
Variables → New Variable

名称：MONGODB_URI
值：  mongodb+srv://russianlearning:你的密码@...
（粘贴你在第1步获得的连接字符串）

名称：NODE_ENV
值：  production
```

**生成域名：**
```
Settings → Networking → Generate Domain
```

保存这个域名：`xxx-backend-production.up.railway.app`

### 4. 等待部署完成
- 点击 **Deployments**
- 等待 ✅ **SUCCESS**（约2分钟）

### 5. 测试后端
访问：`https://你的后端域名/api/health`

看到这个说明成功：
```json
{
  "status": "ok",
  "database": "已连接"
}
```

✅ 后端部署完成！

---

## 🌐 第3步：配置并部署前端（2分钟）

### 方式A：部署到 Railway（推荐）

1. **在同一个 Railway 项目中添加前端**
   - 点击 **+ New** → **GitHub Repo**
   - 再次选择 `russian-learning`

2. **配置环境变量**
   ```
   VITE_API_URL = https://你的后端域名.railway.app/api
   ```

3. **配置构建**
   ```
   Build Command: npm install && npm run build
   Start Command: npx serve dist -s -p $PORT
   ```

4. **生成域名**
   ```
   Settings → Networking → Generate Domain
   ```

5. **等待部署**（约3分钟）

### 方式B：部署到华为云 OBS

1. **创建环境变量文件**
   创建 `.env.production`：
   ```
   VITE_API_URL=https://你的后端域名.railway.app/api
   ```

2. **构建并部署**
   ```bash
   npm run build
   npm run deploy:obs-spa
   ```

✅ 前端部署完成！

---

## 🎉 完成！测试你的网站

### 测试登录
1. 访问你的网站
2. 点击登录
3. 输入：
   ```
   用户名：admin
   密码：  admin000
   ```
4. ✅ 登录成功！

### 测试注册
1. 点击"申请账号"
2. 填写信息提交
3. 用管理员登录
4. 进入"用户管理"
5. 批准新用户
6. ✅ 新用户可以登录了！

---

## 📚 详细文档

如果遇到问题，查看完整文档：

- 📖 [MongoDB 配置详细指南](./MONGODB-SETUP-GUIDE.md)
- 🚀 [完整部署教程](./MONGODB-DEPLOYMENT-GUIDE.md)
- 🔧 [后端 API 文档](./BACKEND-API-SETUP.md)

---

## ⚠️ 重要提醒

1. **修改管理员密码**
   - 默认密码：`admin000`
   - 登录后立即修改！

2. **保存连接字符串**
   - MongoDB 连接字符串
   - Railway 域名
   - 都要保存好！

3. **定期备份**
   - 每周导出一次用户数据
   - MongoDB Atlas → Browse Collections → Export

---

## 🆘 快速故障排查

### 问题：前端无法连接后端
**检查：**
1. 后端是否运行：访问 `/api/health`
2. `VITE_API_URL` 是否正确
3. 是否以 `/api` 结尾

### 问题：数据库连接失败
**检查：**
1. `MONGODB_URI` 是否正确
2. 密码是否替换了 `<password>`
3. 是否添加了数据库名 `/russian-learning`
4. 网络访问是否允许 (0.0.0.0/0)

### 问题：登录失败
**检查：**
1. 管理员账号：`admin` / `admin000`
2. 是否已初始化（查看 Railway 日志）
3. 数据库是否连接成功

---

## 💡 下一步

现在你可以：
- ✅ 添加新用户
- ✅ 审批注册申请
- ✅ 管理用户权限
- ✅ 在任何设备访问

**享受你的MongoDB驱动的专业系统吧！** 🎊

---

**总耗时：** 约10分钟  
**难度：** ⭐⭐⭐ (中等)  
**费用：** 完全免费  
**稳定性：** ⭐⭐⭐⭐⭐ (生产级)

