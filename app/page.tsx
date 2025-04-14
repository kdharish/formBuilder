'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormStore } from '@/store/formStore';
import { Form } from '@/types/form';
import { FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';

export default function FormsListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { forms, loadForms, deleteForm } = useFormStore();

  useEffect(() => {
    const fetchForms = async () => {
      await loadForms();
      setIsLoading(false);
    };
    fetchForms();
  }, [loadForms]);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Forms</h1>
          <Link href="/builder" className="btn btn-primary">
            Create New Form
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No forms have been created yet.</p>
            <Link href="/builder" className="btn btn-primary">
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form: Form) => (
              <div key={form.id} className="card">
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{form.name}</h2>
                  <p className="text-gray-600 mb-4 flex-grow">{form.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    {form.fields.length} field{form.fields.length === 1 ? '' : 's'}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/builder/${form.id}`}
                      className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </Link>
                    <Link
                      href={`/preview/${form.id}`}
                      className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <FiFileText className="w-4 h-4" />
                      Fill
                    </Link>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="btn btn-secondary flex items-center justify-center w-10"
                      aria-label="Delete form"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
