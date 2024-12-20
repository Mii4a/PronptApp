import React, { useState } from 'react'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, ChevronLeft, ChevronRight, Plus, Trash2, ImageIcon, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';
import { useRouter } from 'next/router';
import { productRegisterSchema } from '@/validation/productRegisterSchema'
import { NEXT_ROUTER_PREFETCH_HEADER } from 'next/dist/client/components/app-router-headers'

type Currency = 'JPY' | 'USD'
type ProductType = 'webapp' | 'prompt'

type Prompt = {
  input: string;
  output: string;
  imageUrl: string | null;
}

type FormData = {
  type: ProductType;
  title: string;
  description: string;
  category: string;
  price: string;
  currency: Currency;
  features: string;
  demoUrl: string;
  promptCount: string;
  imageUrls: File[];
  prompts: Prompt[];
}

export default function ProductRegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    type: 'webapp',
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'JPY',
    features: '',
    demoUrl: '',
    promptCount: '',
    imageUrls: [],
    prompts: [{ input: '', output: '', imageUrl: null }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentPromptPage, setCurrentPromptPage] = useState(0)
  const { toast } = useToast()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImageUrls = Array.from(files)
      setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...newImageUrls] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }))
  }

  const handlePromptChange = (index: number, field: keyof Prompt, value: string) => {
    console.log('changing prompts')
    const newPrompts = [...formData.prompts]
    newPrompts[index] = { ...newPrompts[index], [field]: value }
    setFormData(prev => ({ ...prev, prompts: newPrompts }))
    setErrors(prev => ({ ...prev, [`prompts.${index}.${field}`]: '' }))
  }

  const handlePromptImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newPrompts = [...formData.prompts]
      newPrompts[index] = { ...newPrompts[index], imageUrl: URL.createObjectURL(file) }
      setFormData(prev => ({ ...prev, prompts: newPrompts }))
    }
  }

  const addPrompt = () => {
    setFormData(prev => ({
      ...prev,
      prompts: [...prev.prompts, { input: '', output: '', imageUrl: null }]
    }))
  }

  const removePrompt = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prompts: prev.prompts.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('formData:', formData);
    // const validatedData = productRegisterSchema.parse({
    //   ...formData,
    //   price: parseFloat(formData.price),
    //   promptCount: formData.type === 'prompt' ? parseInt(formData.promptCount) : undefined,
    // })
    // console.log('validatedData:', validatedData);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      await axios.post(`${apiUrl}/api/products/register`, {
        ...formData,
        type: formData.type === 'webapp' ? 'WEBAPP' : 'PROMPT',
        promptCount: formData.type === 'prompt' ? formData.promptCount : null,
        prompts: formData.type === 'prompt' ? formData.prompts : null,
      }, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      console.log('Product registered successfully');
      toast({
        title: "Success",
        description: "Your item has been listed for sale.",
      });
      router.push(`${apiUrl}/products`);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        });
        setErrors(newErrors);
        toast({
          title: "Error",
          description: "Please correct the errors in the form.",
          variant: "destructive",
        });
      } else {
        console.error('Product registration failed', error);
        toast({
          title: "Error",
          description: "Failed to register the product. Please try again.",
          variant: "destructive",
        });
      }
    }
  }

  const formatPrice = (price: string, currency: Currency) => {
    if (!price) return 'Price not set'
    const numPrice = parseFloat(price)
    return currency === 'JPY'
      ? `￥${Math.round(numPrice).toLocaleString()}`
      : `$${numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

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
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as ProductType }))}
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
                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Name</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter your item name" required />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your item" required />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

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
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <RadioGroup
                    defaultValue={formData.currency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value as Currency }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="JPY" id="jpy" />
                      <Label htmlFor="jpy">JPY (￥)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USD" id="usd" />
                      <Label htmlFor="usd">USD ($)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ({formData.currency === 'JPY' ? '￥' : '$'})</Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    pattern="[0-9]*\.?[0-9]*"
                    inputMode="decimal"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder={formData.currency === 'JPY' ? "0" : "0.00"}
                    required
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features (comma-separated)</Label>
                <Input id="features" name="features" value={formData.features} onChange={handleInputChange} placeholder="Feature 1, Feature 2, Feature 3" />
                {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}
              </div>

              {formData.type === 'webapp' && (
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input id="demoUrl" name="demoUrl" type="url" value={formData.demoUrl} onChange={handleInputChange} placeholder="https://your-app-demo.com" />
                  {errors.demoUrl && <p className="text-red-500 text-sm">{errors.demoUrl}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="images">Screenshots</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                  <Label
                    htmlFor="images"
                    className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                  </Label>
                  <span className="text-sm text-gray-500">Click to upload (PNG or JPG, up to 5)</span>
                </div>
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {formData.imageUrls.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(image)} alt={`Screenshot ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.imageUrls && <p className="text-red-500 text-sm">{errors.imageUrls}</p>}
              </div>

              {formData.type === 'prompt' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="promptCount">Number of Prompts</Label>
                    <Input id="promptCount" name="promptCount" type="number" min="1" value={formData.promptCount} onChange={handleInputChange} placeholder="Enter the number of prompts" required />
                    {errors.promptCount && <p className="text-red-500 text-sm">{errors.promptCount}</p>}
                  </div>

                  {formData.prompts.map((prompt, index) => (
                    <div key={index} className="space-y-2 border p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <Label>Prompt-Output Pair {index + 1}</Label>
                        {index > 0 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removePrompt(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        placeholder="Enter your prompt"
                        value={prompt.input}
                        onChange={(e) => handlePromptChange(index, 'input', e.target.value)}
                      />
                      {errors[`prompts.${index}.input`] && <p className="text-red-500 text-sm">{errors[`prompts.${index}.input`]}</p>}
                      <Textarea
                        placeholder="Enter the expected output"
                        value={prompt.output}
                        onChange={(e) => handlePromptChange(index, 'output', e.target.value)}
                      />
                      {errors[`prompts.${index}.output`] && <p className="text-red-500 text-sm">{errors[`prompts.${index}.output`]}</p>}
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
                            {prompt.imageUrl ? (
                              <img src={prompt.imageUrl} alt={`Prompt ${index + 1} output`} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            )}
                          </Label>
                          <span className="text-sm text-gray-500">Click to upload an image for this prompt's output</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPrompt}>
                    <Plus className="w-4 h-4 mr-2" /> Add Prompt-Output Pair
                  </Button>
                  {errors.prompts && <p className="text-red-500 text-sm">{errors.prompts}</p>}
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
              {formData.imageUrls.length > 0 && (
                <div className="relative w-full h-64">
                  <img src={URL.createObjectURL(formData.imageUrls[0])} alt="Item preview" className="w-full h-full object-cover rounded-lg" />
                  {formData.imageUrls.length > 1 && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                      {formData.imageUrls.map((_, index) => (
                        <div key={index} className="w-2 h-2 rounded-full bg-white mx-1" />
                      ))}
                    </div>
                  )}
                </div>
              )}
              <h2 className="text-2xl font-bold">{formData.title || 'Item Name'}</h2>
              <p className="text-gray-600">{formData.description || 'Item description will appear here'}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-green-600">
                  {formatPrice(formData.price, formData.currency)}
                </span>
              </div>
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
              {formData.type === 'prompt' && formData.prompts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Prompt Preview:</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-2">
                      <div className="bg-blue-100 p-2 rounded">
                        <p className="font-medium">Prompt:</p>
                        <p>{formData.prompts[currentPromptPage].input || 'Your prompt will appear here'}</p>
                      </div>
                      <div className="bg-green-100 p-2 rounded">
                        <p className="font-medium">Output:</p>
                        <p>{formData.prompts[currentPromptPage].output || 'Expected output will appear here'}</p>
                      </div>
                      {formData.prompts[currentPromptPage].imageUrl && (
                        <div className="mt-2">
                          <p className="font-medium">Output Image:</p>
                          <img
                            src={formData.prompts[currentPromptPage].imageUrl}
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
                      <span>{currentPromptPage + 1} / {formData.prompts.length}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPromptPage(prev => Math.min(formData.prompts.length - 1, prev + 1))}
                        disabled={currentPromptPage === formData.prompts.length - 1}
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
  )
}