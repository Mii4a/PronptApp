import z from 'zod';

export const productRegisterSchema = z
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
    imageUrls: typeof window !== 'undefined'
      ? z.array(z.instanceof(File)).optional()  // クライアントサイドでのみ File のインスタンスをチェック
      : z.any(),  // サーバーサイドでは任意の型を受け入れる
    prompts: z
      .array(
        z.object({
          input: z.string().min(1, 'Prompt input is required'),
          output: z.string().min(1, 'Prompt output is required'),
        })
      ).optional(),
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
    if (data.type === 'prompt' && (!data.prompts || data.prompts.length === 0)) {
      ctx.addIssue({
        code: 'custom',
        path: ['prompts'],
        message: 'Prompts (input - output) are required for prompt collections',
      });
    }
});