import db from '../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { rows } = await db.query(
    'SELECT * FROM products WHERE user_id = $1',
    [session.user.id]
  );

  res.status(200).json(rows);
}
