// components/business/AddVehicleModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { vehicleFormSteps, getInitialFormData, validateStep, VehicleFormData } from "@/lib/config/add-car.config";

import { cn } from "@/lib/utils";
import { FormStep } from "@/components/base/form/FormStep";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface AddVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVehicle: (data: VehicleFormData) => void;
}

export function AddVehicleModal({
  open,
  onOpenChange,
  onAddVehicle,
}: AddVehicleModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  // Handle form field changes
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
  };

  // Handle file upload
  const handleFileUpload = (fieldId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreviews(prev => ({ ...prev, [fieldId]: reader.result as string }));
    };
    reader.readAsDataURL(file);
    
    // For multiple file uploads
    const currentField = vehicleFormSteps[currentStep].fields.find(f => f.id === fieldId);
    if (currentField?.multiple) {
      setFormData(prev => ({
        ...prev,
        [fieldId]: [...(prev[fieldId] || []), file]
      }));
    } else {
      handleFieldChange(fieldId, file);
    }
  };

  // Handle file removal
  const handleRemoveFile = (fieldId: string) => {
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldId];
      return newPreviews;
    });
    handleFieldChange(fieldId, null);
  };

  // Validate current step
  const validateCurrentStep = () => {
    const step = vehicleFormSteps[currentStep];
    const stepErrors = validateStep(step, formData);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < vehicleFormSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateCurrentStep()) {
      // Convert form data to VehicleFormData format
      const vehicleData: VehicleFormData = {
        title: formData.title || "",
        make: formData.make || "",
        model: formData.model || "",
        year: formData.year?.toString() || "",
        vehicleType: formData.vehicleType || "",
        transmission: formData.transmission || "",
        fuelType: formData.fuelType || "",
        plateNumber: formData.plateNumber || "",
        color: formData.color || "",
        seats: formData.seats?.toString() || "",
        airConditioning: formData.airConditioning || false,
        luggageCapacity: formData.luggageCapacity || "",
        rentalMode: formData.rentalMode || "",
        minimumDuration: formData.minimumDuration?.toString() || "",
        durationUnit: formData.durationUnit || "",
        basePrice: formData.basePrice?.toString() || "",
        pricingUnit: formData.pricingUnit || "",
        securityDeposit: formData.securityDeposit || false,
        depositAmount: formData.depositAmount?.toString() || "",
        location: formData.location || "",
        registrationDoc: formData.registrationDoc || null,
        insuranceDoc: formData.insuranceDoc || null,
        insuranceExpiry: formData.insuranceExpiry || "",
        roadWorthinessDoc: formData.roadWorthinessDoc || null,
        images: Array.isArray(formData.images) ? formData.images : [],
        status: formData.status || "",
        availableFrom: formData.availableFrom || ""
      };
      
      onAddVehicle(vehicleData);
      onOpenChange(false);
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentStep(0);
    setFormData(getInitialFormData());
    setErrors({});
    setFilePreviews({});
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Add New Vehicle
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to add a new vehicle to your fleet.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Header */}
        <div className="mb-8">
  

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {vehicleFormSteps.length}</span>
              <span>Vehicle Details</span>
            </div>
            
            <div className="flex gap-1">
              {Array.from({ length: vehicleFormSteps.length }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-lg transition-all ${
                    currentStep >= i ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <FormStep
          step={vehicleFormSteps[currentStep]}
          formData={formData}
          errors={errors}
          filePreviews={filePreviews}
          availableCities={[]}
          selectedState=""
          onFieldChange={handleFieldChange}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
        />

        {/* Form Actions */}
        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-lg border-input"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            type="button"
            className="flex-1 h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold"
            onClick={handleNextStep}
          >
            {currentStep === vehicleFormSteps.length - 1 ? (
              <>
                Add Vehicle
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}