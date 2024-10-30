const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // 環境変数から接続情報を取得
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
