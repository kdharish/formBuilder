import { FormField } from '../FormBuilder';
import { UseFormRegister, FieldErrors, FieldError } from 'react-hook-form';
import { ReactNode } from 'react';

interface BaseFieldProps {
  field: FormField;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
  children: ReactNode;
}

export default function BaseField({ field, errors, children }: BaseFieldProps) {
  const error = errors[field.id] as FieldError | undefined;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
} 