"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormStep } from "../../base/form/FormStep";
import { ChevronLeft, ChevronRight, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KYCFormConfig } from "@/types/kyc";
import { toast } from "sonner";

interface KYCFormProps {
  config: KYCFormConfig;
  onSubmit?: (data: Record<string, any>) => Promise<void>;
  initialData?: Record<string, any>;
}

export const KYCForm: React.FC<KYCFormProps> = ({
  config,
  onSubmit,
  initialData = {}
}) => {
  const router = useRouter();
  const formCacheKey = `kyc_form_${config.formId}`;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
  const [selectedState, setSelectedState] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(formCacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.step) setStep(parsed.step);
        if (parsed.formData) setFormData(parsed.formData);
      }
    } catch (e) {
      console.error("Failed to load cached form data", e);
    }
    setIsInitialized(true);
  }, [formCacheKey]);

  // Save to localStorage when step or formData changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(formCacheKey, JSON.stringify({ step, formData }));
      } catch (e) {
        console.error("Failed to cache form data", e);
      }
    }
  }, [step, formData, formCacheKey, isInitialized]);

  const currentStep = config.steps[step - 1];

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    // Handle state selection for dynamic cities
    if (fieldId === 'businessState' || fieldId === 'state') {
      setSelectedState(value);
      setFormData(prev => ({ 
        ...prev, 
        businessCity: fieldId === 'businessState' ? '' : prev.businessCity,
        city: fieldId === 'state' ? '' : prev.city
      }));
      
      const stateField = currentStep.fields.find(f => f.id === fieldId);
      const selectedStateData = stateField?.options?.find(opt => opt.value === value);
      if (selectedStateData?.cities) {
        setAvailableCities(selectedStateData.cities);
      } else {
        setAvailableCities([]);
      }
    }
  };

  const handleFileUpload = (fieldId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setFilePreviews(prev => ({ ...prev, [fieldId]: preview }));
      handleFieldChange(fieldId, file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (fieldId: string) => {
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldId];
      return newPreviews;
    });
    handleFieldChange(fieldId, null);
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    const validateFields = (fields: any[]) => {
      fields.forEach(field => {
        if (field.type === 'conditional' && field.condition && !field.condition(formData)) {
          return;
        }
        
        if (field.fields) {
          validateFields(field.fields);
          return;
        }
        
        if (field.required || field.validation) {
          const value = formData[field.id];
          let error: string | null = null;
          
          if (field.validation) {
            error = field.validation(value);
          } else if (field.required && !value) {
            error = `${field.label} is required`;
          }
          
          if (error) {
            newErrors[field.id] = error;
          }
        }
      });
    };
    
    validateFields(currentStep.fields);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(prev => Math.min(config.totalSteps, prev + 1));
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSkip = () => {
    // Navigate back to dashboard based on form type or a general dashboard redirect
    const isBusiness = config.formId.includes('business');
    router.push(`/dashboard/${isBusiness ? 'business' : 'renter'}`);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        console.log('Submitting KYC:', formData);
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success(config.successMessage);
      }
      // Clear cache on successful submission
      localStorage.removeItem(formCacheKey);
    } finally {
      setLoading(false);
    }
  };

  const renderKYCStatus = () => {
    if (step !== config.totalSteps) return null;
    
    const hasErrors = Object.keys(errors).length > 0;
    const allFieldsFilled = currentStep.fields.every(field => {
      if (!field.required) return true;
      return formData[field.id];
    });
    
    const status = hasErrors ? 'error' : allFieldsFilled ? 'ready' : 'pending';
    
    const statusConfig = {
      error: {
        icon: AlertCircle,
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20',
        textColor: 'text-destructive dark:text-red-400',
        title: 'Validation Errors',
        description: 'Please fix the errors before submitting.'
      },
      ready: {
        icon: CheckCircle2,
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        title: 'Ready for Submission',
        description: 'All information is complete and ready for verification.'
      },
      pending: {
        icon: AlertCircle,
        bgColor: 'bg-amber-500/100/10',
        borderColor: 'border-amber-500/20',
        textColor: 'text-amber-600 dark:text-amber-400',
        title: 'Pending Verification',
        description: 'Your documents will be verified within 24-48 hours.'
      }
    };
    
    const statusCfg = statusConfig[status];
    const Icon = statusCfg.icon;
    
    return (
      <div className={`rounded-lg p-4  ${statusCfg.bgColor} ${statusCfg.borderColor} border`}>
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${statusCfg.textColor} flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`font-medium ${statusCfg.textColor}`}>
              {statusCfg.title}
            </p>
            <p className={`text-sm mt-1 ${statusCfg.textColor}`}>
              {statusCfg.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!isInitialized) return null; // Prevent hydration mismatch

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl py-6 md:py-12 px-4 sm:px-6 mx-auto font-primary">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground hover:text-foreground">
              Skip for now
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {step} of {config.totalSteps}</span>
              <span>Verification</span>
            </div>
            
            <div className="flex gap-1">
              {Array.from({ length: config.totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-lg transition-all ${
                    step >= i + 1 ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <FormStep
          step={currentStep}
          formData={formData}
          errors={errors}
          filePreviews={filePreviews}
          availableCities={availableCities}
          selectedState={selectedState}
          onFieldChange={handleFieldChange}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
        />

        {/* KYC Status (only on last step) */}
        {step === config.totalSteps && renderKYCStatus()}

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-lg border-input"
            disabled={step === 1 || loading}
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {step < config.totalSteps ? (
            <Button
              type="button"
              className="flex-1 h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold"
              onClick={handleNext}
              disabled={loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1 h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{config.submitText}</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          {config.disclaimer}
        </p>
      </div>
    </TooltipProvider>
  );
};