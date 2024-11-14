import React, { useState } from 'react';
import axios from 'axios';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Zodバリデーションスキーマ
const schema = z
  .object({
    type: z.enum(['webapp', 'prompt'], { invalid_type_error: 'Invalid item type' }),
    title: z.string().min(1, 'Title is required').max(50, 'Title cannot exceed 50 characters'),
    description: z.string().min(1, 'Description is required').max(200, 'Description cannot exceed 200 characters'),
    category: z.string().min(1, 'Category is required'),
    price: z
      .number({ invalid_type_error: 'Price must be a number' })
      .positive('Price must be a positive number'),
    demoUrl: z.string().url('Invalid URL format').optional(),
    promptCount: z.number().int('Prompt count must be an integer').positive('Prompt count must be a positive number').optional(),
    features: z.string().optional(),
    image: z.instanceof(File).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'webapp' && !data.demoUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['demoUrl'],
        message: 'Demo URL is required for web apps',
      });
    }
    if (data.type === 'prompt' && data.promptCount === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['promptCount'],
        message: 'Number of prompts is required for prompt collections',
      });
    }
  });

// スキーマから型定義を抽出
type FormData = z.infer<typeof schema>;

export default function ProductRegisterForm() {
  const { control, handleSubmit, register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [formData, setFormData] = useState<FormData>({
    type: 'webapp',
    title: '',
    description: '',
    category: '',
    price: 0,
    features: '',
    demoUrl: '',
    promptCount: undefined,
    image: null,
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const productData = {
      title: data.title,
      price: data.price,
      description: data.description,
      type: data.type === 'webapp' ? 'WEBAPP' : 'PROMPT',
      category: data.category,
      features: data.features,
      demoUrl: data.demoUrl,
      promptCount: data.type === 'prompt' ? data.promptCount : null,
    };

    const formDataToSend = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key as keyof typeof productData] !== undefined) {
        formDataToSend.append(key, String(productData[key as keyof typeof productData]));
      }
    });

    if (data.image) {
      formDataToSend.append('image', data.image);
    }

    try {
      await axios.post(`${apiUrl}/api/products/create`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product registered successfully');
    } catch (error) {
      console.error('Product registration failed', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sell Your Web App or Prompt Collection</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Item Information</CardTitle>
            <CardDescription>Fill in the details about your item to list it for sale.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Controller
                  control={control}
                  name="type"
                  defaultValue="webapp"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={(value) => field.onChange(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="webapp" id="webapp" />
                        <Label htmlFor="webapp">Web App</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prompt" id="prompt" />
                        <Label htmlFor="prompt">Prompt Collection</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.type && <p className="text-red-600">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} placeholder="Enter your item name" />
                {errors.title && <p className="text-red-600">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} placeholder="Describe your item" />
                {errors.description && <p className="text-red-600">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-red-600">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" {...register('price')} placeholder="0.00" />
                  {errors.price && <p className="text-red-600">{errors.price.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promptCount">Number of Prompts</Label>
                <Input id="promptCount" type="number" {...register('promptCount')} placeholder="Enter the number of prompts" />
                {errors.promptCount && <p className="text-red-600">{errors.promptCount.message}</p>}
              </div>

              <Button type="submit" className="w-full">List My Item for Sale</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
