import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/db';
import bcrypt from 'bcrypt';
import * as yup from 'yup';
import redisClient from '@/src/util/redisClient';


// Redisクライアント接続の確保
const ensureRedisConnection = async () => {
  if (!redisClient.isOpen) {
    console.log('Redis client is not open. Reconnecting...');
    try {
      await redisClient.connect();
      console.log('Redis client reconnected successfully');
    } catch (err) {
      console.error('Failed to reconnect Redis client:', err);
      throw new Error('Failed to reconnect Redis client');
    }
  }
};

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

    console.log('User retrieved from database:', user);

    // Redis クライアント接続の確保
    try {
      await ensureRedisConnection();
    } catch (err) {
      next(err);
      return res.status(500).json({ message: 'Failed to connect to Redis' });
    }

    // セッションデータを作成
    const sessionData = {
      id: user.id,
      name: user.name,
      role: user.role || 'USER',
    };

    // Redis にセッションデータを保存
    try {
      await redisClient.set(`user-session:${user.id}`, JSON.stringify(sessionData), {
        EX: 86400, // セッションの有効期限（秒単、1日）
      });
      console.log('Data saved in Redis successfully');
    } catch (err) {
      console.error('Error saving session data to Redis:', err);
      return res.status(500).json({ message: 'Failed to save session in Redis' });
    }

    // セッションにユーザー情報を保存
    req.session.user = sessionData;

    // レスポンス送信
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Failed to save session' });
      }
      console.log('Session saved successfully');
      res.status(200).json({ message: 'Login successful', user: sessionData });
    });
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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

// セッション取得機能
export const getSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session && req.session.user) {
      // セッションが存在し、ユーザー情報が含まれている場合、ユーザー情報を返す
      return res.status(200).json({ user: req.session.user });
    } else {
      // Redisからセッションを取得
      const userId = req.session?.user?.id;
      if (userId) {
        const sessionData = await redisClient.get(`user-session:${userId}`);
        if (sessionData) {
          const user = JSON.parse(sessionData);
          return res.status(200).json({ user });
        }
      }
      console.log('Error: Session after login', req.session);
      return res.status(401).json({ message: 'Not authenticated' });
    }
  } catch (err) {
    next(err);
  }
};

export const saveSessionToRedis = async (
  userId: number,
  sessionData: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await redisClient.set(`user-session:${userId}`, JSON.stringify(sessionData), {
      EX: 86400, // セッションの有効期限(秒単位,1日)
    });
    console.log('Data saved in Redis successfully')
  } catch (err) {
    console.error('Error saving session data to Redis:', err);
    res.status(500).json({ message: 'Failed to save session data in Redis' })
    throw err;
  }

  req.session.save((err) => {
    if (err) {
      console.error('Error saving session:', err);
      res.status(500).json({ message: 'Failsed to save session' })
      return;
    }
    console.log('Session saved successfully');
    res.status(200).json({ message: 'Login successful', user: sessionData })
  })
}

export const checkSessionInRedis = async (userId: number) => {
  try {
    const sessionData = await redisClient.get(`user-session:${userId}`);
    if (sessionData) {
      console.log('Session data:', JSON.parse(sessionData));
    } else {
      console.log('No session data found for user:', userId);
    }
  } catch (err) {
    console.error('Error retrieving session data from Redis:', err);
  }
};


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
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = req.session.user;
  next();
}