# Netlify 快速开始（3 步完成）

## 🚀 最快捷的部署方式

用 Netlify + MongoDB Atlas 实现完整用户管理，只需 **15 分钟**！

---

## 第 1 步：MongoDB Atlas（5 分钟）

1. 访问：https://www.mongodb.com/cloud/atlas/register
2. 注册并创建免费集群（选择新加坡）
3. 创建数据库用户，保存密码
4. 网络访问设为：`0.0.0.0/0`
5. 获取连接字符串：
   ```
   mongodb+srv://用户名:密码@集群.xxxxx.mongodb.net/russian-learning?retryWrites=true&w=majority
   ```

✅ **保存这个连接字符串！**

---

## 第 2 步：部署到 Netlify（5 分钟）

1. 推送代码到 GitHub：
   ```bash
   git add .
   git commit -m "添加 Netlify Functions"
   git push
   ```

2. 访问：https://app.netlify.com/
3. 点击 **Add new site** → **Import from Git**
4. 选择你的 `russian-learning` 仓库
5. 点击 **Deploy site**（自动检测配置）

---

## 第 3 步：配置环境变量（5 分钟）

1. 进入 Netlify 项目页面
2. **Site configuration** → **Environment variables**
3. 点击 **Add variable**
4. 添加：
   - **Key:** `MONGODB_URI`
   - **Value:** 你的 MongoDB 连接字符串
5. **Trigger deploy** → **Deploy site**

等待部署完成（约 2 分钟）

---

## 🎉 完成！初始化管理员

### 获取你的网站地址
```
https://your-site-name.netlify.app
```

### 初始化管理员账号

打开你的网站，按 **F12** 打开控制台，粘贴：

```javascript
fetch('/api/init-admin', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log(data));
```

✅ **管理员账号创建成功！**
- 用户名：`admin`
- 密码：`admin000`

⚠️ **登录后立即修改密码！**

---

## ✨ 测试系统

### 1. 健康检查
访问：`https://你的域名.netlify.app/api/health`

### 2. 登录测试
访问首页 → 登录 → 输入 `admin` / `admin000`

### 3. 注册测试
点击"申请账号" → 填写信息 → 管理员审批

---

## 🎊 你现在拥有：

✅ 完整的前端网站  
✅ Serverless API  
✅ MongoDB 数据库  
✅ 用户管理系统  
✅ 完全免费  

---

## 📚 详细文档

查看完整指南：[NETLIFY-完整部署指南.md](./NETLIFY-完整部署指南.md)

---

**总耗时：** 15 分钟  
**难度：** ⭐⭐⭐  
**费用：** 免费  
**稳定性：** ⭐⭐⭐⭐⭐

