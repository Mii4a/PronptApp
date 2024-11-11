import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import query from '@/src/lib/pgClient';  // queryを直接インポート

type Product = {
  title: string;
  description: string;
  content: string;
  type: string;
  price: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, content, type, price }: Product = req.body;

  // ユーザーの認証状態をチェック (NextAuth.jsのセッションを使用)
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // 商品データを挿入
    await query(
      'INSERT INTO products (user_id, title, description, content, type, price, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [session.user.id, title, description, content, type, price, 'published']
    );

    res.status(200).json({ message: 'Product created' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}