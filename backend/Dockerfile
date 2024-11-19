# ベースイメージ
FROM node:22-alpine

# 必要なパッケージをインストール
RUN apk add --no-cache sudo

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
CMD ["npm", "run", "start:express"]
