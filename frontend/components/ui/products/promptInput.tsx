import React from 'react';
import { PromptPair } from './formSection';

export default function PromptInput({
  promptPairs,
  onPromptPairChange,
  onAddPromptPair,
  onRemovePromptPair
}: {
  promptPairs: PromptPair[];
  onPromptPairChange: (index: number, field: 'input' | 'output', value: string) => void;
  onAddPromptPair: () => void;
  onRemovePromptPair: (index: number) => void;
}) {
  return (
    <>
      {promptPairs.map((pair, index) => (
        <div key={index}>
          <textarea
            value={pair.input}
            onChange={(e) => onPromptPairChange(index, 'input', e.target.value)}
            placeholder="Input"
          />
          <textarea
            value={pair.output}
            onChange={(e) => onPromptPairChange(index, 'output', e.target.value)}
            placeholder="Output"
          />
          <button onClick={() => onRemovePromptPair(index)}>Remove</button>
        </div>
      ))}
      <button onClick={onAddPromptPair}>Add Prompt</button>
    </>
  );
}
