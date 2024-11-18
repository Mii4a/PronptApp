import { Request, Response, NextFunction, Router }from 'express';
import multer from 'multer'; // 画像等のファイルデータのミドルウェア
import {getProducts, registerProduct, purchaseProduct, getUserProducts } from '../controllers/productController';


const router = Router();

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = req.session.user;
  next();
}

const upload = multer({ dest: 'uploads/' }); //ファイルの保存先を指定 

//プロダクトのエンドポイント
router.get('/', getProducts);
router.get('/my-products', getUserProducts)
router.post('/register', isAuthenticated, registerProduct);
router.post('/purchase', purchaseProduct);

export default router