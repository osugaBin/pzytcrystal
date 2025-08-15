const AlipayService = require('../services/AlipayService');
const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');

class PaymentController {
  // 创建支付订单
  async createPayment(req, res) {
    try {
      const { amount = 5, currency = 'CNY' } = req.body;
      const userId = req.user.user_id;
      
      // 验证金额
      if (amount !== 5) {
        return res.status(400).json({ error: '只支持支付5元购买2次预测机会' });
      }
      
      // 生成订单号
      const out_trade_no = `PZYT${Date.now()}${userId}`;
      
      // 创建本地支付记录
      const payment = await Payment.create({
        user_id: userId,
        amount,
        currency,
        payment_method: 'alipay',
        prediction_count_added: 2
      });
      
      // 创建支付宝支付订单
      const alipayOrder = {
        out_trade_no: `${payment.id}_${out_trade_no}`,
        total_amount: amount.toString(),
        subject: 'PZYT水晶疗愈预测服务',
        body: '购买2次八字水晶疗愈预测服务',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        notify_url: `${process.env.BASE_URL}/api/payments/alipay/notify`
      };
      
      try {
        const alipayResult = await AlipayService.createPayment(alipayOrder);
        
        res.json({
          message: '支付订单创建成功',
          payment: {
            id: payment.id,
            amount,
            currency,
            status: 'pending',
            payment_url: alipayResult.payment_url,
            out_trade_no: alipayOrder.out_trade_no
          }
        });
      } catch (alipayError) {
        console.error('支付宝订单创建失败:', alipayError.message);
        
        // 返回模拟支付链接（用于测试）
        res.json({
          message: '支付订单创建成功（测试模式）',
          payment: {
            id: payment.id,
            amount,
            currency,
            status: 'pending',
            payment_url: `${process.env.FRONTEND_URL}/payment/mock?id=${payment.id}&amount=${amount}`,
            out_trade_no: alipayOrder.out_trade_no,
            is_mock: true
          }
        });
      }
    } catch (error) {
      console.error('创建支付订单失败:', error.message);
      res.status(500).json({ error: '支付订单创建失败' });
    }
  }
  
  // 模拟支付成功（用于测试）
  async mockPaymentSuccess(req, res) {
    try {
      const { payment_id } = req.body;
      const userId = req.user.user_id;
      
      const payment = await Payment.findById(payment_id);
      if (!payment || payment.user_id !== userId) {
        return res.status(404).json({ error: '支付记录不存在' });
      }
      
      if (payment.status !== 'pending') {
        return res.status(400).json({ error: '支付已处理' });
      }
      
      // 更新支付状态
      await Payment.updateStatus(payment_id, 'success', `mock_${Date.now()}`);
      
      // 增加预测次数
      await User.updatePredictionCount(userId, payment.prediction_count_added);
      
      res.json({
        message: '支付成功（模拟）',
        payment: {
          id: payment_id,
          status: 'success',
          prediction_count_added: payment.prediction_count_added
        }
      });
    } catch (error) {
      console.error('模拟支付失败:', error.message);
      res.status(500).json({ error: '支付处理失败' });
    }
  }
  
  // 支付宝支付回调
  async alipayNotify(req, res) {
    try {
      console.log('收到支付宝回调:', req.body);
      
      // 验证签名
      const isValid = AlipayService.verifyNotification(req.body);
      if (!isValid) {
        console.error('支付宝回调签名验证失败');
        return res.status(400).send('FAIL');
      }
      
      const { trade_status, out_trade_no, trade_no, total_amount } = req.body;
      
      // 提取本地支付ID
      const [paymentId] = out_trade_no.split('_');
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        console.error('支付记录不存在:', out_trade_no);
        return res.status(400).send('FAIL');
      }
      
      // 处理支付结果
      if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
        // 支付成功
        if (payment.status !== 'success') {
          await Payment.updateStatus(paymentId, 'success', trade_no);
          await User.updatePredictionCount(payment.user_id, payment.prediction_count_added);
          console.log(`支付成功，用户${payment.user_id}增加${payment.prediction_count_added}次预测`);
        }
      } else if (trade_status === 'TRADE_CLOSED') {
        // 支付关闭
        await Payment.updateStatus(paymentId, 'failed', trade_no);
      }
      
      res.send('SUCCESS');
    } catch (error) {
      console.error('处理支付宝回调失败:', error.message);
      res.status(500).send('FAIL');
    }
  }
  
  // 查询支付状态
  async getPaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.user_id;
      
      const payment = await Payment.findById(id);
      if (!payment || payment.user_id !== userId) {
        return res.status(404).json({ error: '支付记录不存在' });
      }
      
      res.json({ payment });
    } catch (error) {
      console.error('查询支付状态失败:', error.message);
      res.status(500).json({ error: '查询失败' });
    }
  }
  
  // 获取用户支付历史
  async getUserPayments(req, res) {
    try {
      const userId = req.user.user_id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const payments = await Payment.getUserPayments(userId, limit, offset);
      
      res.json({
        payments,
        pagination: {
          page,
          limit,
          total: payments.length
        }
      });
    } catch (error) {
      console.error('获取支付历史失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
}

module.exports = new PaymentController();