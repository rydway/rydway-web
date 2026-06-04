import React from "react";
import { FormField } from "./FormField";
import { StepConfig } from "@/types/kyc";

interface FormStepProps {
  step: StepConfig;
  formData: Record<string, any>;
  errors: Record<string, string>;
  filePreviews: Record<string, string>;
  availableCities: string[];
  selectedState: string;
  onFieldChange: (fieldId: string, value: any) => void;
  onFileUpload: (fieldId: string, file: File) => void;
  onRemoveFile: (fieldId: string) => void;
}

export const FormStep: React.FC<FormStepProps> = ({
  step,
  formData,
  errors,
  filePreviews,
  availableCities,
  selectedState,
  onFieldChange,
  onFileUpload,
  onRemoveFile
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {step.title}
        </h2>
        <p className="text-slate-600">
          {step.description}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {step.fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={formData[field.id]}
              error={errors[field.id]}
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
    </div>
  );
};