import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { predictionApi, paymentApi } from '../services/apiService';
import { Sparkles, Calendar, Eye, CreditCard, Plus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('predictions');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [predictionsRes, paymentsRes] = await Promise.all([
        predictionApi.getUserPredictions(),
        paymentApi.getUserPayments()
      ]);
      
      setPredictions(predictionsRes.predictions || []);
      setPayments(paymentsRes.payments || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrediction = (prediction) => {
    navigate('/prediction/result', { 
      state: { 
        prediction,
        remaining_predictions: user?.prediction_count || 0
      } 
    });
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'success': return '成功';
      case 'pending': return '处理中';
      case 'failed': return '失败';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pt-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            个人中心
          </h1>
          <p className="text-purple-200">
            管理您的预测历史和账户信息
          </p>
        </motion.div>

        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">
                欢迎，{user?.full_name || user?.email}
              </h2>
              <p className="text-purple-200">
                注册时间：{user?.created_at ? format(new Date(user.created_at), 'yyyy-MM-dd') : '未知'}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{user?.prediction_count || 0}</div>
                <div className="text-purple-200 text-sm">剩余预测次数</div>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/prediction')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  新预测
                </motion.button>
                
                {user?.prediction_count <= 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/payment')}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    购买
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 标签页 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl"
        >
          {/* 标签头 */}
          <div className="border-b border-white/20">
            <div className="flex space-x-0">
              <button
                onClick={() => setActiveTab('predictions')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'predictions'
                    ? 'text-white bg-purple-600/50 border-b-2 border-purple-400'
                    : 'text-purple-200 hover:text-white hover:bg-purple-800/30'
                }`}
              >
                <Sparkles className="w-5 h-5 inline-block mr-2" />
                预测历史
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'payments'
                    ? 'text-white bg-purple-600/50 border-b-2 border-purple-400'
                    : 'text-purple-200 hover:text-white hover:bg-purple-800/30'
                }`}
              >
                <CreditCard className="w-5 h-5 inline-block mr-2" />
                支付记录
              </button>
            </div>
          </div>

          {/* 标签内容 */}
          <div className="p-6">
            {activeTab === 'predictions' && (
              <div>
                {predictions.length > 0 ? (
                  <div className="space-y-4">
                    {predictions.map((prediction, index) => (
                      <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30 hover:bg-purple-800/40 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Calendar className="w-4 h-4 text-purple-300" />
                              <span className="text-white font-medium">
                                {format(new Date(prediction.created_at), 'yyyy-MM-dd HH:mm')}
                              </span>
                            </div>
                            
                            <div className="text-purple-200 text-sm space-y-1">
                              <p>出生日期：{prediction.birth_date}</p>
                              <p>出生地点：{prediction.birth_location}</p>
                              {prediction.fortune_analysis?.fortune?.overall && (
                                <p>综合运势：{prediction.fortune_analysis.fortune.overall}分</p>
                              )}
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewPrediction(prediction)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            查看
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      还没有预测记录
                    </h3>
                    <p className="text-purple-200 mb-6">
                      开始您的第一次八字运势预测吧！
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/prediction')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 inline-block mr-2" />
                      立即预测
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment, index) => (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <Calendar className="w-4 h-4 text-purple-300" />
                              <span className="text-white font-medium">
                                {format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm')}
                              </span>
                            </div>
                            
                            <div className="text-purple-200 text-sm">
                              <p>支付金额：￥{payment.amount}</p>
                              <p>获得次数：{payment.prediction_count_added}次</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-semibold ${getPaymentStatusColor(payment.status)}`}>
                              {getPaymentStatusText(payment.status)}
                            </div>
                            <div className="text-purple-300 text-xs">
                              {payment.payment_method}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      暂无支付记录
                    </h3>
                    <p className="text-purple-200 mb-6">
                      您还没有任何购买记录。
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/payment')}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 inline-block mr-2" />
                      购买预测次数
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;