import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navs = [
  { path: '/', label: '首页' },
  { path: '/words', label: '单词库' },
  { path: '/listening', label: '真题精听' },
  { path: '/downloads', label: '真题下载' },
];

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header>
      <nav id="navbar">
        <div className="logo">柚子带你学俄语</div>
        <div className="nav-links">
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
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 