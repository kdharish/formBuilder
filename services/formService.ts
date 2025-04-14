import { Form } from '@/types/form';

const STORAGE_KEY = 'forms';

export const formService = {
  getForms: (): Form[] => {
    if (typeof window === 'undefined') return [];
    const forms = localStorage.getItem(STORAGE_KEY);
    return forms ? JSON.parse(forms) : [];
  },

  saveForm: (form: Form): void => {
    const forms = formService.getForms();
    const existingFormIndex = forms.findIndex((f) => f.id === form.id);

    if (existingFormIndex >= 0) {
      forms[existingFormIndex] = form;
    } else {
      forms.push(form);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  },

  deleteForm: (id: string): void => {
    const forms = formService.getForms();
    const updatedForms = forms.filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
  },
}; 