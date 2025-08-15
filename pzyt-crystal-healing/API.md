# PZYT水晶疗愈网站 - API文档

## 🛡️ 认证

所有需要认证的接口都需要在请求头中包含JWT Token：

```
Authorization: Bearer <token>
```

## 👥 用户认证 API

### POST /api/auth/register
**用户注册**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "张三"
}
```

**响应：**
```json
{
  "message": "注册成功",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "张三",
    "prediction_count": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login
**用户登录**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**
```json
{
  "message": "登录成功",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "张三",
    "prediction_count": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/auth/me
**获取当前用户信息** 🔒

**响应：**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "张三",
    "prediction_count": 1,
    "created_at": "2025-08-15T10:30:00.000Z"
  }
}
```

### POST /api/auth/verify
**验证Token有效性**

请求头必须包含：`Authorization: Bearer <token>`

**响应：**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

## 🔮 运势API

### POST /api/predictions
**创建运势预测** 🔒

```json
{
  "birth_date": "1990-01-15",
  "birth_time": "14:30",
  "birth_location": "北京市",
  "gender": "male"
}
```

**响应：**
```json
{
  "prediction": {
    "id": 1,
    "bazi_result": {
      "bazi": {
        "year": {
          "heavenly": "庚",
          "earthly": "午",
          "element": "金",
          "zodiac": "马"
        },
        "month": {...},
        "day": {...},
        "hour": {...}
      },
      "elementAnalysis": {
        "elementCount": { "木": 1, "火": 2, "土": 1, "金": 2, "水": 2 },
        "strongest": "火",
        "weakest": "木",
        "needStrengthening": [],
        "balance": 85
      },
      "fortune": {
        "career": 78,
        "wealth": 85,
        "health": 72,
        "relationship": 68,
        "overall": 76
      }
    },
    "ai_analysis": {
      "mainIssues": "主要问题分析...",
      "crystalRecommendations": [
        {
          "chinese_name": "紫水晶",
          "english_name": "Amethyst",
          "reason": "推荐理由..."
        }
      ],
      "wearingAdvice": "佩带建议...",
      "expectedEffects": "预期效果...",
      "additionalAdvice": "额外建议..."
    },
    "created_at": "2025-08-15T10:30:00.000Z"
  },
  "remaining_count": 0
}
```

### GET /api/predictions
**获取用户预测历史** 🔒

查询参数：
- `page`: 页码（默认: 1）
- `limit`: 每页数量（默认: 10）

**响应：**
```json
{
  "predictions": [
    {
      "id": 1,
      "birth_date": "1990-01-15",
      "birth_time": "14:30",
      "birth_location": "北京市",
      "fortune_scores": {
        "career": 78,
        "wealth": 85,
        "health": 72,
        "relationship": 68,
        "overall": 76
      },
      "created_at": "2025-08-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 45,
    "has_next": true
  }
}
```

### GET /api/predictions/:id
**获取单个预测详情** 🔒

**响应：**
```json
{
  "prediction": {
    "id": 1,
    "birth_date": "1990-01-15",
    "birth_time": "14:30",
    "birth_location": "北京市",
    "bazi_result": "{完整八字分析结果}",
    "ai_analysis": "{完整AI分析结果}",
    "created_at": "2025-08-15T10:30:00.000Z"
  }
}
```

## 💰 支付API

### POST /api/payments/create
**创建支付订单** 🔒

```json
{
  "amount": 5.00,
  "prediction_count": 2
}
```

**响应：**
```json
{
  "payment": {
    "id": 1,
    "order_id": "PZYT_20250815103000_001",
    "amount": 5.00,
    "prediction_count": 2,
    "status": "pending",
    "payment_url": "https://qr.alipay.com/xxx",
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

### GET /api/payments/:id/status
**查询支付状态** 🔒

**响应：**
```json
{
  "payment": {
    "id": 1,
    "order_id": "PZYT_20250815103000_001",
    "status": "completed",
    "amount": 5.00,
    "prediction_count": 2,
    "paid_at": "2025-08-15T10:32:00.000Z"
  }
}
```

### POST /api/payments/alipay/notify
**支付宝支付通知回调** ⚙️

此接口由支付宝系统调用，用于处理支付结果通知。

### GET /api/payments
**获取用户支付历史** 🔒

**响应：**
```json
{
  "payments": [
    {
      "id": 1,
      "order_id": "PZYT_20250815103000_001",
      "amount": 5.00,
      "prediction_count": 2,
      "status": "completed",
      "created_at": "2025-08-15T10:30:00.000Z",
      "paid_at": "2025-08-15T10:32:00.000Z"
    }
  ]
}
```

## 💎 水晶API

### GET /api/crystals
**获取所有水晶信息**

查询参数：
- `category`: 水晶类别过滤
- `five_elements`: 五行属性过滤
- `suitable_for`: 适用情况过滤

**响应：**
```json
{
  "crystals": [
    {
      "id": 1,
      "name": "Amethyst",
      "chinese_name": "紫水晶",
      "category": "石英类",
      "color": "紫色",
      "five_elements": ["水"],
      "healing_properties": ["净化意念", "增强直觉", "平静心灵", "改善睡眠"],
      "suitable_for": ["健康运", "感情运", "灵性提升"],
      "image_url": "/images/purple_amethyst_raw_crystal_stone_display.jpg",
      "price": 88.00,
      "description": "紫水晶被誉为“智慧之石”，能够净化心灵，增强直觉力，帮助保持内心平静。"
    }
  ]
}
```

### GET /api/crystals/:id
**获取单个水晶详情**

**响应：**
```json
{
  "crystal": {
    "id": 1,
    "name": "Amethyst",
    "chinese_name": "紫水晶",
    "category": "石英类",
    "color": "紫色",
    "five_elements": ["水"],
    "healing_properties": ["净化意念", "增强直觉", "平静心灵", "改善睡眠"],
    "suitable_for": ["健康运", "感情运", "灵性提升"],
    "image_url": "/images/purple_amethyst_raw_crystal_stone_display.jpg",
    "price": 88.00,
    "description": "紫水晶被誉为“智慧之石”，能够净化心灵，增强直觉力，帮助保持内心平静。",
    "usage_guide": "佩带在左手或放置在卧室，每日冥想10-15分钟。",
    "precautions": "避免高温暴晒，定期用清水净化。"
  }
}
```

### POST /api/crystals/recommend
**根据五行分析推荐水晶** 🔒

```json
{
  "element_analysis": {
    "elementCount": { "木": 1, "火": 2, "土": 1, "金": 2, "水": 2 },
    "needStrengthening": ["木"],
    "strongest": "火",
    "weakest": "木"
  },
  "fortune_issues": ["career", "health"]
}
```

**响应：**
```json
{
  "recommendations": [
    {
      "crystal": {
        "id": 5,
        "chinese_name": "绿东陵石",
        "name": "Green Aventurine",
        "five_elements": ["木"]
      },
      "reason": "您的八字中木元素不足，绿东陵石属木，能够平衡您的五行能量。",
      "priority": "high"
    }
  ]
}
```

## 🏥 系统 API

### GET /api/health
**系统健康检查**

**响应：**
```json
{
  "status": "ok",
  "message": "PZYT水晶疗愈API服务正常运行",
  "timestamp": "2025-08-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### GET /api/health/db
**数据库连接检查**

**响应：**
```json
{
  "database": "connected",
  "tables": [
    "users",
    "predictions", 
    "payments",
    "crystals"
  ],
  "timestamp": "2025-08-15T10:30:00.000Z"
}
```

## 🚨 错误处理

所有API错误都会返回以下格式：

```json
{
  "error": "错误消息描述",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-15T10:30:00.000Z"
}
```

### 常见错误码

- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未提供有效的认证Token
- `402 Payment Required`: 预测次数不足，需要支付
- `403 Forbidden`: Token无效或已过期
- `404 Not Found`: 资源不存在
- `429 Too Many Requests`: 请求过于频繁
- `500 Internal Server Error`: 服务器内部错误

## 🔑 认证错误

当Token无效或过期时：

```json
{
  "error": "Token无效或已过期",
  "code": "TOKEN_INVALID",
  "need_reauth": true
}
```

当预测次数不足时：

```json
{
  "error": "预测次数不足",
  "code": "INSUFFICIENT_PREDICTIONS",
  "need_payment": true,
  "message": "您的预测次数已用完，请购买更多次数"
}
```

## 🔄 限流机制

- **认证接口**: 每15分钟最多10次请求
- **预测接口**: 每小时最多5次请求
- **支付接口**: 每小时最多3次请求
- **其他接口**: 每小时最多100次请求

---

**作者**: MiniMax Agent  
**更新日期**: 2025-08-15  
**API版本**: v1.0.0
