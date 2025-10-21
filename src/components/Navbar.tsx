import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPendingCount } from '../services/registrationServiceAPI';

const navs = [
  { path: '/', label: '首页' },
  { path: '/words', label: '单词库' },
  { path: '/downloads', label: 'A1-C2高频词下载' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // 定期检查待审批数量
  useEffect(() => {
    if (username === 'admin') {
      const updatePendingCount = async () => {
        const count = await getPendingCount();
        setPendingCount(count);
      };
      
      updatePendingCount();
      const interval = setInterval(updatePendingCount, 5000); // 每5秒更新一次
      
      return () => clearInterval(interval);
    }
  }, [username]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // 当滚动超过70px时，添加scrolled类
      setIsScrolled(scrollTop > 70);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 控制body滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // 清理函数
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const userMenuWrapper = document.querySelector('.user-menu-wrapper');
      
      if (showUserMenu && userMenuWrapper && !userMenuWrapper.contains(target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // 关闭移动菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 处理导航点击
  const handleNavClick = () => {
    closeMobileMenu();
  };

  // 处理登出
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // 处理用户菜单点击
  const handleUserMenuClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <nav id="navbar">
        <div className="logo">柚子带你学俄语</div>
        
        {/* 桌面端导航 */}
        <div className="nav-links desktop-nav">
          <ul>
            {navs.map(nav => (
              <li key={nav.path}>
                <Link
                  to={nav.path}
                  className={location.pathname === nav.path ? 'active' : ''}
                >
                  {nav.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* 管理员用户管理按钮 */}
          {isAuthenticated && username === 'admin' && (
            <Link to="/registration-approval" className="admin-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>用户管理</span>
              {pendingCount > 0 && (
                <span className="badge-count">{pendingCount}</span>
              )}
            </Link>
          )}
          
          {/* 用户按钮 */}
          <div className="user-menu-wrapper">
            <button className="user-button" onClick={handleUserMenuClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {isAuthenticated && <span className="user-name">{username}</span>}
            </button>
            
            {/* 用户下拉菜单 */}
            {showUserMenu && isAuthenticated && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-greeting">你好，{username}</p>
                </div>
                {username === 'admin' && (
                  <Link to="/registration-approval" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <div className="dropdown-link-content">
                      <span>用户管理</span>
                      {pendingCount > 0 && (
                        <span className="dropdown-badge">{pendingCount}</span>
                      )}
                    </div>
                  </Link>
                )}
                <button className="logout-button" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 汉堡菜单按钮 */}
        <button 
          className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="切换菜单"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* 移动端菜单 */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
          <div className="mobile-menu-content">
            {/* 用户信息区域 */}
            {isAuthenticated && (
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <p className="mobile-user-name">你好，{username}</p>
              </div>
            )}
            
            <ul>
              {navs.map(nav => (
                <li key={nav.path}>
                  <Link
                    to={nav.path}
                    className={location.pathname === nav.path ? 'active' : ''}
                    onClick={handleNavClick}
                  >
                    {nav.label}
                  </Link>
                </li>
              ))}
              
              {/* 管理员用户管理选项 */}
              {isAuthenticated && username === 'admin' && (
                <li>
                  <Link to="/registration-approval" className="mobile-admin-link" onClick={handleNavClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>用户管理</span>
                    {pendingCount > 0 && (
                      <span className="mobile-badge">{pendingCount}</span>
                    )}
                  </Link>
                </li>
              )}
              
              {/* 登录/退出选项 */}
              {isAuthenticated ? (
                <li>
                  <button className="mobile-logout-button" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    退出登录
                  </button>
                </li>
              ) : (
                <li>
                  <Link to="/login" className="mobile-login-link" onClick={handleNavClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    登录
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 