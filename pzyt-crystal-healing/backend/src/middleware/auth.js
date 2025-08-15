const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT认证中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: '访问被拒绝，缺少认证Token' });
    }
    
    // 验证Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 验证用户是否存在
    const user = await User.findById(decoded.user_id);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token无效' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token已过期' });
    } else {
      console.error('认证中间件错误:', error.message);
      return res.status(500).json({ error: '服务器错误' });
    }
  }
};

// 可选认证中间件（不强制要求登录）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user_id);
      if (user) {
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // 忽略认证错误，继续执行
    next();
  }
};

// 限流中间件
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(clientId)) {
      requests.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const clientData = requests.get(clientId);
    
    if (now > clientData.resetTime) {
      // 重置窗口
      requests.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({ 
        error: '请求过于频繁，请稍后再试',
        retry_after: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
};

// 验证预测次数中间件
const checkPredictionCount = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const user = await User.findById(userId);
    
    if (!user || user.prediction_count <= 0) {
      return res.status(402).json({
        error: '预测次数不足',
        need_payment: true,
        message: '您的预测次数已用完，请购买更多次数'
      });
    }
    
    req.user.prediction_count = user.prediction_count;
    next();
  } catch (error) {
    console.error('验证预测次数失败:', error.message);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  rateLimit,
  checkPredictionCount
};