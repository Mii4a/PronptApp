import { Router } from 'express';
import multer from 'multer'; // 画像等のファイルデータのミドルウェア
import asyncHandler from '../util/asyncHandler';
import { isAuthenticated } from '../controllers/authController';
import { updateUser } from '@/src/controllers/userController';

const router = Router();

// ミドルウェア関数を個別に渡す
router.patch('/:id', asyncHandler(isAuthenticated), asyncHandler(updateUser));

export default router;