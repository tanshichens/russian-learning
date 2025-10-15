/**
 * 注册申请服务（API版本）
 * 使用后端API进行数据同步
 */

import { registrationAPI } from './api';

export interface RegistrationRequest {
  id: string;
  username: string;
  password: string;
  displayName: string;
  contactInfo?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
}

/**
 * 获取所有注册申请
 */
export const getAllRequests = async (): Promise<RegistrationRequest[]> => {
  const result = await registrationAPI.getAll();
  return result.success ? result.data : [];
};

/**
 * 提交注册申请
 */
export const submitRegistration = async (data: {
  username: string;
  password: string;
  displayName: string;
  contactInfo?: string;
  reason?: string;
}): Promise<{ success: boolean; message: string }> => {
  return await registrationAPI.submit(data);
};

/**
 * 获取待审批的申请数量
 */
export const getPendingCount = async (): Promise<number> => {
  const requests = await getAllRequests();
  return requests.filter(r => r.status === 'pending').length;
};

/**
 * 批准申请
 */
export const approveRequest = async (
  requestId: string,
  adminUsername: string
): Promise<{ success: boolean; message: string }> => {
  return await registrationAPI.approve(requestId, adminUsername);
};

/**
 * 拒绝申请
 */
export const rejectRequest = async (
  requestId: string,
  adminUsername: string,
  reason?: string
): Promise<{ success: boolean; message: string }> => {
  return await registrationAPI.reject(requestId, adminUsername, reason);
};

/**
 * 删除申请记录
 */
export const deleteRequest = async (requestId: string): Promise<{ success: boolean; message: string }> => {
  return await registrationAPI.delete(requestId);
};

