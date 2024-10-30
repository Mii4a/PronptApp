import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import query from '../../../lib/db';  // default exportとしてインポート

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { rows } = await query(
      'SELECT * FROM products WHERE user_id = $1',
      [session.user.id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}