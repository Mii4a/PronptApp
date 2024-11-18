import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormData } from './formSection';

export default function ImageUpload({ register, errors }: { register: UseFormRegister<FormData>; errors: FieldErrors<FormData> }) {
  return (
    <div>
      <input type="file" {...register('image')} />
      {errors.image && <p>{errors.image.message}</p>}
    </div>
  );
}
