const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取用户信息
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        prediction_count: user.prediction_count,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error.message);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 更新用户信息
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name } = req.body;
    const userId = req.user.user_id;
    
    // 这里可以添加更新用户信息的逻辑
    // 目前只是一个占位端点
    
    res.json({ message: '用户信息更新成功' });
  } catch (error) {
    console.error('更新用户信息失败:', error.message);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;