import { Router } from 'express';
import { signup, login, getSettion } from '../controllers/authController';

const router = Router();

// auth関係のエンドポイント
router.post('/signup', signup);
router.post('/login', login);
router.get('/session', getSettion);

export default router;