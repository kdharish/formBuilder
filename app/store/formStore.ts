import { create } from 'zustand';
import type { Form, FormField } from '@/types/form';

interface FormState {
  forms: Form[];
  currentForm: Form | null;
  addForm: (form: Form) => void;
  updateForm: (form: Form) => void;
  deleteForm: (id: string) => void;
  setCurrentForm: (id: string) => void;
  addField: (formId: string, field: FormField) => void;
  updateField: (formId: string, fieldId: string, updates: Partial<FormField>) => void;
  removeField: (formId: string, fieldId: string) => void;
  reorderFields: (formId: string, fields: FormField[]) => void;
}

const saveToLocalStorage = (forms: Form[]) => {
  localStorage.setItem('formBuilder', JSON.stringify(forms));
};

export const useFormStore = create<FormState>((set) => ({
  forms: [],
  currentForm: null,

  addForm: (form) => {
    set((state) => {
      const newForms = [...state.forms, form];
      saveToLocalStorage(newForms);
      return {
        forms: newForms,
        currentForm: form,
      };
    });
  },

  updateForm: (form) => {
    set((state) => {
      const newForms = state.forms.map((f) =>
        f.id === form.id ? form : f
      );
      saveToLocalStorage(newForms);
      return {
        forms: newForms,
        currentForm: state.currentForm?.id === form.id ? form : state.currentForm,
      };
    });
  },

  deleteForm: (id) => {
    set((state) => {
      const newForms = state.forms.filter((form) => form.id !== id);
      saveToLocalStorage(newForms);
      return {
        forms: newForms,
        currentForm: state.currentForm?.id === id ? null : state.currentForm,
      };
    });
  },

  setCurrentForm: (id) => {
    set((state) => ({
      currentForm: state.forms.find((form) => form.id === id) || null,
    }));
  },

  addField: (formId, field) => {
    set((state) => {
      const newForms = state.forms.map((form) => {
        if (form.id === formId) {
          return {
            ...form,
            fields: [...form.fields, field],
            updatedAt: new Date(),
          };
        }
        return form;
      });

      const updatedForm = newForms.find((f) => f.id === formId) || null;
      saveToLocalStorage(newForms);
      
      return {
        forms: newForms,
        currentForm: updatedForm,
      };
    });
  },

  updateField: (formId, fieldId, updates) => {
    set((state) => {
      const newForms = state.forms.map((form) => {
        if (form.id === formId) {
          return {
            ...form,
            fields: form.fields.map((f) =>
              f.id === fieldId ? { ...f, ...updates } : f
            ),
            updatedAt: new Date(),
          };
        }
        return form;
      });

      const updatedForm = newForms.find((f) => f.id === formId) || null;
      saveToLocalStorage(newForms);

      return {
        forms: newForms,
        currentForm: updatedForm,
      };
    });
  },

  removeField: (formId, fieldId) => {
    set((state) => {
      const newForms = state.forms.map((form) => {
        if (form.id === formId) {
          return {
            ...form,
            fields: form.fields.filter((f) => f.id !== fieldId),
            updatedAt: new Date(),
          };
        }
        return form;
      });

      const updatedForm = newForms.find((f) => f.id === formId) || null;
      saveToLocalStorage(newForms);

      return {
        forms: newForms,
        currentForm: updatedForm,
      };
    });
  },

  reorderFields: (formId, fields) => {
    set((state) => {
      const newForms = state.forms.map((form) => {
        if (form.id === formId) {
          return {
            ...form,
            fields,
            updatedAt: new Date(),
          };
        }
        return form;
      });

      const updatedForm = newForms.find((f) => f.id === formId) || null;
      saveToLocalStorage(newForms);

      return {
        forms: newForms,
        currentForm: updatedForm,
      };
    });
  },
})); 