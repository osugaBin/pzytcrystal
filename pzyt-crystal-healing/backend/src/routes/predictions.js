const express = require('express');
const PredictionController = require('../controllers/PredictionController');
const { authenticateToken, rateLimit } = require('../middleware/auth');

const router = express.Router();

// 限流中间件：每小时最多5次预测
const predictionRateLimit = rateLimit(5, 60 * 60 * 1000);

// 创建预测
router.post('/', authenticateToken, predictionRateLimit, PredictionController.createPrediction);

// 获取用户预测历史
router.get('/', authenticateToken, PredictionController.getUserPredictions);

// 获取单个预测详情
router.get('/:id', authenticateToken, PredictionController.getPredictionById);

module.exports = router;