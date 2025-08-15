const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticateToken, rateLimit } = require('../middleware/auth');

const router = express.Router();

// 限流中间件：每15分钟最多10次请求
const authRateLimit = rateLimit(10, 15 * 60 * 1000);

// 用户注册
router.post('/register', authRateLimit, AuthController.register);

// 用户登录
router.post('/login', authRateLimit, AuthController.login);

// 获取当前用户信息
router.get('/me', authenticateToken, AuthController.getCurrentUser);

// 验证Token
router.post('/verify', AuthController.verifyToken);

module.exports = router;