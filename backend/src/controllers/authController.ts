import { Request, Response, NextFunction } from 'express';
import prisma from '@/src/lib/db';
import bcrypt from 'bcrypt';
import * as yup from 'yup';
import redisClient from '@/src/util/redisClient';


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
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  console.log(req.body)
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
    console.log(newUser);

    // 動作確認用
    (req.session as any).user = { id: newUser.id, name: newUser.name };

    // セッションにユーザーIDとユーザー名を保存
    req.session.user = { id: newUser.id, name: newUser.name };
    res.status(201).json({ message: 'User signed up successfully!', user: newUser });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Registration failed', error });
    next(error);
  }
};

// ログイン機能
export const login = async (req: Request, res: Response, next: NextFunction) => {
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
    const isValidPassword = await bcrypt.compare(password, user.password!);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // セッションデータを作成
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role || 'USER',
    };
    
    if (req.session.user) {
      console.log('Session saved successfully');
      res.status(200).json({ message: 'Login successful', user: req.session.user })
    };
    
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ログアウト機能
export const logout = async (req: Request, res: Response) => {
  const userId = req.session?.user?.id;

  // セッションの削除
  req.session.destroy(async (err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    // Redisからセッションを削除
    if (userId) {
      try {
        await redisClient.del(`user-session:${userId}`);
        console.log('Session deleted from Redis:', userId);
      } catch (redisErr) {
        console.error('Error deleting session from Redis:', redisErr);
      }
    }

    res.clearCookie('connect.sid'); // セッションIDのCookieを削除
    res.status(200).json({ message: 'Logout successful' });
  });
};

// セッション取得機能
export const getSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Expressセッションからデータを取得
    if (req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }

    // 2. Redisからセッションデータを取得
    const sessionKey = `sess:${req.sessionID}`;
    const sessionData = await redisClient.get(sessionKey);

    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      if (parsedSession.user) {
        return res.status(200).json({ user: parsedSession.user });
      }
    }

    // セッション情報が見つからない場合
    return res.status(401).json({ error: 'User not authenticated' });
  } catch (err) {
    console.error('Error retrieving session:', err);
    next(err);
  }
};


//passport.tsでのprismaへのユーザー保存
export const googleOAuth = async (profile: any, req: Request) => {
  const { id: googleId, displayName: name, emails } = profile;
  const email = emails?.[0]?.value || '';

  // Google IDで既存ユーザーを検索
  const existingUserByGoogleId = await prisma.user.findUnique({
    where: { googleId },
  });

  if (existingUserByGoogleId) {
    // セッションに保存
    req.session.user = {
      id: existingUserByGoogleId.id,
      name: existingUserByGoogleId.name,
      role: existingUserByGoogleId.role || 'USER',
    };

    return existingUserByGoogleId;
  }

  // Google IDが見つからない場合、emailで検索
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUserByEmail) {
    // メールアドレスで見つかった場合はGoogle IDを紐付け
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { googleId },
    });

    // セッションに保存
    req.session.user = {
      id: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role || 'USER',
    };

    return updatedUser;
  }

  // Google IDもemailも見つからない場合は新規作成
  const newUser = await prisma.user.create({
    data: {
      googleId,
      email,
      name: name || 'Unknown User',
    },
  });

  // セッションに保存
  req.session.user = {
    id: newUser.id,
    name: newUser.name,
    role: newUser.role || 'USER',
  };

  return newUser
};

//ユーザーがセッション保存済みか確認
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }
  req.user = req.session.user;
  next();
}