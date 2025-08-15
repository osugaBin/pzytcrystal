import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  email: yup.string().email('请输入有效的邮箱地址').required('邮箱不能为空'),
  password: yup.string().required('密码不能为空'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: 'url(/images/mystical_purple_amethyst_healing_crystal_background.jpg)'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-yellow-200">
              PZYT
            </h1>
            <p className="text-purple-200 mt-2">水晶运势疗愈</p>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-6">
            欢迎回来
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 邮箱 */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="请输入邮箱地址"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* 提交按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </motion.button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-purple-200">
              还没有账户？
              <Link
                to="/register"
                className="text-purple-300 hover:text-purple-200 font-medium ml-1 underline"
              >
                立即注册
              </Link>
            </p>
          </div>

          {/* 返回首页 */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-purple-300 hover:text-purple-200 text-sm underline"
            >
              返回首页
            </Link>
          </div>

          {/* 演示信息 */}
          <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-600/30">
            <p className="text-blue-200 text-sm text-center mb-2">
              🎆 演示账户信息
            </p>
            <div className="text-xs text-blue-300 space-y-1">
              <p>邮箱: demo@pzyt.com</p>
              <p>密码: 123456</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;