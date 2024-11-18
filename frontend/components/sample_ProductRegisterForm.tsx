import React, { useState } from 'react';
import FormSection, { FormData, PromptPair } from './ui/products/formSection';
import PreviewSection from './ui/products/previewSection';

export default function ProductRegisterForm() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [promptPairs, setPromptPairs] = useState<PromptPair[]>([{ input: '', output: '', image: null }]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentPromptPage, setCurrentPromptPage] = useState(0);

  const handleFormSubmit = (data: FormData) => {
    setFormData({...data, features: data.features || ""});
    // API送信処理をここに追加できます
  };

  const handlePromptPairChange = (index: number, field: 'input' | 'output', value: string) => {
    const updatedPairs = [...promptPairs];
    updatedPairs[index][field] = value;
    setPromptPairs(updatedPairs);
  };

  const addPromptPair = () => setPromptPairs([...promptPairs, { input: '', output: '', image: null }]);
  const removePromptPair = (index: number) => setPromptPairs(promptPairs.filter((_, i) => i !== index));
  
  
  return (
    <div className="container mx-auto">
      <FormSection
        onSubmit={handleFormSubmit}
        promptPairs={promptPairs}
        onPromptPairChange={handlePromptPairChange}
        onAddPromptPair={addPromptPair}
        onRemovePromptPair={removePromptPair}
        setImagePreview={setImagePreview} // Image previewの設定を追加
      />
      {formData && (
        <PreviewSection
          formData={formData}
          imagePreview={imagePreview}
          promptPairs={promptPairs}
          currentPromptPage={currentPromptPage}
          setCurrentPromptPage={setCurrentPromptPage}
        />
      )}
    </div>
  );
}
