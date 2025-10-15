# 账号管理指南

## 📍 账号配置文件位置

所有用户账号和密码都集中在一个文件中管理：

```
src/config/accounts.ts
```

## 📝 添加新用户

### 方法1：使用完整配置（推荐）

打开 `src/config/accounts.ts` 文件，在 `USER_ACCOUNTS` 数组中添加：

```typescript
{
  username: 'zhangsan',        // 用户名（必填）
  password: 'zhangsan123',     // 密码（必填）
  displayName: '张三',         // 显示名称（可选）
  role: '学生',                // 角色（可选）
  note: '2025年春季班学生',    // 备注（可选）
  createdAt: '2025-01-15',     // 创建时间（可选）
  expiresAt: '2025-12-31'      // 过期时间（可选，暂未实现）
},
```

### 方法2：快速添加（仅必填项）

```typescript
{
  username: 'lisi',
  password: 'lisi123'
},
```

## ✏️ 修改用户密码

在 `src/config/accounts.ts` 中找到对应用户，修改 `password` 字段：

```typescript
{
  username: 'student1',
  password: 'new-password-here',  // ← 修改这里
  displayName: '学生1',
  role: '学生'
},
```

## 🗑️ 删除用户

在 `src/config/accounts.ts` 中找到对应用户，删除整个对象：

```typescript
// 删除前：
{
  username: 'olduser',
  password: 'oldpass123',
  displayName: '旧用户'
},  // ← 删除这整个对象（包括逗号）

// 删除后：对象已不存在
```

## 📊 查看所有用户

打开 `src/config/accounts.ts`，查看 `USER_ACCOUNTS` 数组即可看到所有用户。

### 当前预设账号

| 用户名 | 密码 | 显示名称 | 角色 | 备注 |
|--------|------|----------|------|------|
| student1 | password123 | 学生1 | 学生 | 测试账号 |
| student2 | password456 | 学生2 | 学生 | 测试账号 |
| teacher | teacher789 | 张老师 | 教师 | 教师账号 |
| admin | admin000 | 管理员 | 管理员 | 系统管理员 |

## 📋 批量添加用户示例

如果你需要添加多个学生账号，可以这样操作：

```typescript
export const USER_ACCOUNTS: UserAccount[] = [
  // ... 现有账号 ...
  
  // 春季班学生（批量添加）
  {
    username: 'spring2025_001',
    password: 'Sp2025@001',
    displayName: '春季班学生001',
    role: '学生',
    note: '2025春季班',
    createdAt: '2025-01-15'
  },
  {
    username: 'spring2025_002',
    password: 'Sp2025@002',
    displayName: '春季班学生002',
    role: '学生',
    note: '2025春季班',
    createdAt: '2025-01-15'
  },
  {
    username: 'spring2025_003',
    password: 'Sp2025@003',
    displayName: '春季班学生003',
    role: '学生',
    note: '2025春季班',
    createdAt: '2025-01-15'
  },
  // ... 继续添加更多学生 ...
];
```

## 🔧 密码生成建议

为了账号安全，建议为每个用户生成强密码：

### 密码规则建议
- 至少8个字符
- 包含大小写字母
- 包含数字
- 可包含特殊字符

### 示例密码格式
```
用户名_年份@编号
例如：Zhang_2025@001
```

或使用在线密码生成器生成随机强密码。

## 📤 分发账号给用户

### 方式1：创建账号清单

创建一个Excel或文本文件：

```
俄语学习网站 - 账号信息

用户名：student1
密码：password123
登录网址：https://your-domain.com
设备限制：最多2个设备同时登录

注意事项：
1. 请妥善保管账号密码
2. 不要与他人共享账号
3. 每个账号最多在2个设备上登录
4. 如需更换设备，请先退出其他设备
```

### 方式2：导出用户列表

你可以创建一个脚本来导出所有用户信息：

```typescript
// 在项目根目录创建 export-accounts.js
import { USER_ACCOUNTS } from './src/config/accounts.ts';

console.table(USER_ACCOUNTS.map(u => ({
  用户名: u.username,
  密码: u.password,
  显示名称: u.displayName,
  角色: u.role,
  备注: u.note
})));
```

## 🔐 安全建议

### 开发环境
- 可以使用简单密码方便测试
- 账号信息在代码中明文存储

### 生产环境（重要！）
⚠️ **当前实现仅适用于小规模内部使用或演示**

如需部署到生产环境，强烈建议：

1. **后端验证**：将账号密码迁移到后端数据库
2. **密码加密**：使用bcrypt等算法加密存储密码
3. **环境变量**：敏感配置使用环境变量
4. **API认证**：使用JWT token进行身份验证
5. **HTTPS**：强制使用HTTPS加密传输
6. **定期更换**：定期要求用户更改密码

## 🛠️ 常用操作

### 快速添加10个学生账号

```typescript
// 使用循环快速生成多个账号
const generateStudents = () => {
  const students = [];
  for (let i = 1; i <= 10; i++) {
    students.push({
      username: `student${i}`,
      password: `password${i.toString().padStart(3, '0')}`,
      displayName: `学生${i}`,
      role: '学生',
      note: '批量生成',
      createdAt: '2025-01-15'
    });
  }
  return students;
};

// 然后将生成的账号添加到 USER_ACCOUNTS 数组中
```

### 按班级组织账号

```typescript
export const USER_ACCOUNTS: UserAccount[] = [
  // ========== 管理员账号 ==========
  {
    username: 'admin',
    password: 'admin000',
    displayName: '管理员',
    role: '管理员'
  },
  
  // ========== 教师账号 ==========
  {
    username: 'teacher_wang',
    password: 'wang@2025',
    displayName: '王老师',
    role: '教师'
  },
  
  // ========== 春季A1班 ==========
  {
    username: 'spring_a1_001',
    password: 'SpA1@001',
    displayName: 'A1班-001',
    role: '学生',
    note: '春季A1班'
  },
  {
    username: 'spring_a1_002',
    password: 'SpA1@002',
    displayName: 'A1班-002',
    role: '学生',
    note: '春季A1班'
  },
  
  // ========== 春季A2班 ==========
  {
    username: 'spring_a2_001',
    password: 'SpA2@001',
    displayName: 'A2班-001',
    role: '学生',
    note: '春季A2班'
  },
  
  // ... 继续添加其他班级 ...
];
```

## 📞 技术支持

如需帮助，请查看：
- `src/config/accounts.ts` - 账号配置文件
- `src/contexts/AuthContext.tsx` - 认证逻辑
- `LOGIN-SYSTEM-GUIDE.md` - 登录系统使用指南

## 🔄 应用更改

修改账号配置后，需要：
1. 保存文件
2. 重新构建项目：`npm run build`
3. 重新部署（如果是生产环境）
4. 或者重启开发服务器：`npm run dev`

更改会立即生效，无需其他操作。

