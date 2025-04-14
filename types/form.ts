export interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Form {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt?: Date;
  updatedAt?: Date;
} 