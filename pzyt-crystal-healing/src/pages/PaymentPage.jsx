import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentApi } from '../services/apiService';
import { CreditCard, Check, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      const response = await paymentApi.createPayment(5);
      setPaymentData(response.payment);
      
      if (response.payment.is_mock) {
        // 模拟支付流程
        toast.success('进入模拟支付流程');
        setPaymentStatus('processing');
      } else {
        // 真实支付宝支付
        window.open(response.payment.payment_url, '_blank');
        setPaymentStatus('processing');
      }
    } catch (error) {
      console.error('创建支付订单失败:', error);
      const message = error.response?.data?.error || '支付创建失败，请稍后再试';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMockPayment = async () => {
    if (!paymentData || !paymentData.is_mock) return;
    
    try {
      setLoading(true);
      const response = await paymentApi.mockPaymentSuccess(paymentData.id);
      
      toast.success('支付成功！');
      setPaymentStatus('success');
      
      // 刷新用户信息
      await refreshUser();
      
      // 3秒后跳转
      setTimeout(() => {
        navigate('/prediction');
      }, 3000);
    } catch (error) {
      console.error('模拟支付失败:', error);
      setPaymentStatus('failed');
      toast.error('支付失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              正在处理支付
            </h2>
            
            {paymentData?.is_mock ? (
              <div>
                <p className="text-purple-200 mb-6">
                  这是一个模拟支付流程，点击下方按钮模拟支付成功。
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMockPayment}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? '处理中...' : '模拟支付成功'}
                </motion.button>
              </div>
            ) : (
              <div>
                <p className="text-purple-200 mb-4">
                  请在新打开的窗口中完成支付宝支付。
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setPaymentStatus('success')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    支付完成
                  </button>
                  <button
                    onClick={() => setPaymentStatus('pending')}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    取消支付
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        );
        
      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              支付成功！
            </h2>
            <p className="text-purple-200 mb-6">
              恭喜您获得了2次预测机会，即将跳转到预测页面...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </motion.div>
        );
        
      case 'failed':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              支付失败
            </h2>
            <p className="text-purple-200 mb-6">
              支付过程中出现问题，请稍后重试。
            </p>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              重新开始
            </button>
          </motion.div>
        );
        
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              购买预测次数
            </h2>
            
            {/* 用户信息 */}
            {user && (
              <div className="bg-purple-800/30 rounded-lg p-4 mb-6">
                <p className="text-purple-200 mb-1">
                  当前用户：{user.full_name || user.email}
                </p>
                <p className="text-purple-300 text-sm">
                  剩余预测次数：{user.prediction_count}
                </p>
              </div>
            )}
            
            {/* 价格卡片 */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">特惠套餐</h3>
              </div>
              
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                ￥5
              </div>
              
              <p className="text-white text-xl mb-4">
                获得 <span className="font-bold text-yellow-400">2次</span> 预测机会
              </p>
              
              <div className="space-y-2 text-sm text-purple-200 mb-6">
                <div className="flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  八字命理分析
                </div>
                <div className="flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  AI智能水晶推荐
                </div>
                <div className="flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  个性化疗愈方案
                </div>
                <div className="flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  风水布置建议
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePayment}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    创建支付订单...
                  </>
                ) : (
                  '立即支付'
                )}
              </motion.button>
            </div>
            
            {/* 安全提示 */}
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/30">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-200 font-medium">安全支付</span>
              </div>
              <p className="text-blue-300 text-sm">
                支付由支付宝提供安全保障，您的资金安全可靠。
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: 'url(/images/purple_amethyst_crystal_healing_background.jpg)'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {renderPaymentContent()}
          
          {/* 返回按钮 */}
          {paymentStatus === 'pending' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(-1)}
                className="text-purple-300 hover:text-purple-200 underline"
              >
                返回上一页
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;