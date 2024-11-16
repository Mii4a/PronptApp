import { Request, Response } from 'express';
import prisma from '../lib/db';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { string } from 'yup';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const registerProduct = async (req: Request, res: Response) => {
  console.log('Request body:', req.body); // registerProductの冒頭に追加
  console.log('Request received at /api/products/register');
  console.log('Request body:', req.body);
  
  const { title, price, description, features, type, 
          demoUrl, promptCount, prompts, imageUrl } = req.body;
  const userId = (req as any).user.id || 1;

  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        price,
        description,
        features,
        type,
        status: 'DRAFT',
        demoUrl,
        promptCount,
        imageUrl,
        user: {
          connect: { id: userId }
        },
        prompts: {
          create: prompts, // promptsは[{ input: '...', output: '...' }, ...]の形式
        },
      },
    });
    res.status(201).json({ message: 'Product sold successfully!', product: newProduct });
  } catch (error) {
    console.error('Error selling product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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