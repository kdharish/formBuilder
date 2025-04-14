'use client';

import { useState, useEffect } from 'react';
import { useFormStore } from '../store/formStore';
import type { Form, FormField } from '@/types/form';
import FieldControls from '../components/FieldControls';
import FormPreview from '../components/FormPreview';

export default function Builder() {
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [currentFields, setCurrentFields] = useState<FormField[]>([]);
  const { forms, addForm } = useFormStore();

  useEffect(() => {
    const savedForms = localStorage.getItem('formBuilder');
    if (savedForms) {
      try {
        const parsedForms = JSON.parse(savedForms);
        useFormStore.setState({ forms: parsedForms });
      } catch (error) {
        console.error('Error loading forms:', error);
      }
    }
  }, []);

  const handleCreateForm = () => {
    const newForm: Form = {
      id: Date.now().toString(),
      name: formName,
      description: formDescription,
      fields: currentFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addForm(newForm);
    setFormName('');
    setFormDescription('');
    setCurrentFields([]);
  };

  const handleAddField = (field: FormField) => {
    setCurrentFields((prev) => [...prev, field]);
  };

  return (
    <div className="page-container">
      {/* Form Details */}
      <div className="card mb-6">
        <h1 className="text-xl font-semibold mb-6">Create New Form</h1>
        
        <div className="form-section">
          <div className="mb-4">
            <label htmlFor="name" className="form-label">
              Form Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Form Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Enter form description"
            />
          </div>
        </div>
      </div>

      {/* Form Builder and Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Add Form Fields</h2>
            <FieldControls onAddField={handleAddField} />
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handleCreateForm}
            disabled={!formName.trim() || currentFields.length === 0}
          >
            Save Form
          </button>
        </div>

        {/* Right Column - Live Preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Form Preview</h2>
              {formName && (
                <div className="text-sm text-gray-500">
                  {currentFields.length} field{currentFields.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            {formName && (
              <>
                <h3 className="text-xl font-medium mb-2">{formName}</h3>
                {formDescription && (
                  <p className="text-gray-500 mb-6">{formDescription}</p>
                )}
              </>
            )}
            <div className={formName ? 'border-t border-gray-200 pt-6' : ''}>
              <FormPreview fields={currentFields} />
            </div>
          </div>
        </div>
      </div>

      {/* Existing Forms Section */}
      {forms.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <div key={form.id} className="card bg-gray-50">
                <h3 className="text-lg font-medium">{form.name}</h3>
                {form.description && (
                  <p className="text-gray-500 mt-1">{form.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {form.fields.length} fields
                </p>
                <div className="flex gap-2 mt-4">
                  <a
                    href={`/preview/${form.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Preview
                  </a>
                  <a
                    href={`/submit/${form.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Open Form
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 