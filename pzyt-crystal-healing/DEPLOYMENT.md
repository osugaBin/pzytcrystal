# PZYT水晶疗愈网站 - 部署指南

## 🚀 快速部署

### 前置条件
- Node.js 18+
- Git
- 支付宝开放平台账号
- SiliconFlow API账号

### 1. 克隆项目
```bash
git clone https://github.com/your-username/pzyt-crystal-healing.git
cd pzyt-crystal-healing
```

### 2. 环境变量配置

#### 后端环境变量
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，填入必要的API密钥
```

#### 前端环境变量
```bash
cd ..
cp .env.example .env
# 编辑 .env 文件，配置后端API地址
```

### 3. 本地开发

#### 启动后端
```bash
cd backend
npm install
npm run seed  # 初始化数据库
npm run dev
```

#### 启动前端
```bash
# 新窗口
cd ..
pnpm install
pnpm dev
```

访问: http://localhost:5173

---

## 🌐 生产部署

### 方案A: Cloudflare Pages + Railway

#### 1. 后端部署到Railway

1. 访问 [Railway.app](https://railway.app)
2. 连接GitHub仓库
3. 选择 `backend` 目录部署
4. 设置环境变量：
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your_strong_jwt_secret
   SILICONFLOW_API_KEY=your_siliconflow_key
   ALIPAY_APP_ID=your_alipay_app_id
   ALIPAY_PRIVATE_KEY=your_alipay_private_key
   ALIPAY_PUBLIC_KEY=your_alipay_public_key
   ```
5. 部署完成后获取后端域名

#### 2. 前端部署到Cloudflare Pages

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 "Pages" -> "Create a project"
3. 连接GitHub仓库
4. 配置构建设置：
   - 构建命令：`pnpm install && pnpm build`
   - 输出目录：`dist`
   - Node.js版本：`18`
5. 设置环境变量：
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app
   ```
6. 部署完成

### 方案B: Vercel + Railway

#### 1. 后端部署到Railway（同上）

#### 2. 前端部署到Vercel

1. 访问 [Vercel.com](https://vercel.com)
2. 连接GitHub仓库
3. 配置项目设置：
   - Framework Preset：`Vite`
   - Root Directory：`./`
   - Build Command：`pnpm build`
   - Output Directory：`dist`
4. 设置环境变量：
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app
   ```
5. 部署完成

### 方案C: Docker部署

#### 1. 构建镜像
```bash
# 构建后端镜像
cd backend
docker build -t pzyt-backend .

# 构建前端镜像
cd ..
docker build -t pzyt-frontend .
```

#### 2. 使用Docker Compose
```bash
# 配置环境变量
cp .env.example .env
cp backend/.env.example backend/.env
# 编辑环境变量文件

# 启动服务
docker-compose up -d
```

访问: http://localhost:3000

---

## 🔑 API密钥获取

### SiliconFlow API
1. 访问 [SiliconFlow官网](https://siliconflow.cn)
2. 注册账号并登录
3. 进入控制台获取API Key
4. 将API Key设置为环境变量 `SILICONFLOW_API_KEY`

### 支付宝支付
1. 访问 [Alipay开放平台](https://open.alipay.com)
2. 注册开发者账号
3. 创建应用获取 `APP_ID`
4. 生成RSA2密钥对
5. 在环境变量中配置相关参数

---

## 🛠️ 维护和更新

### 日志查看
```bash
# Railway日志
railway logs

# Docker日志
docker-compose logs -f

# 本地日志
cd backend
npm run dev
```

### 数据库管理
```bash
# 重新初始化数据库
cd backend
npm run seed

# 备份数据库（SQLite）
cp src/database/pzyt.db backup/pzyt_backup_$(date +%Y%m%d).db
```

### 更新部署
```bash
# 推送代码到GitHub触发自动部署
git add .
git commit -m "Update: 功能优化"
git push origin main

# 手动重新部署后端（Railway）
railway up

# 手动重新部署前端（Cloudflare Pages）
# 在Cloudflare Pages控制台点击 "Retry deployment"
```

---

## 📊 监控和性能

### 健康检查
- 后端健康检查：`GET /api/health`
- 数据库连接检查：`GET /api/health/db`

### 性能优化
- 开启Gzip压缩
- 静态资源CDN加速
- 数据库查询优化
- API响应缓存

### 日志分析
- 使用Railway内置日志系统
- Cloudflare Pages Analytics
- 自定义错误追踪

---

## 🔒 安全性

### SSL/TLS
- Cloudflare自动配置SSL证书
- Railway提供免费HTTPS

### 环境变量保护
- 所有API密钥必须通过环境变量设置
- 不在代码中硬编码敏感信息
- 使用强密码保护JWT Secret

### 数据备份
- 定期备份数据库
- 重要配置文件版本控制
- 用户数据加密存储

---

## 🐛 故障排除

### 常见问题

**Q: SiliconFlow API调用失败**
A: 
- 检查API Key是否正确
- 验证账户余额
- 检查网络连接

**Q: 支付宝支付失败**
A:
- 检查应用配置
- 验证密钥格式
- 检查支付环境（沙箱/正式）

**Q: 数据库连接失败**
A:
- 检查数据库文件权限
- 验证路径配置
- 检查磁盘空间

**Q: 前端无法连接后端**
A:
- 检查CORS配置
- 验证API域名设置
- 检查防火墙设置

### 调试工具
```bash
# 查看实时日志
tail -f backend/logs/app.log

# 测试API接口
curl -X GET https://your-api-url.railway.app/api/health

# 数据库查询
sqlite3 backend/src/database/pzyt.db
```

---

**作者**: MiniMax Agent  
**更新日期**: 2025-08-15  
**版本**: v1.0.0
