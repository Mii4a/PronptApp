import { Request, Response } from 'express';
import prisma from '../lib/db';
import bcrypt from 'bcrypt';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

// バリデーションスキーマの作成
const signupSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
});


// signup
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

    res.status(201).json({ message: 'User signed up successfully!', user: newUser });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Registration failed', error });
  }
};


// login 
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

    // トークンの生成
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // アクセストークンの生成
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // リフレッシュトークンの生成
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' } // 7日間の有効期限
    );

    //リフレッシュトークンをデータベースに保存
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Cookieにアクセストークンとリフレッシュトークンを保存
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout successful' });
};
