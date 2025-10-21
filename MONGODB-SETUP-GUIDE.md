# MongoDB Atlas 配置指南

## 📋 目录

1. [注册 MongoDB Atlas 账号](#注册-mongodb-atlas-账号)
2. [创建免费集群](#创建免费集群)
3. [配置数据库用户](#配置数据库用户)
4. [配置网络访问](#配置网络访问)
5. [获取连接字符串](#获取连接字符串)
6. [配置到项目](#配置到项目)
7. [验证连接](#验证连接)

---

## 🎯 为什么使用 MongoDB Atlas？

✅ **完全免费**：提供 512MB 免费存储空间  
✅ **云端托管**：无需自己搭建服务器  
✅ **自动备份**：数据安全有保障  
✅ **全球访问**：可以从任何地方连接  
✅ **专业稳定**：生产环境可用

---

## 1️⃣ 注册 MongoDB Atlas 账号

### 步骤 1.1：访问官网

打开浏览器，访问：https://www.mongodb.com/cloud/atlas/register

### 步骤 1.2：填写注册信息

```
选项1：使用 Google 账号注册（推荐，最快）
       ↓
    点击 "Sign up with Google"

选项2：使用邮箱注册
       ↓
    输入：
    - Email Address（邮箱）
    - Password（密码）
    - 勾选 "I agree to the Terms of Service and Privacy Policy"
    - 点击 "Sign Up"
```

### 步骤 1.3：验证邮箱

- 检查邮箱收到的验证邮件
- 点击邮件中的验证链接
- 完成验证

---

## 2️⃣ 创建免费集群

### 步骤 2.1：选择部署方式

登录后，你会看到欢迎页面：

1. 点击 **"+ Create"** 按钮
2. 选择 **"Shared"**（共享集群，免费）
3. 点击 **"Create"**

### 步骤 2.2：配置集群

#### 云服务商选择（重要！）

```
推荐配置（速度最快）：

云服务商：AWS (Amazon Web Services)
区域：    ap-southeast-1 (新加坡)
          或
          ap-east-1 (香港)

原因：距离中国最近，速度最快
```

**配置选项：**

| 选项 | 设置 | 说明 |
|------|------|------|
| Cloud Provider | **AWS** | 推荐 |
| Region | **ap-southeast-1** (Singapore) | 新加坡，速度快 |
| Cluster Tier | **M0 Sandbox** (FREE) | 免费版 |
| Cluster Name | `russian-learning` | 项目名称 |

### 步骤 2.3：创建集群

- 点击右下角 **"Create Cluster"** 按钮
- 等待集群创建（大约 3-5 分钟）
- 看到 ✅ 表示创建成功

---

## 3️⃣ 配置数据库用户

### 步骤 3.1：创建数据库用户

集群创建完成后，会弹出配置向导：

**Security Quickstart** 页面：

1. **Authentication Method**（认证方式）
   - 选择：**Username and Password**

2. **Username**（用户名）
   ```
   输入：russianlearning
   （可以自定义，但要记住）
   ```

3. **Password**（密码）
   ```
   选项1：点击 "Autogenerate Secure Password" 自动生成
         （推荐！会生成强密码）
   
   选项2：手动输入密码
         要求：至少8个字符，包含大小写字母和数字
   ```

4. ⚠️ **重要**：点击 **"Copy"** 复制密码
   ```
   立即粘贴保存到记事本！
   密码只显示一次，丢失需要重新创建用户！
   ```

5. 点击 **"Create User"**

### 步骤 3.2：保存凭证

创建一个文本文件 `mongodb-credentials.txt` 保存：

```
MongoDB Atlas 凭证信息

用户名：russianlearning
密码：[你的密码]
集群名称：russian-learning

创建时间：2025-XX-XX
```

---

## 4️⃣ 配置网络访问

### 步骤 4.1：添加 IP 白名单

在 **Network Access** 页面：

1. 点击 **"Add IP Address"**

2. 选择访问方式：

```
选项1：允许所有IP访问（推荐用于学习/测试）
       ↓
    点击 "Allow Access from Anywhere"
    IP Address会自动填入：0.0.0.0/0
    Comment: Allow all IPs
    ↓
    点击 "Confirm"

选项2：只允许当前IP访问（更安全）
       ↓
    点击 "Add Current IP Address"
    会自动检测你的IP
    ↓
    点击 "Confirm"
```

**推荐设置**：
```
✅ Allow Access from Anywhere (0.0.0.0/0)
原因：Railway等云平台IP会变化，这样确保始终能连接
```

### 步骤 4.2：确认网络配置

等待状态变为 **"Active"**（绿色），表示配置成功。

---

## 5️⃣ 获取连接字符串

### 步骤 5.1：获取连接URI

1. 回到 **Database** 页面

2. 点击集群的 **"Connect"** 按钮

3. 选择连接方式：
   ```
   点击 "Drivers"（驱动程序）
   ```

4. 选择驱动版本：
   ```
   Driver: Node.js
   Version: 5.5 or later（选择最新版本）
   ```

5. 复制连接字符串：
   ```
   看到类似这样的字符串：
   
   mongodb+srv://russianlearning:<password>@russian-learning.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. 点击 **"Copy"** 复制

### 步骤 5.2：修改连接字符串

⚠️ **重要**：需要手动替换密码和数据库名

**原始字符串：**
```
mongodb+srv://russianlearning:<password>@russian-learning.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**修改步骤：**

1. 将 `<password>` 替换为你的真实密码（步骤3.1中保存的）
2. 在 `.mongodb.net/` 后面添加数据库名

**修改后的字符串：**
```
mongodb+srv://russianlearning:你的真实密码@russian-learning.xxxxx.mongodb.net/russian-learning?retryWrites=true&w=majority
                                                                                          ↑
                                                                                    添加数据库名
```

### 步骤 5.3：示例

```
假设密码是：MySecret123

修改前：
mongodb+srv://russianlearning:<password>@russian-learning.abc123.mongodb.net/?retryWrites=true&w=majority

修改后：
mongodb+srv://russianlearning:MySecret123@russian-learning.abc123.mongodb.net/russian-learning?retryWrites=true&w=majority
```

---

## 6️⃣ 配置到项目

### 方式A：本地开发配置

#### 步骤 6A.1：创建环境变量文件

在 `backend` 文件夹中创建 `.env` 文件：

```bash
cd backend
type nul > .env
```

#### 步骤 6A.2：编辑 .env 文件

打开 `backend/.env`，粘贴以下内容：

```env
# MongoDB数据库连接字符串
MONGODB_URI=mongodb+srv://你的用户名:你的密码@你的集群.xxxxx.mongodb.net/russian-learning?retryWrites=true&w=majority

# 服务器端口
PORT=3001

# 运行环境
NODE_ENV=development
```

⚠️ 替换 `MONGODB_URI` 为你的真实连接字符串！

#### 步骤 6A.3：安装依赖

```bash
cd backend
npm install
```

这会自动安装：
- mongoose（MongoDB驱动）
- bcryptjs（密码加密）
- dotenv（环境变量）

#### 步骤 6A.4：启动服务

```bash
npm start
```

看到以下输出表示成功：

```
╔════════════════════════════════════════╗
║   俄语学习网站 API 服务器已启动       ║
║                                        ║
║   环境: Development                    ║
║   端口: 3001                           ║
║   地址: http://localhost:3001          ║
║                                        ║
║   数据库: MongoDB Atlas               ║
║   状态: ✅ 已连接                     ║
╚════════════════════════════════════════╝
✅ MongoDB 数据库连接成功
✅ 管理员账号初始化成功
   用户名: admin
   密码: admin000
```

---

### 方式B：Railway 部署配置

#### 步骤 6B.1：登录 Railway

访问：https://railway.app/

#### 步骤 6B.2：打开项目

找到你的后端项目（russian-learning-backend）

#### 步骤 6B.3：添加环境变量

1. 点击项目
2. 点击 **"Variables"** 标签
3. 点击 **"New Variable"**

添加以下变量：

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://你的用户名:你的密码@...` |
| `NODE_ENV` | `production` |

⚠️ **重要**：确保 `MONGODB_URI` 完整正确，包括：
- 用户名
- 密码（特殊字符需要URL编码）
- 集群地址
- 数据库名
- 参数

#### 步骤 6B.4：重新部署

1. 点击 **"Deployments"** 标签
2. 点击 **"Redeploy"** 按钮
3. 等待部署完成（约1-2分钟）

#### 步骤 6B.5：特殊字符处理

如果密码包含特殊字符，需要URL编码：

| 字符 | 编码 |
|------|------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `/` | `%2F` |
| `=` | `%3D` |
| `?` | `%3F` |

**示例：**
```
原始密码：MyPass@123
编码后：  MyPass%40123

连接字符串：
mongodb+srv://russianlearning:MyPass%40123@russian-learning...
```

---

## 7️⃣ 验证连接

### 步骤 7.1：测试健康检查

在浏览器访问：

**本地：**
```
http://localhost:3001/api/health
```

**生产：**
```
https://你的railway域名.railway.app/api/health
```

**成功响应：**
```json
{
  "status": "ok",
  "message": "俄语学习网站API运行中",
  "database": "已连接",
  "timestamp": "2025-10-19T10:30:00.000Z"
}
```

### 步骤 7.2：测试数据库状态

访问：
```
http://localhost:3001/api/db-status
```

**成功响应：**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "database": "russian-learning",
    "collections": {
      "users": 1,
      "pendingRequests": 0,
      "activeDevices": 0
    }
  }
}
```

### 步骤 7.3：测试用户登录

使用默认管理员账号测试：

**用户名：** `admin`  
**密码：** `admin000`

打开网站前端，尝试登录。

---

## 🎉 完成！

恭喜！你已经成功配置了 MongoDB Atlas 数据库！

### ✅ 现在你拥有：

- ✅ 云端 MongoDB 数据库
- ✅ 512MB 免费存储空间
- ✅ 自动数据备份
- ✅ 密码加密存储
- ✅ 专业的用户管理系统
- ✅ 设备登录限制
- ✅ 用户注册审批功能

---

## 🔧 常见问题

### Q1: 连接失败怎么办？

**检查清单：**

1. ✅ 检查 `MONGODB_URI` 是否正确
2. ✅ 密码是否正确替换（删除了 `<password>`）
3. ✅ 特殊字符是否正确编码
4. ✅ 数据库名是否添加
5. ✅ 网络访问是否配置（0.0.0.0/0）
6. ✅ 集群是否创建成功

### Q2: 如何查看数据库内容？

**方式1：使用 MongoDB Atlas 网页界面**

1. 登录 MongoDB Atlas
2. 点击 **"Browse Collections"**
3. 选择数据库 `russian-learning`
4. 查看各个集合（users, devices, registrationrequests）

**方式2：使用 MongoDB Compass（桌面工具）**

1. 下载：https://www.mongodb.com/try/download/compass
2. 安装并打开
3. 粘贴你的连接字符串
4. 点击 "Connect"

### Q3: 免费版有什么限制？

| 项目 | 限制 |
|------|------|
| 存储空间 | 512MB |
| 并发连接 | 500个 |
| 集群数量 | 1个 |
| 备份 | 不支持自动快照 |

**对你的项目来说：**
- ✅ 存储空间：足够 1000+ 用户
- ✅ 并发连接：足够 100+ 同时在线
- ✅ 完全免费，无需信用卡

### Q4: 如何重置密码？

1. 登录 MongoDB Atlas
2. 点击 **"Database Access"**
3. 找到你的用户
4. 点击 **"Edit"**
5. 输入新密码
6. 更新项目的 `MONGODB_URI`

### Q5: 数据会丢失吗？

❌ **不会！**

- MongoDB Atlas 提供专业的云端存储
- 数据持久化保存
- 多副本自动备份
- 比 Railway 的 JSON 文件稳定得多

### Q6: 如何备份数据？

**方式1：导出数据（推荐）**

使用 MongoDB Compass：
1. 连接数据库
2. 选择集合
3. 点击 "Export Collection"
4. 选择 JSON 或 CSV 格式

**方式2：使用命令行工具**

```bash
mongodump --uri="你的连接字符串"
```

### Q7: 如何迁移现有用户数据？

如果你之前使用 JSON 文件存储，可以这样迁移：

1. 导出 JSON 文件中的用户数据
2. 使用 MongoDB Compass 导入
3. 或使用后端 API 批量添加

---

## 📚 相关文档

- [MongoDB Atlas 官方文档](https://www.mongodb.com/docs/atlas/)
- [Mongoose 使用指南](https://mongoosejs.com/docs/guide.html)
- [后端 API 文档](./BACKEND-API-SETUP.md)
- [部署指南](./DEPLOYMENT.md)

---

## 💡 小贴士

1. **定期更换密码**：建议每3个月更换一次数据库密码
2. **监控使用量**：在 MongoDB Atlas 可以查看存储和连接使用情况
3. **数据备份**：定期导出重要数据到本地
4. **测试环境**：可以创建第二个数据库用于测试（如 `russian-learning-test`）

---

## 🆘 需要帮助？

如果遇到问题：

1. 检查本文档的常见问题部分
2. 查看后端日志输出
3. 检查 Railway 部署日志
4. 查看浏览器控制台错误

---

**创建时间：** 2025-10-19  
**适用版本：** MongoDB Atlas Free Tier (M0)  
**项目：** 俄语学习网站

