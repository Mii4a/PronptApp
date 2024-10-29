import db from '../../lib/db'

export default async function handler(rec, res){
  const {rows} = await db.query('SELECT * FROM products');
  res.status(200).json(rows);
}
