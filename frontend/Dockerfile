# Node.js 23の軽量イメージを使用
FROM node:23-alpine

# 環境変数を設定    
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# 必要なパッケージをインストール
RUN apk add --no-cache sudo

# 作業ディレクトリを作成
WORKDIR /frontend

# package.jsonをコピー, 依存関係をインストール
COPY package*.json ./
RUN npm ci

# アプリケーションのコードをコピー
COPY . .


# アプリケーションをビルド
RUN npm run build

# ビルド済みのファイルを一時ディレクトリにコピー
RUN cp -r .next /tmp/next

# 3000ポートを公開
EXPOSE 3000

# ユーザーを変更
USER node

# アプリケーションを起動
CMD ["npm", "run", "start"]
