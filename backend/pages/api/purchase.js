mport db from '../../lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { product_id } = req.body;

  // データベースからプロダクト情報を取得
  const product = await db.query('SELECT * FROM products WHERE id = $1', [product_id]);

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
}

