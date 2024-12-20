# ベースイメージを Debian Slim に変更
FROM node:22-slim

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    python3 \
    libssl-dev

# 作業ディレクトリを作成
WORKDIR /backend

# package.json と package-lock.json を先にコピーして依存関係をインストール
COPY package*.json ./
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# Prismaのスキーマファイルとprismaディレクトリをコピー
COPY prisma ./prisma

# Prismaのクライアント生成
RUN npx prisma generate --schema=./prisma/schema.prisma

# アプリケーションをビルド
RUN npm run build && npm run build:express

# 3001番ポートを公開
EXPOSE 3001

# ユーザーを変更
USER node

# アプリケーションを起動
CMD ["npm", "run", "dev:express"]
