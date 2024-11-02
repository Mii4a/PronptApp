import bcrypt from 'bcrypt';

// パスワードをハッシュ化
export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
}

// パスワードを検証
export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}