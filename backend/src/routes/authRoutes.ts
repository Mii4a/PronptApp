import { Router } from 'express';
import passport from '../passport';
import asyncHandler from '../util/asyncHandler';
import { signup, login, getSession, logout } from '../controllers/authController';

const router = Router();

// auth関係のエンドポイント
router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.get('/session', getSession);
router.delete('/logout', logout)

// Google OAuthエンドポイント
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 認証成功後のリダイレクト処理
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback`); // フロントエンドのURLにリダイレクト
  }
);

export default router;