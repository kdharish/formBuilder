import { FormField } from '../FormBuilder';
import BaseField from './BaseField';
import { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';

interface SelectFieldProps {
  field: FormField;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
}

export default function SelectField({ field, register, errors }: SelectFieldProps) {
  const validation: RegisterOptions<Record<string, unknown>, string> = {
    required: field.required,
  };

  return (
    <BaseField field={field} register={register} errors={errors}>
      <select
        {...register(field.id, validation)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </BaseField>
  );
} 