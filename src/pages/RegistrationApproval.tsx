import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import * as RegistrationService from '../services/registrationServiceAPI';

const RegistrationApproval: React.FC = () => {
  const { username: currentUser } = useAuth();
  const [requests, setRequests] = useState<RegistrationService.RegistrationRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // 检查是否为管理员
  if (currentUser !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const allRequests = await RegistrationService.getAllRequests();
    setRequests(allRequests);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleApprove = async (requestId: string) => {
    const result = await RegistrationService.approveRequest(requestId, currentUser!);
    
    if (result.success) {
      showMessage('success', result.message);
      loadRequests();
    } else {
      showMessage('error', result.message);
    }
  };

  const handleReject = async (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    
    const result = await RegistrationService.rejectRequest(requestId, currentUser!, rejectionReason);
    
    if (result.success) {
      const msg = request?.status === 'approved' 
        ? '用户已禁用，该用户可重新申请账号' 
        : '申请已拒绝，该用户可重新提交申请';
      showMessage('success', msg);
      loadRequests();
      setRejectingId(null);
      setRejectionReason('');
    } else {
      showMessage('error', result.message);
    }
  };

  const handleDelete = async (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    const confirmMsg = request?.status === 'approved' 
      ? `确定要删除用户 "${request.username}" 吗？删除后该用户将无法登录！`
      : '确定要删除这条申请记录吗？';
    
    if (!confirm(confirmMsg)) {
      return;
    }

    const result = await RegistrationService.deleteRequest(requestId);
    
    if (result.success) {
      showMessage('success', request?.status === 'approved' ? '用户已删除，无法再登录' : result.message);
      loadRequests();
    } else {
      showMessage('error', result.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: '待审批', class: 'status-pending' },
      approved: { text: '已批准', class: 'status-approved' },
      rejected: { text: '已拒绝', class: 'status-rejected' }
    };
    return badges[status as keyof typeof badges] || { text: status, class: '' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="approval-page">
      <div className="approval-container">
        <div className="approval-header">
          <h1>用户管理</h1>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              待审批 ({pendingCount})
            </button>
            <button 
              className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              已批准 ({approvedCount})
            </button>
            <button 
              className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              已拒绝 ({rejectedCount})
            </button>
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              全部 ({requests.length})
            </button>
          </div>
        </div>

        {message && (
          <div className={`message-toast ${message.type}`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        <div className="requests-table-wrapper">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <p>暂无{filter === 'pending' ? '待审批' : filter === 'approved' ? '已批准' : filter === 'rejected' ? '已拒绝' : ''}用户</p>
            </div>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>用户名</th>
                  <th>密码</th>
                  <th>显示名称</th>
                  <th>状态</th>
                  <th>提交时间</th>
                  <th>处理时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="username-cell">{request.username}</td>
                    <td className="password-cell">
                      <code>{request.password}</code>
                    </td>
                    <td>{request.displayName}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(request.status).class}`}>
                        {getStatusBadge(request.status).text}
                      </span>
                    </td>
                    <td className="time-cell">{formatDate(request.submittedAt).split(' ')[0]}<br/><span className="time-small">{formatDate(request.submittedAt).split(' ')[1]}</span></td>
                    <td className="time-cell">{request.processedAt ? <>{formatDate(request.processedAt).split(' ')[0]}<br/><span className="time-small">{formatDate(request.processedAt).split(' ')[1]}</span></> : '-'}</td>
                    <td className="actions-cell">
                      {request.status === 'pending' && (
                        <>
                          <button 
                            className="table-approve-btn"
                            onClick={() => handleApprove(request.id)}
                            title="批准"
                          >
                            ✓
                          </button>
                          <button 
                            className="table-reject-btn"
                            onClick={() => setRejectingId(request.id)}
                            title="拒绝"
                          >
                            ✕
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <>
                          <button 
                            className="table-disable-btn"
                            onClick={() => setRejectingId(request.id)}
                            title="禁用用户"
                          >
                            🚫
                          </button>
                          <button 
                            className="table-delete-btn"
                            onClick={() => handleDelete(request.id)}
                            title="删除用户"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                      {request.status === 'rejected' && (
                        <>
                          <button 
                            className="table-approve-btn"
                            onClick={() => handleApprove(request.id)}
                            title="重新批准"
                          >
                            ✓
                          </button>
                          <button 
                            className="table-delete-btn"
                            onClick={() => handleDelete(request.id)}
                            title="删除记录"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* 拒绝/禁用原因弹窗 */}
          {rejectingId && (
            <div className="rejection-modal">
              <div className="modal-overlay" onClick={() => { setRejectingId(null); setRejectionReason(''); }}></div>
              <div className="rejection-modal-content">
                <h3>{filteredRequests.find(r => r.id === rejectingId)?.status === 'approved' ? '禁用用户' : '拒绝申请'}</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="请输入原因（可选）"
                  rows={4}
                />
                <div className="modal-actions">
                  <button onClick={() => { setRejectingId(null); setRejectionReason(''); }}>
                    取消
                  </button>
                  <button onClick={() => handleReject(rejectingId)} className="confirm-reject">
                    确认
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationApproval;

