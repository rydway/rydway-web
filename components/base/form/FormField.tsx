import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload, X, CheckCircle2, HelpCircle, Info } from "lucide-react";

import { FieldConfig } from "@/@types/kyc";
import { iconMap } from "@/lib/icons";

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  error?: string;
  formData: Record<string, any>;
  filePreviews: Record<string, string>;
  availableCities: string[];
  selectedState: string;
  onFieldChange: (fieldId: string, value: any) => void;
  onFileUpload: (fieldId: string, file: File) => void;
  onRemoveFile: (fieldId: string) => void;
  dependencies?: Record<string, any>;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  formData,
  filePreviews,
  availableCities,
  selectedState,
  onFieldChange,
  onFileUpload,
  onRemoveFile,
  dependencies
}) => {
  const IconComponent = field.icon ? iconMap[field.icon] : null;
  
  // Skip rendering if condition is not met
  if (field.condition && !field.condition(formData)) {
    return null;
  }
  
  // Handle dependent fields
  if (field.dependsOn && !formData[field.dependsOn]) {
    return renderDependentField(field);
  }
  
  switch (field.type) {
    case 'select':
      return renderSelectField(field, value, error);
    case 'file':
      return renderFileField(field, value, error, filePreviews[field.id]);
    case 'checkbox':
      return renderCheckboxField(field, value, error);
    case 'review':
      return renderReviewField(field, formData);
    case 'conditional':
      return renderConditionalFields(field, formData);
    default:
      return renderInputField(field, value, error);
  }
  
  function renderDependentField(field: FieldConfig) {
    return (
      <div key={field.id} className={getGridClass(field.grid)}>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          {field.tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{field.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <Select disabled>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder={`Select ${field.dependsOn} first`} />
          </SelectTrigger>
        </Select>
      </div>
    );
  }
  
  function renderInputField(field: FieldConfig, value: any, error?: string) {
    return (
      <div key={field.id} className={getGridClass(field.grid)}>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          {field.tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{field.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="relative">
          {IconComponent && (
            <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          )}
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            className={`h-12 ${IconComponent ? 'pl-11' : ''} rounded-lg border-slate-300 ${error ? 'border-red-500' : ''}`}
            min={field.min}
            max={field.max}
          />
        </div>
        {field.hint && typeof field.hint === 'string' && (
          <p className="text-xs text-slate-500 mt-1">{field.hint}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {field.info && value && renderInfoBox(field.info(value))}
      </div>
    );
  }
  
  function renderSelectField(field: FieldConfig, value: any, error?: string) {
    // Special handling for dynamic city dropdown
    if (field.id === 'businessCity' || field.id === 'city') {
      return (
        <div key={field.id} className={getGridClass(field.grid)}>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.tooltip && (
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{field.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <Select 
            value={value} 
            onValueChange={(val) => onFieldChange(field.id, val)}
            disabled={!selectedState}
          >
            <SelectTrigger className={`h-12 w-full ${error ? 'border-red-500' : ''}`}>
              <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );
    }
    
    return (
      <div key={field.id} className={getGridClass(field.grid)}>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          {field.tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{field.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <Select 
          value={value} 
          onValueChange={(val) => onFieldChange(field.id, val)}
        >
          <SelectTrigger className={`h-12 w-full ${error ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => {
              const OptionIcon = option.icon ? iconMap[option.icon] : null;
              return (
                <SelectItem key={option.value} value={option.value}>
                  {OptionIcon ? (
                    <div className="flex items-center gap-2">
                      <OptionIcon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  ) : (
                    option.label
                  )}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {field.info && value && renderInfoBox(field.info(value))}
      </div>
    );
  }
  
  function renderFileField(field: FieldConfig, value: File | null, error?: string, preview?: string) {
    const hint = typeof field.hint === 'function' ? field.hint(formData) : field.hint;
    
    return (
      <div key={field.id} className={getGridClass(field.grid)}>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-900">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
          
          {!value ? (
            <div
              onClick={() => document.getElementById(`${field.id}-upload`)?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center gap-3 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <Upload className="h-8 w-8 text-primary" />
              <p className="text-sm text-slate-600">Tap to upload</p>
              <p className="text-xs text-slate-400">
                {field.accept?.includes('pdf') ? 'PDF or image, max 10MB' : 'PNG or JPG, max 10MB'}
              </p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              <img src={preview} alt="Upload preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => onRemoveFile(field.id)}
                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-lg hover:bg-slate-50 transition-colors"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Uploaded</span>
              </div>
            </div>
          )}
          <input
            id={`${field.id}-upload`}
            type="file"
            accept={field.accept}
            capture={field.capture}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFileUpload(field.id, e.target.files[0])}
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    );
  }
  
  function renderCheckboxField(field: FieldConfig, value: boolean, error?: string) {
    return (
      <div key={field.id} className={getGridClass(field.grid)}>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={field.id}
            checked={value}
            onCheckedChange={(checked) => onFieldChange(field.id, checked)}
          />
          <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
            {field.label}
          </Label>
          {field.tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-slate-400 ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{field.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
  
  function renderReviewField(field: FieldConfig, formData: Record<string, any>) {
    if (!field.fields) return null;
    
    return (
      <div key={field.id} className={getGridClass(field.grid)}>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">{field.label}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {field.fields.map((reviewField) => {
              const value = formData[reviewField.id];
              const formattedValue = reviewField.format ? reviewField.format(value) : value;
              return (
                <div key={reviewField.id}>
                  <p className="text-sm text-slate-500">{reviewField.label}</p>
                  <p className="font-medium">{formattedValue || 'Not provided'}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  function renderConditionalFields(field: FieldConfig, formData: Record<string, any>) {
    if (!field.fields) return null;
    
    return (
      <div key={field.id} className="space-y-6 border-t pt-6">
        <div>
          <h3 className="text-lg font-medium text-slate-900">{field.label}</h3>
          {field.tooltip && <p className="text-sm text-slate-500">{field.tooltip}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {field.fields.map((subField) => (
            <FormField
              key={subField.id}
              field={subField}
              value={formData[subField.id]}
              formData={formData}
              filePreviews={filePreviews}
              availableCities={availableCities}
              selectedState={selectedState}
              onFieldChange={onFieldChange}
              onFileUpload={onFileUpload}
              onRemoveFile={onRemoveFile}
            />
          ))}
        </div>
      </div>
    );
  }
  
  function renderInfoBox(info: { title: string; description: string } | null) {
    if (!info) return null;
    
    return (
      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary mb-1">{info.title}</p>
            <p className="text-xs text-slate-600">{info.description}</p>
          </div>
        </div>
      </div>
    );
  }
  
  function getGridClass(grid?: 'full' | 'half' | 'third' | 'two-thirds') {
    switch (grid) {
      case 'half':
        return "md:col-span-1";
      case 'third':
        return "md:col-span-1";
      case 'two-thirds':
        return "md:col-span-2";
      case 'full':
      default:
        return "md:col-span-2";
    }
  }
};