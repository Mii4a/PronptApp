import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import axios from 'axios';


export default function IndexMainForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
    fetchProducts();
  }, [reset]);

  return (
    <main className="flex-grow">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to AppPromptMarket</h1>
          <p className="text-xl mb-8">Discover amazing web apps and prompt collections</p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/apps">Explore Apps</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/prompts">Discover Prompts</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>Featured {product.title}</CardTitle>
                  <CardDescription>By Creator Name</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {product.type === 'prompt'
                    ? 'A collection of powerful prompts to boost your productivity.'
                    : 'An amazing web application that solves real-world problems.'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="font-bold">${(product.price).toFixed(2)}</span>
                  <Button>View Details</Button>
                </CardFooter>
              </Card>
            ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Selling Today</h2>
            <p className="text-xl mb-8">Share your web apps and prompt collections with the world</p>
            <Button asChild size="lg">
              <Link href="/sell">Become a Seller</Link>
            </Button>
          </div>
        </section>
    </main>
  )
}