import api from './api';

export const authApi = {
  // 用户注册
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // 用户登录
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // 验证token
  verifyToken: async () => {
    const response = await api.post('/auth/verify');
    return response.data;
  },
};

export const predictionApi = {
  // 创建预测
  createPrediction: async (predictionData) => {
    const response = await api.post('/predictions', predictionData);
    return response.data;
  },

  // 获取用户预测历史
  getUserPredictions: async (page = 1, limit = 10) => {
    const response = await api.get(`/predictions?page=${page}&limit=${limit}`);
    return response.data;
  },

  // 获取单个预测详情
  getPredictionById: async (id) => {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  },
};

export const paymentApi = {
  // 创建支付订单
  createPayment: async (amount = 5) => {
    const response = await api.post('/payments', { amount });
    return response.data;
  },

  // 模拟支付成功（用于测试）
  mockPaymentSuccess: async (paymentId) => {
    const response = await api.post('/payments/mock/success', { payment_id: paymentId });
    return response.data;
  },

  // 查询支付状态
  getPaymentStatus: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // 获取用户支付历史
  getUserPayments: async (page = 1, limit = 10) => {
    const response = await api.get(`/payments?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export const crystalApi = {
  // 获取所有水晶
  getAllCrystals: async () => {
    const response = await api.get('/crystals');
    return response.data;
  },

  // 根据ID获取水晶详情
  getCrystalById: async (id) => {
    const response = await api.get(`/crystals/${id}`);
    return response.data;
  },

  // 根据五行获取水晶
  getCrystalsByElement: async (element) => {
    const response = await api.get(`/crystals/element/${element}`);
    return response.data;
  },

  // 搜索水晶
  searchCrystals: async (keyword) => {
    const response = await api.get(`/crystals/search?q=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // 获取水晶统计信息
  getCrystalStats: async () => {
    const response = await api.get('/crystals/stats');
    return response.data;
  },
};

export const userApi = {
  // 获取用户资料
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // 更新用户资料
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};