import express from 'express';
import {getProducts, sellProduct, purchaseProduct, getUserProducts } from '../controllers/productController';

const router = express.Router();

//プロダクトのエンドポイント
router.get('/', getProducts);
router.get('/my-products', getUserProducts)
router.post('/sell', sellProduct);
router.post('/purchase', purchaseProduct);

export default router