import db from '../../lib/db';

export default async function handler(req, res) {
  const { title, description, content, type, price } = req.body;

  // ユーザーの認証状態をチェック (NextAuth.jsのセッションを使用)
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 商品データを挿入
  await db.query(
    'INSERT INTO products (user_id, title, description, content, type, price, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [session.user.id, title, description, content, type, price, 'published']
  );

  res.status(200).json({ message: 'Product created' });
}
