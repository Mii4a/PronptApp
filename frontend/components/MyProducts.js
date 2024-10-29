import { useEffect, useState } from 'react';
import axios from 'axios';

const MyProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products/my-products').then(response => {
      setProducts(response.data);
    });
  }, []);

  return (
    <div>
      <h1>My Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.title} - {product.type} - ${product.price} - {product.status}
            {/* 編集や削除のボタンを追加 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProducts;
