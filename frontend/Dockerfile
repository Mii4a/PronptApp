# Node.js 22の軽量イメージを使用
FROM node:22-slim

# 環境変数を設定
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    libssl3 \
    build-essential \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを作成
WORKDIR /frontend

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY package*.json ./
RUN npm ci

# アプリケーションのコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 3000ポートを公開
EXPOSE 3000

# ユーザーを変更
USER node

# アプリケーションを起動
CMD ["npm", "run", "start"]
