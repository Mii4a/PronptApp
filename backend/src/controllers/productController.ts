import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/db';
import Stripe from 'stripe';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 画像を保存するディレクトリ
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([
    { name: 'imageUrls[]', maxCount: 10 }, // Productのメイン画像（複数可）
    { name: 'promptImages', maxCount: 10 }, // 各Prompt用の画像（各プロンプトに1つ）
  ])

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
});

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: true
      },
  });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const registerProduct = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ message: 'File upload error' });
    }
    
    console.log('received data:', req.body);
    const { title, price, description, features, type, demoUrl, promptCount, prompts, imageUrls } = req.body;
    const userId = (req as any).user.id || 1;

    console.log('Request files:', req.files);
    console.log('Request body:', req.body);

    try {
      // アップロードされた画像URLの取得
      const uploadedImageUrls = imageUrls ? 
        (imageUrls as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];

      

      const promptImagesUrls = prompts.imageUrl ?
        (prompts.imageUrl as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];
      
      // プロンプトデータの整形
      const formattedPrompts = prompts ? prompts.map((prompt: any, index: number) => ({
        input: prompt.input,
        output: prompt.output,
        imageUrl: promptImagesUrls[index] || null,
      })) : [];
      // データベースへの保存
      const newProduct = await prisma.product.create({
        data: {
          title,
          price: parseFloat(price),
          description,
          features,
          type,
          status: 'DRAFT',
          demoUrl,
          promptCount: parseInt(promptCount),
          imageUrls: uploadedImageUrls,
          user: {
            connect: { id: userId },
          },
          prompts: {
            create: formattedPrompts, // プロンプトデータを作成
          },
        },
      });

      res.status(201).json({ message: 'Product registered successfully!', product: newProduct });
    } catch (error) {
      console.error('Error registering product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};

export const purchaseProduct = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = (req as any).user.id;

  try {
    // クエリ結果の型定義を指定してデータベースからプロダクトを取得
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Stripeの決済処理
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100, // セント単位
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserProducts = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const products = await prisma.product.findMany({
      where: { userId },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};