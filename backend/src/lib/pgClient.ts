import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // 環境変数から接続情報を取得
});

const query = async (text: string, params?: any[]): Promise<any> => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;  // エラーを再スローして呼び出し元で処理
  }
};

export default query