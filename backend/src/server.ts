import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
import redisClient from './util/redisClient';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

console.log('TypeScript server is running...');
console.log('Environment:', process.env.NODE_ENV);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    origin: `${process.env.FRONTEND_URL}`, // フロントエンドのURL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // クッキーの送信を許可
  })
);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
};


// エラーハンドリングミドルウェア
app.use(errorHandler);

// // Passportのセットアップ
app.use(passport.initialize());
app.use(passport.session());

// ルーティング設定
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
