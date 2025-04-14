'use client';

import { useEffect, useState } from 'react';
import type { Form, FormField } from '@/types/form';

interface FormData {
  [key: string]: string | string[];
}

export default function SubmitForm({ params }: { params: { formId: string } }) {
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedForms = localStorage.getItem('formBuilder');
    if (savedForms) {
      try {
        const forms = JSON.parse(savedForms);
        const foundForm = forms.find((f: Form) => f.id === params.formId);
        setForm(foundForm || null);
      } catch (error) {
        console.error('Error loading form:', error);
      }
    }
  }, [params.formId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const handleFieldChange = (field: FormField, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field.id]: value
    }));
  };

  const handleCheckboxChange = (field: FormField, option: string, checked: boolean) => {
    const currentValues = (formData[field.id] as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter(v => v !== option);
    }

    setFormData(prev => ({
      ...prev,
      [field.id]: newValues
    }));
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      required: field.required,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleFieldChange(field, e.target.value),
      value: formData[field.id] || '',
      className: field.type === 'textarea' ? 'form-textarea' : 'form-input',
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
                  checked={formData[field.id] === option}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const selectedValues = (formData[field.id] as string[]) || [];
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field.id}
                  value={option}
                  required={field.required && selectedValues.length === 0}
                  checked={selectedValues.includes(option)}
                  onChange={(e) => handleCheckboxChange(field, option, e.target.checked)}
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

  if (!form) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="text-center text-gray-500">
            Form not found
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page-container max-w-3xl mx-auto">
        <div className="card">
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-2">Form Submitted!</h2>
            <p className="text-gray-500">Thank you for your submission.</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => {
                setSubmitted(false);
                setFormData({});
              }}
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">{form.name}</h1>
        {form.description && (
          <p className="text-gray-500 mb-6">{form.description}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="form-field">
              <label className="form-label">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
} 