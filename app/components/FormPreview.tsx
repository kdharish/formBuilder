'use client';

import type { FormField } from '@/types/form';

interface FormPreviewProps {
  fields: FormField[];
  readOnly?: boolean;
}

export default function FormPreview({ fields, readOnly = false }: FormPreviewProps) {
  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      required: field.required,
      className: field.type === 'textarea' ? 'form-textarea' : 'form-input',
      readOnly,
      disabled: readOnly,
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} />;

      case 'select':
        return (
          <select {...commonProps} className="form-select">
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  required={field.required}
                  disabled={readOnly}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field.id}
                  value={option}
                  required={field.required && !readOnly}
                  disabled={readOnly}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  if (fields.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        No fields added yet. Start adding fields to see the preview.
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {fields.map((field) => (
        <div key={field.id} className="form-field">
          <label className="form-label">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      {!readOnly && (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      )}
    </form>
  );
} 