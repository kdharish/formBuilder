'use client';

import { useForm } from 'react-hook-form';
import { useFormStore } from '../store/formStore';
import Link from 'next/link';
import { useState } from 'react';

type FormData = Record<string, unknown>;

export default function PreviewPage() {
  const { fields } = useFormStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log(data);
    setSubmitted(true);
  };

  if (fields.length === 0) {
    return (
      <div className="page-container">
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Form Fields Added</h2>
          <p className="text-gray-600 mb-6">Please add some fields to your form first.</p>
          <Link href="/" className="btn btn-primary">
            Go Back to Form Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Form Preview</h1>
          <Link href="/" className="btn btn-secondary">
            Back to Editor
          </Link>
        </div>

        {submitted ? (
          <div className="card text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Form Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for submitting the form.</p>
            <button 
              onClick={() => setSubmitted(false)} 
              className="btn btn-primary"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="form-field">
                  <label className="field-label">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      {...register(field.id, { required: field.required })}
                      placeholder={field.placeholder}
                      className="input-field"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      {...register(field.id, { required: field.required })}
                      placeholder={field.placeholder}
                      className="input-field min-height-100"
                    />
                  )}

                  {field.type === 'radio' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <label key={index} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            {...register(field.id, { required: field.required })}
                            value={option}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'checkbox' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <label key={index} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(field.id, { required: field.required })}
                            value={option}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'select' && field.options && (
                    <select
                      {...register(field.id, { required: field.required })}
                      className="input-field"
                    >
                      <option value="">Select an option</option>
                      {field.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {errors[field.id] && (
                    <p className="text-sm text-red-500 mt-1">This field is required</p>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button type="submit" className="btn btn-primary">
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 