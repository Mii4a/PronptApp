import React from 'react';
import ProductListForm from '@/components/ProductListForm';
import Header from '@/components/Header'

const MyProductsPage: React.FC = () => {
  return (
    <div>
      <Header />
      <ProductListForm />
    </div>
  );
};

export default MyProductsPage;