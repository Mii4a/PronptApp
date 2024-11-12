import { Request, Response } from 'express';
import prisma from '../lib/db';
import bcrypt from 'bcrypt';
import * as yup from 'yup';

// バリデーションスキーマの作成
const signupSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number'),
});

// サインアップ（ユーザー登録）機能
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    
    // バリデーションを実行
    await signupSchema.validate({ name, email, password });

    // パスワードのハッシュ化
    const passwordHash = await bcrypt.hash(password, 10);

    // ユーザーをデータベースに挿入
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    // セッションにユーザーIDとユーザー名を保存
    req.session.user = { id: newUser.id, name: newUser.name };
    res.status(201).json({ message: 'User signed up successfully!', user: newUser });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// ログイン機能
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // データベースからユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // パスワードの照合
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // セッションにユーザー情報を保存
    req.session.user = { id: user.id, name: user.name, role: user.role };
    res.status(200).json({ message: 'Login successful', user: req.session.user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSettion = async (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    // セッションが存在し、ユーザー情報が含まれている場合、ユーザー情報を返す
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}

// ログアウト機能
export const logout = async (req: Request, res: Response) => {
  // セッションの削除
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // セッションIDのCookieを削除
    res.status(200).json({ message: 'Logout successful' });
  });
};
