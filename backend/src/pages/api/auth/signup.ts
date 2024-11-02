import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import query from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // パスワードをハッシュ化
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      // データベースにユーザーを挿入
      const result = await query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [name, email, passwordHash]
      );
      res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'User registration failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
