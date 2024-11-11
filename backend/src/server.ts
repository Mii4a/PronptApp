import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア設定
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ルーティング設定
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});