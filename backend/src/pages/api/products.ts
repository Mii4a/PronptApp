import { NextApiRequest, NextApiResponse } from 'next';
import query from '@/src/lib/pgClient';  // default exportとしてインポート

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { rows } = await query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}