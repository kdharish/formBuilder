import { create } from 'zustand';
import { Form } from '@/types/form';
import { formService } from '@/services/formService';

interface FormStore {
  forms: Form[];
  setForms: (forms: Form[]) => void;
  addForm: (form: Form) => void;
  updateForm: (form: Form) => void;
  deleteForm: (id: string) => void;
  loadForms: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  forms: [],
  
  setForms: (forms) => set({ forms }),
  
  addForm: (form) => {
    set((state) => ({ forms: [...state.forms, form] }));
    formService.saveForm(form);
  },
  
  updateForm: (form) => {
    set((state) => ({
      forms: state.forms.map((f) => (f.id === form.id ? form : f)),
    }));
    formService.saveForm(form);
  },
  
  deleteForm: (id) => {
    set((state) => ({
      forms: state.forms.filter((f) => f.id !== id),
    }));
    formService.deleteForm(id);
  },

  loadForms: () => {
    const forms = formService.getForms();
    set({ forms });
  },
})); 