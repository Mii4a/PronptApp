import React, { Dispatch, SetStateAction } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ImageUpload from './imageUpload';
import PromptInput from './promptInput';

export type FormData = {
    type: 'webapp' | 'prompt';
    title: string;
    description: string;
    category: string;
    price: number;
    features: string,
    demoUrl?: string;
    promptCount?: number;
    image?: File | null;
    prompts?: Array<{ input: string; output: string }>;
  };
export type PromptPair = {
  input: string;
  output: string;
  image: File | null;
};

type FormSectionProps = {
    onSubmit: (data: FormData) => void;
    promptPairs: PromptPair[];
    onPromptPairChange: (index: number, field: 'input' | 'output', value: string) => void;
    onAddPromptPair: () => void;
    onRemovePromptPair: (index: number) => void;
    setImagePreview: Dispatch<SetStateAction<string | null>>;
};
  

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
    image: typeof window !== 'undefined' ? z.instanceof(File).nullable().optional() : z.any(),
    prompts: z
      .array(
        z.object({
          input: z.string().min(1, 'Prompt input is required'),
          output: z.string().min(1, 'Prompt output is required'),
        })
      ).optional(), // 初期状態ではオプションにして、superRefineで必須バリデーションを追加
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
    if (data.type === 'prompt' && data.promptCount === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['prompts'],
        message: 'Prompts(input - output) is required for prompt collections',
      });
    }
})


export default function FormSection({
  onSubmit,
  promptPairs,
  onPromptPairChange,
  onAddPromptPair,
  onRemovePromptPair,
  setImagePreview,
}: FormSectionProps ) {
  const { control, handleSubmit, register, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const typeValue = watch('type');
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Label>Item Type</Label>
      <RadioGroup defaultValue="webapp" {...register('type')}>
        <RadioGroupItem value="webapp" />
        <Label htmlFor="webapp">Web App</Label>
        <RadioGroupItem value="prompt" />
        <Label htmlFor="prompt">Prompt Collection</Label>
      </RadioGroup>

      <Input {...register('title')} placeholder="Title" required />
      <Textarea {...register('description')} placeholder="Description" required />
      <Select {...register('category')}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{/* Options here */}</SelectContent></Select>
      <Input {...register('price')} type="number" placeholder="Price" required />

      <ImageUpload register={register} errors={errors} />
      {typeValue === 'prompt' && (
        <>
          <Input {...register('promptCount')} type="number" placeholder="Number of Prompts" required />
          <PromptInput
            promptPairs={promptPairs}
            onPromptPairChange={onPromptPairChange}
            onAddPromptPair={onAddPromptPair}
            onRemovePromptPair={onRemovePromptPair}
          />
          <input type="file" onChange={handleImageUpload} />
        </>
      )}
      <Button type="submit">List My Item for Sale</Button>
    </form>
  );
}
