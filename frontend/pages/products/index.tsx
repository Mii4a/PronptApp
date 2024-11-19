import React from 'react';

import ProductListForm from '@/components/ProductListForm';
import Header from '@/components/Header'
import { GetServerSideProps } from 'next';
import axios from 'axios';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const { data: user } = await axios.get(`${backendUrl}/auth/session`, {
      headers: {
        cookie: context.req.headers.cookie || '',
      },
    });

    return { props: { user } };
  } catch {
    return { props: { user: null } };
  }
};

const MyProductsPage: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div>
      <Header user={user}/>
      <ProductListForm />
    </div>
  );
};

export default MyProductsPage;