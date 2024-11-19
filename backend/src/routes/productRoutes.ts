import { Request, Response, NextFunction, Router }from 'express';
import multer from 'multer'; // 画像等のファイルデータのミドルウェア
import asyncHandler from '../util/asyncHandler';
import { isAuthenticated } from '@/src/controllers/authController';
import {getProducts, registerProduct, purchaseProduct, getUserProducts } from '@/src/controllers/productController';


const router = Router();

const upload = multer({ dest: 'uploads/' }); //ファイルの保存先を指定 

//プロダクトのエンドポイント
router.get('/', getProducts);
router.get('/my-products', getUserProducts)
router.post('/register', asyncHandler(isAuthenticated), registerProduct);
router.post('/purchase', asyncHandler(purchaseProduct));


export default router