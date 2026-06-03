import { LucideIcon } from "lucide-react";

export interface FieldOption {
  value: string;
  label: string;
  icon?: string;
  cities?: string[];
}

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'checkbox' | 'file' | 'review' | 'conditional';
  required?: boolean;
  placeholder?: string;
  hint?: string | ((formData: any) => string);
  tooltip?: string;
  icon?: string;
  options?: FieldOption[];
  min?: number;
  max?: number;
  accept?: string;
  capture?: "user" | "environment";
  dependsOn?: string;
  dynamic?: boolean;
  info?: (value: string) => { title: string; description: string } | null;
  condition?: (formData: any) => boolean;
  fields?: FieldConfig[]; // For conditional or review sections
  format?: (value: any) => string; // For review fields
  validation?: (value: any) => string | null;
  grid?: 'full' | 'half' | 'third' | 'two-thirds';
}

export interface StepConfig {
  id: string;
  title: string;
  description: string;
  fields: FieldConfig[];
}

export interface KYCFormConfig {
  formId: string;
  title: string;
  description: string;
  totalSteps: number;
  steps: StepConfig[];
  submitText: string;
  successMessage: string;
  disclaimer: string;
}

export interface FormData {
  [key: string]: any;
}