import { FormField } from '../FormBuilder';
import BaseField from './BaseField';
import { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';

interface RadioFieldProps {
  field: FormField;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
}

export default function RadioField({ field, register, errors }: RadioFieldProps) {
  const validation: RegisterOptions<Record<string, unknown>, string> = {
    required: field.required,
  };

  return (
    <BaseField field={field} register={register} errors={errors}>
      <div className="space-y-2">
        {field.options?.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="radio"
              value={option}
              {...register(field.id, validation)}
              className="form-radio"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </BaseField>
  );
} 