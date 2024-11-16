import { Router } from 'express';
import { signup, login, getSession } from '../controllers/authController';

const router = Router();

// auth関係のエンドポイント
router.post('/signup', signup);
router.post('/login', login);
router.get('/session', getSession);

export default router;