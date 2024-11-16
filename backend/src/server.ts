import express from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from '@redis/client';

const app = express();
const PORT = process.env.PORT || 3001;

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  socket: {
    connectTimeout: 20000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Retry limit exhausted');
      }
      return Math.min(retries * 500, 5000);
    },
  },
});

const connectWithRetry = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis. Retrying in 5 seconds...', err);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Redisにエラーリスナーを設定
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// セッションミドルウェアの設定
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'your_secret_key', // セッション用のシークレットキー
    resave: false, // セッションを常に再保存しない
    saveUninitialized: false, // 未初期化のセッションを保存しない
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 本番環境でのみセキュアクッキーを使用
      maxAge: 24 * 60 * 60 * 1000, // クッキーの有効期限（1日）
      sameSite: 'strict', // CSRF対策
    },
  })
);

// ミドルウェア設定
app.use(
  cors({
    origin: 'http://localhost:3000', // フロントエンドのURL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // クッキーの送信を許可
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティング設定
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
