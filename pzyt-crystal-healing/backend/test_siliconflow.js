const axios = require('axios');

// 测试SiliconFlow API连接
async function testSiliconFlowAPI() {
  const apiKey = '72d73a46-a892-4820-977f-12b0667da05e';
  const apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';
  
  try {
    console.log('🔄 测试SiliconFlow API连接...');
    console.log('API URL:', apiUrl);
    console.log('API Key:', apiKey.substring(0, 8) + '...');
    
    const response = await axios.post(apiUrl, {
      model: 'deepseek-ai/DeepSeek-V3',
      messages: [
        {
          role: 'user',
          content: '你好，请简单介绍一下水晶疗愈。'
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PZYT-Crystal-Healing/1.0'
      },
      timeout: 30000
    });
    
    console.log('✅ API连接成功！');
    console.log('响应状态:', response.status);
    console.log('完整响应数据:', JSON.stringify(response.data, null, 2));
    
    if (response.data.choices && response.data.choices.length > 0) {
      console.log('响应内容:', response.data.choices[0].message.content);
    } else {
      console.log('响应格式不符合预期');
    }
    
  } catch (error) {
    console.error('❌ API连接失败:');
    console.error('错误信息:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

testSiliconFlowAPI();
