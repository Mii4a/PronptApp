-- ユーザーテーブルの作成
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- プロダクトテーブルの作成
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- 投稿者（ユーザー）のID
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,  -- プロンプトの内容またはアプリのメタデータ
    type VARCHAR(50) NOT NULL CHECK (type IN ('prompt', 'app')),  -- 'prompt'か'app'かを区別
    price DECIMAL(10, 2) DEFAULT 0.00,  -- プロダクトの価格
    status VARCHAR(50) DEFAULT 'draft',  -- 'draft', 'published', 'sold'などのステータス
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- 取引履歴テーブルの作成
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,  -- プロダクトIDを参照
    amount DECIMAL(10, 2) NOT NULL,  -- 購入金額
    created_at TIMESTAMP DEFAULT NOW()
);


-- 購入済みプロダクト管理テーブルの作成
CREATE TABLE IF NOT EXISTS user_products (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, product_id),  -- 複合キーで重複購入を防ぐ
    purchased_at TIMESTAMP DEFAULT NOW()
);

