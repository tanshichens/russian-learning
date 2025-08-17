# 🚀 华为云 OBS 部署指南

## 📋 准备工作

### 1. 华为云账号和 OBS 桶
- 确保您已有华为云账号
- 创建 OBS 桶用于存储网站文件
- 获取 Access Key ID 和 Secret Access Key

### 2. 配置 OBS 桶
1. 登录华为云控制台
2. 进入 OBS 服务
3. 创建新桶或使用现有桶
4. 配置桶策略为公共读

## ⚙️ 配置步骤

### 第一步：配置 OBS 桶策略

在华为云控制台中配置您的 OBS 桶：

1. **进入桶管理页面**
   - 选择您的桶
   - 点击"权限管理" → "桶策略"

2. **添加桶策略**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

3. **启用静态网站托管**
   - 点击"基础配置" → "静态网站托管"
   - 启用静态网站托管
   - 设置默认首页：`index.html`
   - 设置错误页面：`index.html`

### 第二步：配置项目

1. **编辑 `obs-config.json` 文件**
```json
{
  "accessKeyId": "您的Access Key ID",
  "secretAccessKey": "您的Secret Access Key",
  "server": "obs.cn-north-4.myhuaweicloud.com",
  "bucket": "您的桶名称",
  "region": "cn-north-4"
}
```

2. **设置环境变量（可选）**
```bash
# Windows PowerShell
$env:HUAWEI_ACCESS_KEY_ID="您的Access Key ID"
$env:HUAWEI_SECRET_ACCESS_KEY="您的Secret Access Key"
$env:HUAWEI_OBS_BUCKET="您的桶名称"
$env:HUAWEI_OBS_SERVER="obs.cn-north-4.myhuaweicloud.com"
$env:HUAWEI_OBS_REGION="cn-north-4"
```

### 第三步：构建和部署

1. **构建项目**
```bash
npm run build
```

2. **部署到 OBS**
```bash
npm run deploy:obs
```

## 🔧 自定义域名配置

### 方法一：使用华为云 CDN

1. **创建 CDN 加速域名**
   - 进入华为云 CDN 控制台
   - 添加加速域名
   - 源站类型选择"OBS桶域名"
   - 选择您的 OBS 桶

2. **配置 CNAME 记录**
   - 在您的域名注册商处添加 CNAME 记录
   - 记录值指向 CDN 提供的域名

### 方法二：直接使用 OBS 域名

您的网站可以直接通过以下地址访问：
```
https://your-bucket-name.obs-website.cn-north-4.myhuaweicloud.com
```

## 📱 测试部署

部署完成后，请测试：

- ✅ 首页正常加载
- ✅ 四个功能模块链接正常
- ✅ 响应式设计在不同设备上正常显示
- ✅ 图片和图标正常显示
- ✅ 路由跳转正常

## 🛠️ 故障排除

### 常见问题：

1. **上传失败**
   - 检查 Access Key 和 Secret Key 是否正确
   - 确认桶名称和区域配置正确
   - 检查网络连接

2. **页面无法访问**
   - 确认桶策略已配置为公共读
   - 检查静态网站托管是否已启用
   - 验证默认首页设置

3. **路由问题**
   - 确保错误页面设置为 `index.html`
   - 检查 SPA 路由配置

### 获取帮助：

- 查看华为云 OBS 官方文档
- 检查浏览器控制台错误信息
- 确认所有配置步骤已完成

## 🎉 部署完成

部署成功后，您的俄语学习网站就可以通过华为云 OBS 访问了！

**下一步建议：**
- 配置 CDN 加速
- 设置自定义域名
- 配置 HTTPS 证书
- 添加访问统计

## 📞 技术支持

如果遇到问题，可以：
- 查看华为云官方文档
- 联系华为云技术支持
- 检查项目日志和错误信息 