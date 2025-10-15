/**
 * 用户注册申请服务
 */

export interface RegistrationRequest {
  id: string;
  username: string;
  password: string;
  displayName: string;
  contactInfo?: string;  // 联系方式（可选）
  reason?: string;       // 申请原因
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
}

const STORAGE_KEY = 'registration_requests';

/**
 * 获取所有注册申请
 */
export const getAllRequests = (): RegistrationRequest[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * 保存注册申请列表
 */
const saveRequests = (requests: RegistrationRequest[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

/**
 * 提交注册申请
 */
export const submitRegistration = (data: {
  username: string;
  password: string;
  displayName: string;
  contactInfo?: string;
  reason?: string;
}): { success: boolean; message: string } => {
  const requests = getAllRequests();
  
  // 检查用户名是否已存在于待审批列表
  if (requests.some(r => r.username === data.username && r.status === 'pending')) {
    return { success: false, message: '该用户名已在审核中，请勿重复申请' };
  }

  // 检查用户名是否为已批准状态（正在使用中）
  const existingApprovedRequest = requests.find(r => r.username === data.username && r.status === 'approved');
  if (existingApprovedRequest) {
    return { success: false, message: '该用户名已被使用' };
  }
  
  // 如果之前被拒绝过，可以重新申请（会创建新的申请记录）

  // 创建新申请
  const newRequest: RegistrationRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  requests.push(newRequest);
  saveRequests(requests);

  return { success: true, message: '注册申请已提交，请等待管理员审批' };
};

/**
 * 获取待审批的申请数量
 */
export const getPendingCount = (): number => {
  const requests = getAllRequests();
  return requests.filter(r => r.status === 'pending').length;
};

/**
 * 批准申请
 */
export const approveRequest = (
  requestId: string, 
  adminUsername: string,
  userManagementService: any
): { success: boolean; message: string } => {
  const requests = getAllRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return { success: false, message: '申请不存在' };
  }

  const request = requests[requestIndex];
  
  // 添加用户到系统
  const addResult = userManagementService.addUser({
    username: request.username,
    password: request.password,
    displayName: request.displayName,
    role: '普通用户',
    note: request.reason || '用户注册',
    createdAt: new Date().toISOString().split('T')[0]
  });

  if (!addResult.success) {
    return { success: false, message: `添加用户失败：${addResult.message}` };
  }

  // 更新申请状态
  requests[requestIndex] = {
    ...request,
    status: 'approved',
    processedAt: new Date().toISOString(),
    processedBy: adminUsername
  };

  saveRequests(requests);

  return { success: true, message: '申请已批准，用户已创建' };
};

/**
 * 拒绝申请
 */
export const rejectRequest = (
  requestId: string,
  adminUsername: string,
  reason?: string
): { success: boolean; message: string } => {
  const requests = getAllRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return { success: false, message: '申请不存在' };
  }

  const request = requests[requestIndex];

  // 更新申请状态
  requests[requestIndex] = {
    ...request,
    status: 'rejected',
    processedAt: new Date().toISOString(),
    processedBy: adminUsername,
    rejectionReason: reason || '未通过审核'
  };

  saveRequests(requests);

  return { success: true, message: '申请已拒绝' };
};

/**
 * 删除申请记录
 */
export const deleteRequest = (requestId: string): { success: boolean; message: string } => {
  const requests = getAllRequests();
  const filteredRequests = requests.filter(r => r.id !== requestId);
  
  if (filteredRequests.length === requests.length) {
    return { success: false, message: '申请不存在' };
  }

  saveRequests(filteredRequests);
  return { success: true, message: '申请记录已删除' };
};

