# ==================================================
# 多阶段构建 - 游戏集合应用
# ==================================================

# -------------------
# 构建阶段
# -------------------
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm（可选，如果使用 pnpm）
RUN npm install -g pnpm

# 复制包管理文件
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# 安装依赖
RUN npm ci --only=production --silent

# 复制源代码
COPY . .

# 设置构建环境变量
ENV NODE_ENV=production
ENV VITE_BUILD_MODE=production

# 构建应用
RUN npm run build

# 清理开发依赖，减小镜像大小
RUN npm prune --production

# -------------------
# 生产阶段
# -------------------
FROM nginx:alpine AS production

# 安装必要的包
RUN apk add --no-cache \
    curl \
    bash \
    tzdata

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S app -u 1001

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# 复制启动脚本
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 创建必要的目录并设置权限
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run \
    && chown -R app:nodejs /var/cache/nginx \
    && chown -R app:nodejs /var/log/nginx \
    && chown -R app:nodejs /var/run \
    && chown -R app:nodejs /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# 暴露端口
EXPOSE 80

# 设置用户
USER app

# 启动应用
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

# -------------------
# 开发阶段（可选）
# -------------------
FROM node:18-alpine AS development

WORKDIR /app

# 安装开发工具
RUN apk add --no-cache git

# 复制包管理文件
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm install

# 复制源代码
COPY . .

# 暴露开发端口
EXPOSE 5173

# 启动开发服务器
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# -------------------
# 镜像元数据
# -------------------
LABEL maintainer="Game Collection Team <team@gamecollection.com>"
LABEL version="1.0.0"
LABEL description="Game Collection - 多平台游戏集合应用"
LABEL org.opencontainers.image.title="Game Collection"
LABEL org.opencontainers.image.description="多平台游戏集合应用，包含俄罗斯方块、贪吃蛇等经典游戏"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="Game Collection Team"
LABEL org.opencontainers.image.url="https://gamecollection.example.com"
LABEL org.opencontainers.image.source="https://github.com/example/game-collection"
LABEL org.opencontainers.image.licenses="MIT"
