const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const { authenticateToken, optionalAuth, rateLimit } = require('../middleware/auth');

const router = express.Router();

// 限流中间件
const paymentRateLimit = rateLimit(20, 15 * 60 * 1000);

// 创建支付订单
router.post('/', authenticateToken, paymentRateLimit, PaymentController.createPayment);

// 模拟支付成功（用于测试）
router.post('/mock/success', authenticateToken, PaymentController.mockPaymentSuccess);

// 支付宝支付回调（不需要认证）
router.post('/alipay/notify', PaymentController.alipayNotify);

// 查询支付状态
router.get('/:id', authenticateToken, PaymentController.getPaymentStatus);

// 获取用户支付历史
router.get('/', authenticateToken, PaymentController.getUserPayments);

module.exports = router;