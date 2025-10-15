/**
 * 用户账号配置文件
 * 
 * 在这个文件中集中管理所有用户账号和密码
 * 添加新用户只需在下面的数组中添加一条记录即可
 */

export interface UserAccount {
  username: string;    // 用户名
  password: string;    // 密码
  displayName?: string; // 显示名称（可选）
  role?: string;       // 角色（可选）
  note?: string;       // 备注（可选）
  createdAt?: string;  // 创建时间（可选）
  expiresAt?: string;  // 过期时间（可选）
}

/**
 * 用户账号列表
 * 
 * 使用说明：
 * 1. 添加新用户：在数组末尾添加新的对象
 * 2. 修改密码：直接修改对应用户的password字段
 * 3. 删除用户：删除对应的对象
 * 4. 查看所有用户：查看下面的数组
 */
export const USER_ACCOUNTS: UserAccount[] = [
  {
    username: 'user1',
    password: 'password123',
    displayName: '用户1',
    role: '普通用户',
    note: '测试账号',
    createdAt: '2025-01-01'
  },
  {
    username: 'user2',
    password: 'password456',
    displayName: '用户2',
    role: '普通用户',
    note: '测试账号',
    createdAt: '2025-01-01'
  },
  {
    username: 'user3',
    password: 'password789',
    displayName: '用户3',
    role: '普通用户',
    note: '测试账号',
    createdAt: '2025-01-01'
  },
  {
    username: 'admin',
    password: 'admin000',
    displayName: '管理员',
    role: '管理员',
    note: '系统管理员',
    createdAt: '2025-01-01'
  },
  // 在这里添加更多用户...
  // {
  //   username: 'newuser',
  //   password: 'newpassword',
  //   displayName: '新用户',
  //   role: '普通用户',
  //   note: '备注信息',
  //   createdAt: '2025-01-15'
  // },
];

/**
 * 将账号列表转换为键值对格式，方便查询
 */
export const getAccountsMap = (): { [key: string]: string } => {
  const accountsMap: { [key: string]: string } = {};
  USER_ACCOUNTS.forEach(account => {
    accountsMap[account.username] = account.password;
  });
  return accountsMap;
};

/**
 * 获取用户的显示名称
 */
export const getUserDisplayName = (username: string): string | undefined => {
  const user = USER_ACCOUNTS.find(u => u.username === username);
  return user?.displayName || username;
};

/**
 * 检查账号是否存在
 */
export const isUserExists = (username: string): boolean => {
  return USER_ACCOUNTS.some(u => u.username === username);
};

/**
 * 获取所有账号列表（仅用户名，不包含密码）
 */
export const getAllUsernames = (): string[] => {
  return USER_ACCOUNTS.map(u => u.username);
};

/**
 * 获取用户详细信息（不包含密码）
 */
export const getUserInfo = (username: string): Omit<UserAccount, 'password'> | undefined => {
  const user = USER_ACCOUNTS.find(u => u.username === username);
  if (!user) return undefined;
  
  const { password, ...userInfo } = user;
  return userInfo;
};

