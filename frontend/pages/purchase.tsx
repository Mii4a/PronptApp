import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PurchasePage: React.FC = () => {
  const [itemType, setItemType] = useState<'webapp' | 'prompt'>('webapp');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<string>('prompt');
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product = { title, description, content, type, price };
    try {
      const response = await axios.post('/api/purchase', { product_id: id });
      const { id: sessionId } = response.data;
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (err) {
      setError('Failed to initiate purchase.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sell Your Web App or Prompt Collection</CardTitle>
          <CardDescription>Fill in the details about your item to list it for sale.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Item Type</Label>
              <RadioGroup defaultValue="webapp" onValueChange={(value) => setItemType(value as 'webapp' | 'prompt')}>
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
              <Label htmlFor="item-name">Name</Label>
              <Input id="item-name" placeholder="Enter your item name" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea id="item-description" placeholder="Describe your item" required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select>
                  <SelectTrigger id="item-category">
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
                <Label htmlFor="item-price">Price ($)</Label>
                <Input id="item-price" type="number" min="0" step="0.01" placeholder="0.00" required value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-features">Key Features (comma-separated)</Label>
              <Input id="item-features" placeholder="Feature 1, Feature 2, Feature 3" />
            </div>
            
            {itemType === 'webapp' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="app-demo-url">Demo URL</Label>
                  <Input id="app-demo-url" type="url" placeholder="https://your-app-demo.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app-screenshots">Screenshots</Label>
                  <Input id="app-screenshots" type="file" multiple accept="image/*" />
                  <p className="text-sm text-muted-foreground">Upload up to 5 screenshots of your app (PNG or JPG)</p>
                </div>
              </>
            )}

            {itemType === 'prompt' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="prompt-count">Number of Prompts</Label>
                  <Input id="prompt-count" type="number" min="1" placeholder="Enter the number of prompts" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prompt-preview">Sample Prompt</Label>
                  <Textarea id="prompt-preview" placeholder="Enter a sample prompt from your collection" />
                </div>
              </>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch id="terms" />
              <Label htmlFor="terms">I agree to the terms and conditions</Label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">List My Item for Sale</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PurchasePage;