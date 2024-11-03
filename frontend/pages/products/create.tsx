import React from 'react';
import CreateProductForm from '../../components/CreateProductForm';


const CreateProductPage: React.FC = () => {
  return (
    <div>
      <h1>Create a New Product!</h1>
      <CreateProductForm />
    </div>
  );
};

export default CreateProductPage;