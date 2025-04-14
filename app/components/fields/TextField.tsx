import { FormField } from '../FormBuilder';
import BaseField from './BaseField';
import { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';

interface TextFieldProps {
  field: FormField;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
}

export default function TextField({ field, register, errors }: TextFieldProps) {
  const inputType = field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text';

  const validation: RegisterOptions<Record<string, unknown>, string> = {
    required: field.required,
  };

  if (field.validation) {
    if (field.validation.minLength) {
      validation.minLength = {
        value: field.validation.minLength,
        message: `Minimum length is ${field.validation.minLength}`,
      };
    }
    if (field.validation.maxLength) {
      validation.maxLength = {
        value: field.validation.maxLength,
        message: `Maximum length is ${field.validation.maxLength}`,
      };
    }
    if (field.validation.pattern) {
      validation.pattern = {
        value: new RegExp(field.validation.pattern),
        message: 'Invalid format',
      };
    }
  }

  return (
    <BaseField field={field} register={register} errors={errors}>
      <input
        type={inputType}
        {...register(field.id, validation)}
        className="w-full p-2 border rounded"
        placeholder={field.placeholder}
      />
    </BaseField>
  );
} 