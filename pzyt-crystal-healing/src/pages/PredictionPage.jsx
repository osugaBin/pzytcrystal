import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { predictionApi } from '../services/apiService';
import { Calendar, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

const schema = yup.object({
  birth_date: yup.string().required('请选择出生日期'),
  birth_time: yup.string().required('请选择出生时间'),
  birth_location: yup.string().required('请输入出生地点'),
});

const PredictionPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPredictionCost, setShowPredictionCost] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (user?.prediction_count <= 0) {
      setShowPredictionCost(true);
      return;
    }

    try {
      setLoading(true);
      const response = await predictionApi.createPrediction(data);
      
      toast.success('预测生成成功！');
      
      // 刷新用户信息
      await refreshUser();
      
      // 跳转到结果页面
      navigate('/prediction/result', { 
        state: { 
          prediction: response.prediction,
          remaining_predictions: response.remaining_predictions 
        } 
      });
    } catch (error) {
      console.error('创建预测失败:', error);
      
      if (error.response?.status === 402) {
        // 预测次数不足
        setShowPredictionCost(true);
      } else {
        const message = error.response?.data?.error || '预测生成失败，请稍后再试';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    navigate('/payment');
  };

  if (showPredictionCost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              预测次数不足
            </h2>
            <p className="text-purple-200">
              您的预测次数已用完，请购买更多次数继续体验。
            </p>
          </div>

          <div className="bg-purple-800/30 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              特惠价格
            </h3>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              ￥5
            </div>
            <p className="text-purple-200 text-sm">
              获取 2 次预测机会
            </p>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              立即购买
            </motion.button>
            
            <button
              onClick={() => setShowPredictionCost(false)}
              className="w-full py-3 bg-transparent border border-purple-400 text-purple-200 font-semibold rounded-lg hover:bg-purple-400 hover:text-white transition-all duration-300"
            >
              返回
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pt-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            八字运势预测
          </h1>
          <p className="text-purple-200 text-lg">
            请填写您的出生信息，获取个性化的水晶疗愈方案
          </p>
        </motion.div>

        {/* 用户信息 */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200">
                  欢迎，{user.full_name || user.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-purple-300 text-sm">剩余预测次数</p>
                <p className="text-yellow-400 font-bold text-lg">{user.prediction_count}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 预测表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 出生日期 */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                出生日期
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('birth_date')}
                  type="date"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              {errors.birth_date && (
                <p className="text-red-300 text-sm mt-1">{errors.birth_date.message}</p>
              )}
            </div>

            {/* 出生时间 */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                出生时间
              </label>
              <div className="relative">
                <Clock className="w-5 h-5 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('birth_time')}
                  type="time"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              {errors.birth_time && (
                <p className="text-red-300 text-sm mt-1">{errors.birth_time.message}</p>
              )}
            </div>

            {/* 出生地点 */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                出生地点
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-purple-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('birth_location')}
                  type="text"
                  placeholder="例如：北京市朝阳区"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              {errors.birth_location && (
                <p className="text-red-300 text-sm mt-1">{errors.birth_location.message}</p>
              )}
            </div>

            {/* 提示信息 */}
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/30">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-200 font-medium mb-1">温馨提示</h4>
                  <p className="text-blue-300 text-sm">
                    请尽量提供准确的出生信息，这将影响预测的准确性。如果不确定具体时间，可以选择中午时分。
                  </p>
                </div>
              </div>
            </div>

            {/* 提交按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  正在生成预测...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  开始预测
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionPage;