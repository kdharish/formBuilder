'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormStore } from '../store/formStore';
import Link from 'next/link';

export type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'radio' | 'checkbox' | 'select';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  options?: string[];
}

export default function FormBuilder() {
  const { fields, addField, updateField, removeField, reorderFields, loadForm } = useFormStore();
  const [selectedField, setSelectedField] = useState<FormField | null>(null);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  useEffect(() => {
    if (selectedField) {
      const updatedField = fields.find(f => f.id === selectedField.id);
      if (updatedField) {
        setSelectedField(updatedField);
      }
    }
  }, [fields, selectedField]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over?.id);
      const newFields = arrayMove([...fields], oldIndex, newIndex);
      reorderFields(newFields);
    }
  };

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type} field`,
      required: false,
      options: type === 'radio' || type === 'checkbox' || type === 'select' ? ['Option 1'] : undefined,
    };
    addField(newField);
  };

  const handleRemoveField = (id: string) => {
    removeField(id);
    if (selectedField?.id === id) {
      setSelectedField(null);
    }
  };

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    if (selectedField) {
      updateField(selectedField.id, updates);
    }
  };

  const handleOptionsChange = (value: string) => {
    // Split by both commas and newlines, then filter out empty strings and trim whitespace
    const options = value
      .split(/[,\n]/)
      .map(option => option.trim())
      .filter(option => option.length > 0);
    
    handleFieldUpdate({ options });
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Builder</h1>
        <p className="text-gray-600">Create and customize your form by adding fields and configuring their properties.</p>
      </div>

      <div className="flex gap-6">
        {/* Form Elements Panel */}
        <div className="w-1/4">
          <div className="card sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Elements</h2>
            <div className="form-section">
              <button
                onClick={() => handleAddField('text')}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <span>Text Input</span>
              </button>
              <button
                onClick={() => handleAddField('textarea')}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <span>Textarea</span>
              </button>
              <button
                onClick={() => handleAddField('radio')}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <span>Radio Buttons</span>
              </button>
              <button
                onClick={() => handleAddField('checkbox')}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <span>Checkbox</span>
              </button>
              <button
                onClick={() => handleAddField('select')}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <span>Dropdown</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Builder Panel */}
        <div className="w-1/2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Form Preview</h2>
              <Link href="/preview" >
                Preview Form
              </Link>
            </div>
            
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                <div className="form-section">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`draggable-item ${selectedField?.id === field.id ? 'ring-2 ring-indigo-500' : ''}`}
                      onClick={() => setSelectedField(field)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{field.label}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveField(field.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      {field.placeholder && (
                        <p className="text-sm text-gray-500 mt-1">{field.placeholder}</p>
                      )}
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <p className="text-gray-500">Add form elements from the left panel</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Field Settings Panel */}
        <div className="w-1/4">
          <div className="card sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Field Settings</h2>
            {selectedField ? (
              <div className="form-section">
                <div>
                  <label className="field-label">Label</label>
                  <input
                    type="text"
                    value={selectedField.label}
                    onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="field-label">Placeholder</label>
                  <input
                    type="text"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedField.required}
                      onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Required field</span>
                  </label>
                </div>
                {(selectedField.type === 'radio' ||
                  selectedField.type === 'checkbox' ||
                  selectedField.type === 'select') && (
                  <div>
                    <label className="field-label">Options</label>
                    <textarea
                      value={selectedField.options?.join(', ') || ''}
                      onChange={(e) => handleOptionsChange(e.target.value)}
                      className="input-field"
                      rows={4}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter options separated by commas or new lines
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Select a field to edit its properties
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function arrayMove<T>(array: T[], from: number, to: number) {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
  return newArray;
} 