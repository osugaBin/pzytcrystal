# PZYT水晶疗愈网站 - 后端 Docker配置
FROM node:18-alpine

# 安装系统依赖
RUN apk add --no-cache python3 make g++ sqlite

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 创建数据库目录
RUN mkdir -p src/database

# 设置权限
RUN chmod +x database/seed.js

# 初始化数据库
RUN npm run seed

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]