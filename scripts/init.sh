#!/bin/bash

# 定义颜色和样式
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查参数（端口）
if [ "$#" -lt 1 ]; then
    echo -e "${RED}❌ 错误：缺少端口参数${NC}"
    echo -e "${BLUE}用法: $0 <port>${NC}"
    exit 1
fi

PORT=$1
if [ -z "$PORT" ]; then
    echo -e "${RED}❌ 错误：PORT 不能为空${NC}"
    exit 1
fi

# 获取脚本路径和项目路径
SCRIPT_PATH=$(dirname "$(realpath "$0")")
PROJECT_PATH=$(dirname "$SCRIPT_PATH")
echo -e "\n${BLUE}📂 脚本路径:${NC} $SCRIPT_PATH"
echo -e "${BLUE}📂 项目路径:${NC} $PROJECT_PATH"

# 获取项目名称为目录的小写
PROJECT_NAME=$(basename "$PROJECT_PATH" | tr '[:upper:]' '[:lower:]')
echo -e "${BLUE}📌 项目名称:${NC} $PROJECT_NAME\n"

DOMAIN=$PROJECT_NAME.zdev.in
BASE_URL="https://$DOMAIN"
NGINX_FILE="/etc/nginx/proj/next"
PROJECT_TAG="#-NEXT-${PROJECT_NAME^^}"

echo -e "\n${YELLOW}🚀 初始化项目配置...${NC}"
echo -e "${BLUE}🔌 端口:${NC} $PORT"
echo -e "${BLUE}🌐 基础 URL:${NC} $BASE_URL\n"

# 修改 .env.production 文件
echo -e "${YELLOW}📝 更新 .env.production 文件...${NC}"
sed -i "s|^BASE_URL=.*|BASE_URL=$BASE_URL|" .env.production
sed -i "s/^PORT=.*/PORT=$PORT/" .env.production

# 修改 pm2.json 文件
echo -e "${YELLOW}📝 更新 pm2.json 文件...${NC}"
jq --arg name "$PROJECT_NAME" --arg cwd "$PROJECT_PATH/build" \
    '.name = $name | .cwd = $cwd' pm2.json >pm2_temp.json && mv pm2_temp.json pm2.json

# 修改 .gitea/workflows/build.yml 文件中的路径
echo -e "${YELLOW}📝 更新 .gitea/workflows/build.yml 文件...${NC}"
sed -i "s|cd .*|cd $PROJECT_PATH|g" .gitea/workflows/build.yml

# 定义 NGINX 配置内容块
NGINX_CONFIG="$PROJECT_TAG
server {
    server_name $DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        include conf/proxy;
    }
    include conf/site;
}
$PROJECT_TAG"

# 检查 /etc/nginx/proj/next 文件
echo -e "\n${YELLOW}🔍 检查 NGINX 配置...${NC}"

# 如果项目路径中包含 next-template，就跳过这一步
if [[ "$SCRIPT_PATH" == *"next-template"* ]]; then
    echo -e "${YELLOW}🔄 跳过 NGINX 配置更新，因为项目路径包含 'next-template'${NC}"
else
    if ! grep -q "$PROJECT_TAG" "$NGINX_FILE"; then
        echo -e "${GREEN}✨ 添加新的 NGINX 配置...${NC}"
        echo -e "\n$NGINX_CONFIG" >>"$NGINX_FILE"
    else
        echo -e "${YELLOW}🔄 更新现有的 NGINX 配置...${NC}"
        sed -i "/$PROJECT_TAG/,/$PROJECT_TAG/{
            /$PROJECT_TAG/!{
                d
            }
            /$PROJECT_TAG/{
                r /dev/stdin
                d
            }
        }" "$NGINX_FILE" <<<"$NGINX_CONFIG"
    fi

    # 重载 nginx
    echo -e "\n${YELLOW}🔄 重载 nginx 配置...${NC}"
    sudo nginx -s reload
fi

echo -e "\n${YELLOW}📦 生成 package.json 文件...${NC}"
cat <<EOF >package.json
{
  "name": "$PROJECT_NAME",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev && print https://int.jyj.cx",
    "d": "next build && rm -rf build && mkdir build && rsync -az .next build --exclude cache && ln -sf ../public build/public && ln -sf ../node_modules build/node_modules && ln -sf ../package.json build/package.json && find . -name '.env*' | xargs -I {} ln -s .{} build && pm2 start pm2.json",
    "start": "next start --port \$(grep -E '^PORT=' .env.production | cut -d '=' -f 2)",
    "lint": "next lint",
    "test": "test"
  },
  "dependencies": {},
  "devDependencies": {}
}
EOF

echo -e "\n${YELLOW}📥 安装项目依赖...${NC}"
pnpm add next @nextui-org/react framer-motion tailwindcss@3 postcss react-toastify lucide-react mysql2 zod
pnpm add -D @types/node @types/react eslint eslint-config-next vite
