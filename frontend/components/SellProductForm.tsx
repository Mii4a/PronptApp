import { useState } from 'react';
import axios from 'axios';

const SellProductForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('prompt');  // プロンプトかアプリかを選択
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product = { title, description, content, type, price };
    await axios.post('/api/products/create', product);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        placeholder="Content (Prompt or App Link)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="prompt">Prompt</option>
        <option value="app">App</option>
      </select>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
      />
      <button type="submit">Create Product</button>
    </form>
  );
};

export default SellProductForm;
