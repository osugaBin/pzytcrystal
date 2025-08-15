import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Sparkles, Gem, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/', icon: Home, label: '首页' },
    { to: '/prediction', icon: Sparkles, label: '运势预测', authRequired: true },
    { to: '/crystals', icon: Gem, label: '水晶大全' },
  ];

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-purple-900/90 backdrop-blur-lg border-b border-purple-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-yellow-200">
                  PZYT
                </span>
                <div className="text-xs text-purple-300 -mt-1">水晶疗愈</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActivePath(item.to)
                      ? 'bg-purple-700 text-white'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="text-right">
                    <p className="text-purple-200 text-sm">{user.full_name || user.email}</p>
                    <p className="text-purple-300 text-xs">预测次数: {user.prediction_count}</p>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Link
                    to="/dashboard"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isActivePath('/dashboard')
                        ? 'bg-purple-700 text-white'
                        : 'text-purple-200 hover:text-white hover:bg-purple-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-purple-200 hover:text-white hover:bg-purple-800 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-purple-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-purple-200 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-purple-900/95 backdrop-blur-lg border-t border-purple-700/50"
        >
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActivePath(item.to)
                      ? 'bg-purple-700 text-white'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="px-3 py-2 border-t border-purple-700/50 mt-3 pt-3">
                    <p className="text-purple-200 text-sm">{user.full_name || user.email}</p>
                    <p className="text-purple-300 text-xs">预测次数: {user.prediction_count}</p>
                  </div>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActivePath('/dashboard')
                      ? 'bg-purple-700 text-white'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>个人中心</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-800 transition-all duration-300 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </>
            ) : (
              <div className="border-t border-purple-700/50 mt-3 pt-3 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-purple-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-lg text-center transition-all duration-300"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;