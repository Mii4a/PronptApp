# ベースイメージ
FROM node:23-alpine

# 作業ディレクトリを作成
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 3001番ポートを公開
EXPOSE 3001

# アプリケーションを起動
CMD ["npm", "run", "start"]

