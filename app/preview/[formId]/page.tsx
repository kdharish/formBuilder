'use client';

import { useEffect, useState } from 'react';
import type { Form } from '@/types/form';
import FormPreview from '@/app/components/FormPreview';

export default function PreviewForm({ params }: { params: { formId: string } }) {
  const [form, setForm] = useState<Form | null>(null);

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

  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">{form.name}</h1>
        {form.description && (
          <p className="text-gray-500 mb-6">{form.description}</p>
        )}
        <div className="border-t border-gray-200 pt-6">
          <FormPreview fields={form.fields} readOnly />
        </div>
      </div>
    </div>
  );
} 