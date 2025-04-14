'use client';

import { useState } from 'react';
import type { FormField } from '@/types/form';

interface FieldControlsProps {
  onAddField: (field: FormField) => void;
}

const FIELD_TYPES = [
  { id: 'text', label: 'Text Input', icon: '📝' },
  { id: 'textarea', label: 'Text Area', icon: '📄' },
  { id: 'number', label: 'Number', icon: '🔢' },
  { id: 'radio', label: 'Radio Group', icon: '⭕' },
  { id: 'checkbox', label: 'Checkbox Group', icon: '☑️' },
  { id: 'select', label: 'Dropdown', icon: '▼' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'tel', label: 'Phone', icon: '📱' },
];

export default function FieldControls({ onAddField }: FieldControlsProps) {
  const [showFieldConfig, setShowFieldConfig] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState('');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');

  const handleAddField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: selectedType,
      label: fieldLabel,
      required: fieldRequired,
      placeholder: fieldPlaceholder,
      options: fieldOptions.split(',').map(opt => opt.trim()).filter(Boolean),
    };

    onAddField(newField);
    resetForm();
  };

  const resetForm = () => {
    setShowFieldConfig(false);
    setSelectedType('');
    setFieldLabel('');
    setFieldRequired(false);
    setFieldOptions('');
    setFieldPlaceholder('');
  };

  const needsOptions = ['radio', 'select', 'checkbox'].includes(selectedType);

  return (
    <div className="space-y-4">
      {!showFieldConfig ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FIELD_TYPES.map((type) => (
            <button
              key={type.id}
              className="card hover:border-primary p-4 text-center cursor-pointer"
              onClick={() => {
                setSelectedType(type.id);
                setShowFieldConfig(true);
              }}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Configure {selectedType} Field</h3>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Field Label</label>
              <input
                type="text"
                className="form-input"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            {!needsOptions && (
              <div>
                <label className="form-label">Placeholder</label>
                <input
                  type="text"
                  className="form-input"
                  value={fieldPlaceholder}
                  onChange={(e) => setFieldPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
            )}

            {needsOptions && (
              <div>
                <label className="form-label">Options (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={fieldOptions}
                  onChange={(e) => setFieldOptions(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fieldRequired}
                  onChange={(e) => setFieldRequired(e.target.checked)}
                />
                <span className="text-sm font-medium">Required field</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleAddField}
                disabled={!fieldLabel.trim() || (needsOptions && !fieldOptions.trim())}
              >
                Add Field
              </button>
              <button
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 