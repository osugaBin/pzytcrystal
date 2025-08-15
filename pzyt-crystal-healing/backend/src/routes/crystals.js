const express = require('express');
const CrystalController = require('../controllers/CrystalController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 获取所有水晶（公开接口）
router.get('/', optionalAuth, CrystalController.getAllCrystals);

// 搜索水晶（公开接口）
router.get('/search', optionalAuth, CrystalController.searchCrystals);

// 获取水晶统计信息（公开接口）
router.get('/stats', optionalAuth, CrystalController.getCrystalStats);

// 根据五行获取水晶（公开接口）
router.get('/element/:element', optionalAuth, CrystalController.getCrystalsByElement);

// 根据疗愈属性获取水晶（公开接口）
router.get('/healing/:property', optionalAuth, CrystalController.getCrystalsByHealingProperty);

// 根据ID获取水晶详情（公开接口）
router.get('/:id', optionalAuth, CrystalController.getCrystalById);

module.exports = router;