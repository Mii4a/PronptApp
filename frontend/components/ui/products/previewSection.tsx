// PreviewSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

type FormData = {
  type: 'webapp' | 'prompt';
  title: string;
  description: string;
  category: string;
  price: number;
  features: string;
  demoUrl?: string;
  promptCount?: number;
  image?: File | null;
};

type PromptPair = {
  input: string;
  output: string;
  image: File | null;
};

interface PreviewSectionProps {
  formData: FormData;
  imagePreview: string | null;
  promptPairs: PromptPair[];
  currentPromptPage: number;
  setCurrentPromptPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PreviewSection({
  formData,
  imagePreview,
  promptPairs,
  currentPromptPage,
  setCurrentPromptPage,
}: PreviewSectionProps) {
  return (
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
                {(formData.features || '').split(',').map((feature, index) => (
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
                    <p>{promptPairs[currentPromptPage].input || 'Your prompt will appear here'}</p>
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
                    onClick={() => setCurrentPromptPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPromptPage === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                  <span>{currentPromptPage + 1} / {promptPairs.length}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPromptPage((prev) => Math.min(promptPairs.length - 1, prev + 1))}
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
  );
}
