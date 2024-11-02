import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import query from '@/lib/db';  // db.tsのquery関数をインポート
import Stripe from 'stripe';

// Stripeインスタンスの作成
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia', // 最新のAPIバージョンを指定
});

type Product = {
  id: number;
  title: string;
  price: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { product_id } = req.body;

  try {
    // クエリ結果の型定義を指定
    const result = await query('SELECT * FROM products WHERE id = $1', [product_id]);

    // クエリ結果が空でないかをチェック
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const selectedProduct = result.rows[0];

    // Stripeの決済処理
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedProduct.title,
            },
            unit_amount: selectedProduct.price * 100, // セント単位
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
}