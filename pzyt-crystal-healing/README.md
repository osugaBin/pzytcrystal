# PZYT水晶运势疗愈网站

<div align="center">

![PZYT Logo](https://img.shields.io/badge/PZYT-水晶疗愈-purple?style=for-the-badge&logo=crystal&logoColor=white)

**传统东方智慧与现代AI技术的完美结合**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

[✨ 在线体验](#-在线体验) • [🚀 快速部署](#-快速部署) • [📚 API文档](#-api文档) • [📦 下载项目](#-下载项目)

</div>

---

## 🎆 项目简介

PZYT水晶运势疗愈是一个创新的全栈Web应用，结合了中国传统八字命理与SiliconFlow AI技术，为用户提供个性化的水晶疗愈方案。

### 🌟 核心特色

- 🔮 **精准八字分析** - 基于传统命理学的科学算命
- 🧿 **AI智能推荐** - SiliconFlow驱动的个性化水晶选择
- 💸 **在线支付** - 支付宝集成，安全便捷
- 🎨 **精美设计** - 现代神秘风格，响应式体验
- 🛡️ **安全可靠** - 多重安全防护，数据加密

---

## 📸 预览截图

<div align="center">

| 🏠 主页 | 🔮 预测页面 | 📊 结果展示 |
|---------|---------|----------|
| !精美的主页设计 | !直观的预测界面 | !详细的结果分析 |

| 💳 支付页面 | 👥 个人中心 | 📎 水晶大全 |
|---------|---------|----------|
| !简单的支付流程 | !个人数据管理 | !全面的水晶信息 |

</div>

---

## 🚀 快速开始

### 前置条件

- **Node.js** 18+ 🟢
- **npm** 或 **pnpm** 📦
- **Git** 版本控制 🌀

### 💾 克隆项目

```bash
# 克隆仓库
git clone https://github.com/your-username/pzyt-crystal-healing.git
cd pzyt-crystal-healing
```

### 🛠️ 环境配置

#### 1. 后端环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `backend/.env` 文件，配置必要的API密钥：

```bash
# SiliconFlow AI API 密钥
SILICONFLOW_API_KEY=your_siliconflow_api_key_here

# 支付宝配置
ALIPAY_APP_ID=your_alipay_app_id_here
ALIPAY_PRIVATE_KEY=your_alipay_private_key_here
ALIPAY_PUBLIC_KEY=your_alipay_public_key_here

# JWT 密钥（请使用强密码）
JWT_SECRET=your_strong_jwt_secret_here
```

#### 2. 前端环境变量

```bash
cd ..
cp .env.example .env
```

配置前端环境变量：

```bash
VITE_API_URL=http://localhost:3001
```

### 🖥️ 启动开发服务

#### 启动后端

```bash
cd backend
npm install                # 安装依赖
npm run seed              # 初始化数据库
npm run dev               # 启动开发服务器
```

#### 启动前端

```bash
# 新终端窗口
cd ..                     # 返回项目根目录
pnpm install              # 安装依赖
pnpm dev                  # 启动开发服务器
```

### 🌐 访问应用

- **前端**: http://localhost:5173 🌈
- **后端 API**: http://localhost:3001 ⚙️

---

## 🔑 API密钥获取

### SiliconFlow API

1. 访问 [SiliconFlow官网](https://siliconflow.cn) 🌍
2. 注册账号并登录 🔓
3. 进入控制台获取 API Key 🔑
4. 将 API Key 设置为环境变量

### 支付宝支付

1. 访问 [支付宝开放平台](https://open.alipay.com) 🌍
2. 注册开发者账号 👥
3. 创建应用获取 `APP_ID` 🎠
4. 生成 RSA2 密钥对 🔐
5. 配置相关环境变量

---

## 🌍 生产部署

### 🅰️ 方案A: Cloudflare Pages + Railway

#### 1. 部署后端到 Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. 连接 GitHub 仓库
2. 选择 `backend` 目录
3. 配置环境变量
4. 部署完成获取域名

#### 2. 部署前端到 Cloudflare Pages

1. 登录 [Cloudflare](https://dash.cloudflare.com) 🌍
2. 创建 Pages 项目
3. 连接 GitHub 仓库
4. 配置构建设置：
   - 构建命令: `pnpm install && pnpm build`
   - 输出目录: `dist`
5. 设置环境变量: `VITE_API_URL=https://your-railway-url.railway.app`

### 🐳 方案B: Docker 部署

```bash
# 克隆项目
git clone https://github.com/your-username/pzyt-crystal-healing.git
cd pzyt-crystal-healing

# 配置环境变量
cp .env.example .env
cp backend/.env.example backend/.env
# 编辑环境变量文件

# 使用 Docker Compose 启动
docker-compose up -d
```

访问: http://localhost:3000 🌈

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 📚

---

## 📚 文档和资源

### 📝 主要文档

- [🚀 部署指南](./DEPLOYMENT.md) - 详细部署说明
- [📊 API文档](./API.md) - 完整API接口文档
- [🎆 功能特性](./FEATURES.md) - 详细功能介绍
- [📈 更新日志](./CHANGELOG.md) - 版本更新记录

### 📋 项目报告

- [🏆 交付报告](./PROJECT_DELIVERY_REPORT.md) - 完整项目交付报告

---

## 🛠️ 技术架构

### 🌊 前端技术栈

- **核心框架**: React 18 + TypeScript ⚔️
- **构建工具**: Vite (Lightning Fast) ⚡
- **样式框架**: Tailwind CSS 🎨
- **动画库**: Framer Motion 🎠
- **路由管理**: React Router 🛋️
- **表单处理**: React Hook Form + Yup 📝
- **HTTP客户端**: Axios 🌐

### ⚙️ 后端技术栈

- **运行环境**: Node.js 18+ 🟢
- **Web框架**: Express.js 🚀
- **数据库**: SQLite / PostgreSQL 💾
- **认证系统**: JWT + bcryptjs 🔒
- **命理计算**: lunar-javascript 🌙
- **支付集成**: 支付宝 SDK 💳

### 🧿 外部服务

- **AI服务**: SiliconFlow API 📝
- **支付服务**: Alipay Open Platform 💸

---

## 📷 功能展示

### 🌈 用户体验流程

1. **👥 用户注册** → 获得免费预测机会
2. **📝 输入生辰** → 精准的生辰八字信息
3. **🔍 AI分析** → 智能分析运势和五行平衡
4. **📎 水晶推荐** → 个性化的水晶匹配方案
5. **💳 在线支付** → 购买更多预测次数
6. **📉 历史记录** → 查看个人预测历史

### 🎆 核心功能

| 功能 | 描述 | 状态 |
|------|------|------|
| 🔮 八字计算 | 精准的传统八字分析 | ✅ 完成 |
| 🌀 五行平衡 | 智能分析五行缺失和过旺 | ✅ 完成 |
| 📊 运势评分 | 事业、财运、健康、感情维度 | ✅ 完成 |
| 🧿 AI分析 | SiliconFlow驱动的智能分析 | ✅ 完成 |
| 📎 水晶推荐 | 科学的水晶匹配算法 | ✅ 完成 |
| 💸 在线支付 | 支付宝扫码支付 | ✅ 完成 |
| 👥 用户系统 | 注册登录和个人中心 | ✅ 完成 |
| 📉 历史记录 | 预测历史和数据管理 | ✅ 完成 |

---

## 🔒 安全特性

- **🔐 数据加密**: bcryptjs 密码加密，JWT Token 认证
- **🛡️ 输入验证**: 前后端双重数据验证机制
- **🚫 攻击防护**: SQL注入防护，限流机制
- **🔒 支付安全**: RSA2加密，签名验证
- **🌐 CORS配置**: 安全的跨域请求处理

---

## 📈 性能优化

- **⚡ 前端优化**: 代码分割、懒加载、图片优化
- **🚀 后端优化**: 数据库索引、API缓存、异步处理
- **🌍 CDN加速**: Cloudflare全球CDN加速
- **📊 监控报警**: 实时性能监控和错误追踪

---

## 🐛 问题反馈和支持

### 🛠️ 常见问题

<details>
<summary>🔧 SiliconFlow API调用失败</summary>

1. 检查 API Key 是否正确配置
2. 验证账户余额是否充足
3. 检查网络连接和防火墙设置

</details>

<details>
<summary>💳 支付宝支付问题</summary>

1. 检查应用配置是否正确
2. 验证密钥格式和权限
3. 检查是否使用正确的支付环境

</details>

<details>
<summary>💾 数据库连接问题</summary>

1. 检查数据库文件权限
2. 验证路径配置是否正确
3. 检查磁盘空间和内存使用

</details>

### 📞 联系方式

- **🐛 问题反馈**: [创建 Issue](https://github.com/your-username/pzyt-crystal-healing/issues)
- **💬 讨论交流**: [参与讨论](https://github.com/your-username/pzyt-crystal-healing/discussions)
- **📧 邮件联系**: support@pzyt.com

---

## 🎆 贡献指南

我们欢迎任何形式的贡献！请阅读以下指南：

### 🔱 如何贡献

1. **Fork** 项目到您的 GitHub 账号 🍴
2. **创建**功能分支: `git checkout -b feature/AmazingFeature` 🌱
3. **提交**您的修改: `git commit -m 'Add some AmazingFeature'` 📝
4. **推送**到分支: `git push origin feature/AmazingFeature` 🚀
5. **创建** Pull Request 🔄

### 📝 代码规范

- 使用 TypeScript 严格类型检查
- 遵循 ESLint 和 Prettier 规范
- 编写清晰的提交信息
- 添加必要的测试用例

---

## 🏆 认可和鸣谢

### 🙏 特别鸣谢

- **lunar-javascript** - 专业的中国农历库 🌙
- **SiliconFlow** - 先进的AI大模型服务 🧿
- **Alipay** - 安全可靠的支付服务 💳
- **React** 和 **Node.js** 社区 - 优秀的开源生态 ❤️

### 🎨 设计灵感

- 中国传统文化的艺术美学 🎭
- 现代数字设计的简洁美学 🎨
- 神秘主义的美学语言 🔮

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。详情请参阅 `LICENSE` 文件。

```
MIT License

Copyright (c) 2025 MiniMax Agent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🗺️ 路线图

### 🏁 当前版本 v1.0.0

- ✅ 基础功能全部完成
- ✅ 生产环境部署就绪
- ✅ API文档和项目文档完善

### 🚀 v1.1.0 (计划中)

- 📱 移动端APP开发
- 📧 微信小程序版本
- 📞 用户反馈系统
- 🔔 消息推送功能

### 🌅 v1.2.0 (远期规划)

- 💬 用户社区和交流
- 👥 专家在线咨询
- 💳 订阅会员制度
- 🌍 多语言支持

### 🔮 v2.0.0 (未来展望)

- 🧿 更先进的AI模型
- 🌍 全球化服务
- 🏠 物联网设备集成
- 🔮 VR/AR 沉浸式体验

---

## 📊 统计数据

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/your-username/pzyt-crystal-healing?style=for-the-badge&logo=github)
![GitHub forks](https://img.shields.io/github/forks/your-username/pzyt-crystal-healing?style=for-the-badge&logo=github)
![GitHub issues](https://img.shields.io/github/issues/your-username/pzyt-crystal-healing?style=for-the-badge&logo=github)
![GitHub license](https://img.shields.io/github/license/your-username/pzyt-crystal-healing?style=for-the-badge)

**项目统计**: 50+ 文件 | 10,000+ 行代码 | 8种水晶 | 25张高清图片

</div>

---

<div align="center">

### ✨ 如果这个项目对您有帮助，请给个 Star ⭐！

**感谢您的支持和关注！**

---

**作者**: MiniMax Agent 🤖  
**创建日期**: 2025-08-15 📅  
**版本**: v1.0.0 🏆  

**用心打造，精心呈现** ❤️

</div>
