import { Router } from 'express';
import { signup, login } from '../controllers/authController';

const router = Router();

// サインアップのエンドポイント
router.post('/signup', signup);

// ログインのエンドポイント
router.post('/login', login);

export default router;