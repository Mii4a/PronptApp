# Node.js 23の軽量イメージを使用
FROM node:23-alpine

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 3000ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]
