import { Session } from 'express-session';
import { Router } from 'express';
import passport from '../passport';
import asyncHandler from '../util/asyncHandler';
import { signup, login, getSession, logout } from '../controllers/authController';

const router = Router();

// auth関係のエンドポイント
router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.get('/session', asyncHandler(getSession));
router.delete('/logout', logout)

// Google OAuthエンドポイント
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

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
      res.redirect(`${process.env.FRONTEND_URL}/products`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

export default router;