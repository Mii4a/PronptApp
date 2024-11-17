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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, DollarSign, ChevronLeft, ChevronRight, Plus, Trash2, ImageIcon } from 'lucide-react'
import { fromTheme } from 'tailwind-merge';


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

// スキーマから型定義を抽出
type FormData = z.infer<typeof schema>;

type PromptPair = {
  prompt: string;
  output: string;
  image: File | null;
}

export default function ProductRegisterForm() {
  const { control, register, formState: { errors } } = useForm<FormData>({
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
    prompts: [{ input: '', output: ''}],
    promptCount: 0,
    image: null,
  });

  const [promptPairs, setPromptPairs] = useState<PromptPair[]>([{ prompt: '', output: '', image: null }])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentPromptPage, setCurrentPromptPage] = useState(0)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePromptPairChange = (index: number, field: 'prompt' | 'output', value: string) => {
    const newPromptPairs = [...promptPairs]
    newPromptPairs[index][field] = value
    setPromptPairs(newPromptPairs)
  }

  const handlePromptImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newPromptPairs = [...promptPairs]
      newPromptPairs[index].image = file
      setPromptPairs(newPromptPairs)
    }
  }

  const addPromptPair = () => {
    setPromptPairs([...promptPairs, { prompt: '', output: '', image: null }])
  }

  const removePromptPair = (index: number) => {
    const newPromptPairs = promptPairs.filter((_, i) => i !== index)
    setPromptPairs(newPromptPairs)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const productData = {
      title: formData.title,
      price: formData.price,
      description: formData.description,
      type: formData.type === 'webapp' ? 'WEBAPP' : 'PROMPT',
      category: formData.category,
      features: formData.features,
      demoUrl: formData.demoUrl,
      promptCount: formData.type === 'prompt' ? formData.promptCount : null,
      prompts: formData.type === 'prompt' ? promptPairs : null,
      image: formData.image
    };
    
    const formDataToSend = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key as keyof typeof productData] !== undefined) {
        formDataToSend.append(key, String(productData[key as keyof typeof productData]));
      }
    });

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    
    console.log('formDataToSend:', formDataToSend)
    console.log('formData:', formData)

    try {
      await axios.post(`${apiUrl}/api/products/register`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      console.log('Product registered successfully');
    } catch (error) {
      console.error('Product registration failed', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <style jsx global>{`
        .sticky {
          position: sticky;
          top: 1rem;
          height: calc(100vh - 2rem);
          overflow-y: auto;
        }
      `}</style>
      <h1 className="text-3xl font-bold text-center mb-8">Sell Your Web App or Prompt Collection</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Item Information</CardTitle>
            <CardDescription>Fill in the details about your item to list it for sale.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <RadioGroup
                  defaultValue={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, itemType: value as 'webapp' | 'prompt' }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="webapp" id="webapp" />
                    <Label htmlFor="webapp">Web App</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prompt" id="prompt" />
                    <Label htmlFor="prompt">Prompt Collection</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Name</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter your item name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder='Describe your item' />
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" value={formData.category} onValueChange={handleSelectChange('category')}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features (comma-separated)</Label>
                <Input id="features" name="features" value={formData.features} onChange={handleInputChange} placeholder="Feature 1, Feature 2, Feature 3" />
              </div>

              {formData.type === 'webapp' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="demoUrl">Demo URL</Label>
                    <Input id="demoUrl" name="demoUrl" type="url" value={formData.demoUrl} onChange={handleInputChange} placeholder="https://your-app-demo.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Screenshots</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Label
                        htmlFor="image"
                        className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Screenshot preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </Label>
                      <span className="text-sm text-gray-500">Click to upload (PNG or JPG, up to 5)</span>
                    </div>
                  </div>
                </>
              )}

              {formData.type === 'prompt' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="promptCount">Number of Prompts</Label>
                    <Input id="promptCount" name="promptCount" type="number" min="1" value={formData.promptCount} onChange={handleInputChange} placeholder="Enter the number of prompts" required />
                  </div>

                  {promptPairs.map((pair, index) => (
                    <div key={index} className="space-y-2 border p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <Label>Prompt-Output Pair {index + 1}</Label>
                        {index > 0 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removePromptPair(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        placeholder="Enter your prompt"
                        value={pair.prompt}
                        onChange={(e) => handlePromptPairChange(index, 'prompt', e.target.value)}
                      />
                      <Textarea
                        placeholder="Enter the expected output"
                        value={pair.output}
                        onChange={(e) => handlePromptPairChange(index, 'output', e.target.value)}
                      />
                      <div className="space-y-2">
                        <Label htmlFor={`promptImage-${index}`}>Output Image</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id={`promptImage-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePromptImageUpload(index, e)}
                          />
                          <Label
                            htmlFor={`promptImage-${index}`}
                            className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            {pair.image ? (
                              <img src={URL.createObjectURL(pair.image)} alt={`Prompt ${index + 1} output`} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            )}
                          </Label>
                          <span className="text-sm text-gray-500">Click to upload an image for this prompt's output</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPromptPair}>
                    <Plus className="w-4 h-4 mr-2" /> Add Prompt-Output Pair
                  </Button>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="terms" />
                <Label htmlFor="terms">I agree to the terms and conditions</Label>
              </div>

              <CardFooter className="px-0">
                <Button type="submit" className="w-full">List My Item for Sale</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview && (
                <img src={imagePreview} alt="Item preview" className="w-full h-64 object-cover rounded-lg" />
              )}
              <h2 className="text-2xl font-bold">{formData.title || 'Item Name'}</h2>
              <p className="text-gray-600">{formData.description || 'Item description will appear here'}</p>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-xl font-semibold text-green-600">
                  {formData.price ? `$${Number(formData.price).toLocaleString()}` : 'Price not set'}
                </span>
              </div>
              {formData.category && (
                <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {formData.category}
                </div>
              )}
              {formData.features && (
                <div className="space-y-1">
                  <h3 className="font-semibold">Key Features:</h3>
                  <ul className="list-disc list-inside">
                    {formData.features.split(',').map((feature, index) => (
                      <li key={index}>{feature.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
              {formData.type === 'webapp' && formData.demoUrl && (
                <div>
                  <h3 className="font-semibold">Demo URL:</h3>
                  <a href={formData.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {formData.demoUrl}
                  </a>
                </div>
              )}
              {formData.type === 'prompt' && promptPairs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Prompt Preview:</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-2">
                      <div className="bg-blue-100 p-2 rounded">
                        <p className="font-medium">Prompt:</p>
                        <p>{promptPairs[currentPromptPage].prompt || 'Your prompt will appear here'}</p>
                      </div>
                      <div className="bg-green-100 p-2 rounded">
                        <p className="font-medium">Output:</p>
                        <p>{promptPairs[currentPromptPage].output || 'Expected output will appear here'}</p>
                      </div>
                      {promptPairs[currentPromptPage].image && (
                        <div className="mt-2">
                          <p className="font-medium">Output Image:</p>
                          <img
                            src={URL.createObjectURL(promptPairs[currentPromptPage].image)}
                            alt={`Prompt ${currentPromptPage + 1} output`}
                            className="w-full h-48 object-cover rounded-lg mt-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPromptPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPromptPage === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                      </Button>
                      <span>{currentPromptPage + 1} / {promptPairs.length}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPromptPage(prev => Math.min(promptPairs.length - 1, prev + 1))}
                        disabled={currentPromptPage === promptPairs.length - 1}
                      >
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
