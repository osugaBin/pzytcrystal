const crypto = require('crypto');
const axios = require('axios');

class AlipayService {
  constructor() {
    this.appId = process.env.ALIPAY_APP_ID;
    this.privateKey = process.env.ALIPAY_PRIVATE_KEY;
    this.publicKey = process.env.ALIPAY_PUBLIC_KEY;
    this.gateway = process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do';
    this.format = 'JSON';
    this.charset = 'utf-8';
    this.signType = 'RSA2';
    this.version = '1.0';
  }

  // 创建支付订单
  async createPayment(orderData) {
    try {
      const { out_trade_no, total_amount, subject, body, return_url, notify_url } = orderData;
      
      // 构建请求参数
      const bizContent = {
        out_trade_no, // 商户订单号
        total_amount, // 支付金额
        subject, // 订单标题
        body, // 订单描述
        product_code: 'FAST_INSTANT_TRADE_PAY', // 支付产品码
        timeout_express: '10m' // 订单超时时间
      };

      const params = {
        app_id: this.appId,
        method: 'alipay.trade.page.pay',
        format: this.format,
        return_url,
        notify_url,
        charset: this.charset,
        sign_type: this.signType,
        timestamp: this.getTimestamp(),
        version: this.version,
        biz_content: JSON.stringify(bizContent)
      };

      // 生成签名
      const sign = this.generateSign(params);
      params.sign = sign;

      // 生成支付URL
      const paymentUrl = this.buildPaymentUrl(params);
      
      return {
        payment_url: paymentUrl,
        out_trade_no,
        total_amount,
        status: 'created'
      };
    } catch (error) {
      console.error('创建支付订单失败:', error.message);
      throw new Error('支付订单创建失败');
    }
  }

  // 查询支付状态
  async queryPayment(out_trade_no) {
    try {
      const bizContent = {
        out_trade_no
      };

      const params = {
        app_id: this.appId,
        method: 'alipay.trade.query',
        format: this.format,
        charset: this.charset,
        sign_type: this.signType,
        timestamp: this.getTimestamp(),
        version: this.version,
        biz_content: JSON.stringify(bizContent)
      };

      const sign = this.generateSign(params);
      params.sign = sign;

      const response = await axios.post(this.gateway, new URLSearchParams(params));
      const result = response.data.alipay_trade_query_response;

      return {
        trade_status: result.trade_status,
        trade_no: result.trade_no,
        out_trade_no: result.out_trade_no,
        total_amount: result.total_amount
      };
    } catch (error) {
      console.error('查询支付状态失败:', error.message);
      throw new Error('支付状态查询失败');
    }
  }

  // 验证支付回调签名
  verifyNotification(params) {
    try {
      const { sign, sign_type, ...otherParams } = params;
      
      if (sign_type !== this.signType) {
        return false;
      }

      const sortedParams = this.sortParams(otherParams);
      const signString = this.buildSignString(sortedParams);
      
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(signString, 'utf8');
      
      return verifier.verify(this.publicKey, sign, 'base64');
    } catch (error) {
      console.error('验证支付回调签名失败:', error.message);
      return false;
    }
  }

  // 生成时间戳
  getTimestamp() {
    const now = new Date();
    return now.getFullYear() + '-' +
           String(now.getMonth() + 1).padStart(2, '0') + '-' +
           String(now.getDate()).padStart(2, '0') + ' ' +
           String(now.getHours()).padStart(2, '0') + ':' +
           String(now.getMinutes()).padStart(2, '0') + ':' +
           String(now.getSeconds()).padStart(2, '0');
  }

  // 生成签名
  generateSign(params) {
    const sortedParams = this.sortParams(params);
    const signString = this.buildSignString(sortedParams);
    
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signString, 'utf8');
    
    return signer.sign(this.privateKey, 'base64');
  }

  // 排序参数
  sortParams(params) {
    const sorted = {};
    Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== '')
      .sort()
      .forEach(key => {
        sorted[key] = params[key];
      });
    return sorted;
  }

  // 构建签名字符串
  buildSignString(params) {
    return Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
  }

  // 构建支付URL
  buildPaymentUrl(params) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return `${this.gateway}?${queryString}`;
  }

  // 验证配置
  validateConfiguration() {
    if (!this.appId) {
      throw new Error('支付宝 App ID 未配置');
    }
    
    if (!this.privateKey) {
      throw new Error('支付宝私钥未配置');
    }
    
    if (!this.publicKey) {
      throw new Error('支付宝公钥未配置');
    }
    
    return true;
  }
}

module.exports = new AlipayService();