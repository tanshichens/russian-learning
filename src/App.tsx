import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Words from './pages/Words';
import Listening from './pages/Listening';
import Downloads from './pages/Downloads';
import Login from './pages/Login';
import RegistrationApproval from './pages/RegistrationApproval';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// 滚动到顶部的组件
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ScrollToTop />
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/registration-approval" 
              element={
                <ProtectedRoute>
                  <RegistrationApproval />
                </ProtectedRoute>
              } 
            />
            {/* 用户管理路由重定向到注册审批 */}
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute>
                  <RegistrationApproval />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/words" 
              element={
                <ProtectedRoute>
                  <Words />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/listening" 
              element={
                <ProtectedRoute>
                  <Listening />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/downloads" 
              element={
                <ProtectedRoute>
                  <Downloads />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <footer>
            <p>© 2025 俄语学习网站</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
