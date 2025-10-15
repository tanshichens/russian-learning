import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as RegistrationService from '../services/registrationServiceAPI';

const Login: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        // 登录模式
        const result = await login(username, password);
        
        if (result.success) {
          navigate('/words');
        } else {
          setError(result.message);
        }
      } else {
        // 注册模式
        if (!username || !password) {
          setError('请填写用户名和密码');
          setIsLoading(false);
          return;
        }

        const result = await RegistrationService.submitRegistration({
          username,
          password,
          displayName: username  // 使用用户名作为显示名称
        });

        if (result.success) {
          setSuccess(result.message);
          // 清空表单
          setUsername('');
          setPassword('');
          // 3秒后切换回登录模式
          setTimeout(() => {
            setIsLoginMode(true);
            setSuccess('');
          }, 3000);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('操作过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>{isLoginMode ? '登录账号' : '申请账号'}</h2>
            <p>{isLoginMode ? '请输入您的账号和密码' : '设置用户名和密码，等待管理员审批'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="success-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{success}</span>
              </div>
            )}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (isLoginMode ? '登录中...' : '提交中...') : (isLoginMode ? '登录' : '提交申请')}
            </button>
          </form>

          {isLoginMode && (
            <div className="register-prompt">
              <div className="register-prompt-content">
                <div className="prompt-icon">✨</div>
                <div className="prompt-text">
                  <p className="prompt-title">还没有账号？</p>
                  <p className="prompt-subtitle">只需30秒即可申请</p>
                </div>
                <button className="register-prompt-button" onClick={switchMode}>
                  立即申请
                </button>
              </div>
            </div>
          )}
          
          {!isLoginMode && (
            <div className="back-to-login">
              <button className="back-link" onClick={switchMode}>
                ← 已有账号？返回登录
              </button>
            </div>
          )}
          
          <div className="login-footer">
            <p className="login-tip">
              {isLoginMode 
                ? '💡 每个账号最多可在2个设备上同时登录' 
                : '📝 提交申请后，请等待管理员审批通过即可登录'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

