import React from 'react';
import MyProducts from '../../components/MyProducts';

const MyProductsPage: React.FC = () => {
  return (
    <div>
      <h1>Your Products</h1>
      <MyProducts />
    </div>
  );
};

export default MyProductsPage;