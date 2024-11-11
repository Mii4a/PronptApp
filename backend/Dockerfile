# ベースイメージ
FROM node:22-alpine

# 環境変数を設定
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

# ホストのUIDとGIDを受け取る
ARG UID=989
ARG GID=989

# 必要なパッケージをインストール
RUN apk add --no-cache sudo

# ユーザーとグループを作成
RUN addgroup -g $GID mii4a && \
    adduser -D -u $UID -G mii4a mii4a && \
    echo "mii4a ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers


# 作業ディレクトリを作成
WORKDIR /backend

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# ビルド済みのファイルを一時ディレクトリにコピー
RUN cp -r .next /tmp/next

# 3001番ポートを公開
EXPOSE 3001

# ユーザーを変更
USER mii4a

# アプリケーションを起動
CMD ["npm", "run", "start:express"]

