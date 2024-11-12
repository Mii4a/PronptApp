import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア設定
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// express-sessionの設定
app.use(
  session({
    secret: 'your_secret_key', // セッション用のシークレットキー
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 本番環境ではセキュアクッキーを設定
      maxAge: 60 * 60 * 1000, // 1時間
      sameSite: 'strict', // CSRF対策
    },
  })
);

// ルーティング設定
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
