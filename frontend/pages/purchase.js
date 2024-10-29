import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const PurchasePage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query; // 購入対象のプロダクトIDを取得

  useEffect(() => {
    if (id) {
      // APIからプロダクト詳細を取得
      axios.get(`/api/products/${id}`)
        .then(response => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load product.');
          setLoading(false);
        });
    }
  }, [id]);

  const handlePurchase = async () => {
    try {
      const response = await axios.post('/api/purchase', { product_id: id });
      const { id: sessionId } = response.data;
      // Stripeの決済画面へリダイレクト
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (err) {
      setError('Failed to initiate purchase.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Purchase {product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={handlePurchase}>Buy Now</button>
    </div>
  );
};

export default PurchasePage;
