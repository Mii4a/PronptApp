# ベースイメージ
FROM node:22-alpine

# 必要なパッケージをインストール
RUN apk add --no-cache sudo

# 作業ディレクトリを作成
WORKDIR /backend

# package.json と package-lock.json をコピー
COPY package*.json ./

# Prismaのスキーマファイルとprismaディレクトリをコピー
COPY prisma ./prisma

# 依存関係をインストール
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# Prismaのクライアント生成
RUN npx prisma generate --schema=./prisma/schema.prisma

# アプリケーションをビルド
RUN npm run build && npm run build:express

# ビルド済みのファイルを一時ディレクトリにコピー
RUN cp -r .next /tmp/next

# 3001番ポートを公開
EXPOSE 3001

# ユーザーを変更
USER node

# アプリケーションを起動
CMD ["npm", "run", "start:express"]

