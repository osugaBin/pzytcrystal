import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/apiService';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化时检查用户认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('pzyt_token');
        if (token) {
          const userData = await authApi.getCurrentUser();
          setUser(userData.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('初始化认证失败:', error);
        localStorage.removeItem('pzyt_token');
        localStorage.removeItem('pzyt_user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      
      localStorage.setItem('pzyt_token', response.token);
      localStorage.setItem('pzyt_user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success(response.message || '登录成功！');
      return { success: true, user: response.user };
    } catch (error) {
      console.error('登录失败:', error);
      const message = error.response?.data?.error || '登录失败，请重试';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      
      localStorage.setItem('pzyt_token', response.token);
      localStorage.setItem('pzyt_user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success(response.message || '注册成功！');
      return { success: true, user: response.user };
    } catch (error) {
      console.error('注册失败:', error);
      const message = error.response?.data?.error || '注册失败，请重试';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const logout = () => {
    localStorage.removeItem('pzyt_token');
    localStorage.removeItem('pzyt_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('已安全退出');
  };

  // 更新用户信息
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('pzyt_user', JSON.stringify({ ...user, ...userData }));
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData.user);
      localStorage.setItem('pzyt_user', JSON.stringify(userData.user));
      return userData.user;
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};