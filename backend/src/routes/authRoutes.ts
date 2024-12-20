import { Request, Response, NextFunction, Router } from 'express';
import passport from '../passport';
import asyncHandler from '../util/asyncHandler';
import { signup, login, getSession, logout } from '../controllers/authController';

const router = Router();

// クッキーをクリアするミドルウェア
const clearCookies = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('connect.sid'); // セッションIDのCookieを削除
  next();
};

// auth関係のエンドポイント
router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.get('/session', asyncHandler(getSession));
router.delete('/logout', asyncHandler(logout));

// Google OAuthエンドポイント
router.get('/google', clearCookies, passport.authenticate('google', { scope: ['profile', 'email'] }));

// - 'accessType': 'offline'を指定することで、リフレッシュトークンを取得可能。
// - 'prompt': 'consent'を指定することで、毎回ユーザーに同意を求める。
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    accessType: 'offline',
    prompt: 'consent',
  }),
  (req, res) => {
    if (req.isAuthenticated()) {
      // 非同期操作でセッションにカスタムデータを保存
      req.session.user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        bio: req.user.bio,
        avatar: req.user.avatar,
        emailNotifications: req.user.emailNotifications,
        pushNotifications: req.user.pushNotifications
      };
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Session saved successfully');
          res.redirect(`${process.env.FRONTEND_URL}/products`);
        }
      });
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

export default router;