import express from 'express';
import {getProducts, registerProduct, purchaseProduct, getUserProducts } from '../controllers/productController';

const router = express.Router();

//プロダクトのエンドポイント
router.get('/', getProducts);
router.get('/my-products', getUserProducts)
router.post('/register', registerProduct);
router.post('/purchase', purchaseProduct);

export default router