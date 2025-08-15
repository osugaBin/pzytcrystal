const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // 用户注册
  async register(req, res) {
    try {
      const { email, password, full_name } = req.body;
      
      // 验证输入
      if (!email || !password) {
        return res.status(400).json({ error: '邮箱和密码不能为空' });
      }
      
      // 检查用户是否已存在
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: '该邮箱已被注册' });
      }
      
      // 创建用户
      const user = await User.create({ email, password, full_name });
      
      // 生成JWT Token
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      
      res.status(201).json({
        message: '注册成功',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          prediction_count: user.prediction_count
        },
        token
      });
    } catch (error) {
      console.error('注册失败:', error.message);
      res.status(500).json({ error: '注册失败，请稍后再试' });
    }
  }
  
  // 用户登录
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // 验证输入
      if (!email || !password) {
        return res.status(400).json({ error: '邮箱和密码不能为空' });
      }
      
      // 查找用户
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: '邮箱或密码错误' });
      }
      
      // 验证密码
      const isValidPassword = await User.validatePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: '邮箱或密码错误' });
      }
      
      // 生成JWT Token
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      
      res.json({
        message: '登录成功',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          prediction_count: user.prediction_count
        },
        token
      });
    } catch (error) {
      console.error('登录失败:', error.message);
      res.status(500).json({ error: '登录失败，请稍后再试' });
    }
  }
  
  // 获取当前用户信息
  async getCurrentUser(req, res) {
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
  }
  
  // 验证Token
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Token不存在' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user_id);
      
      if (!user) {
        return res.status(401).json({ error: '用户不存在' });
      }
      
      res.json({ valid: true, user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(401).json({ valid: false, error: 'Token无效' });
    }
  }
}

module.exports = new AuthController();