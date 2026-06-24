"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, Car, Info } from "lucide-react";
import { validateEmail } from "@/lib/utils";

interface SignUpFormProps {
  onSubmit: (data: { 
    email: string; 
    password: string; 
    name: string;
    userType: 'renter' | 'business';
  }) => void;
  onToggleMode: () => void;
  onGoogleSignIn?: () => void;
  onFacebookSignIn?: () => void;
  onShowOtp?: () => void; // New prop for OTP
}

export default function SignUpForm({ 
  onSubmit, 
  onToggleMode, 
  onGoogleSignIn, 
  onFacebookSignIn,
  onShowOtp 
}: SignUpFormProps) {
  const [userType, setUserType] = useState<'renter' | 'business'>('renter');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = `${userType === 'renter' ? 'Full Name' : 'Business Name'} is required`;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    const trimmedValue = field === 'email' ? value.trimStart() : value;
    setFormData({ ...formData, [field]: trimmedValue });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedData = {
      ...formData,
      email: formData.email.trim(),
      name: formData.name.trim(),
      userType
    };
    
    setFormData(trimmedData);
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(trimmedData);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookClick = () => {
    // If onFacebookSignIn is provided, use it
    // Otherwise, show OTP form
    if (onFacebookSignIn) {
      onFacebookSignIn();
    } else if (onShowOtp) {
      onShowOtp();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
        <p className="text-muted-foreground">Start your journey with Rydway</p>
      </div>

      {/* User Type Tabs */}
      <div className="mb-8">
        <div className="flex rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setUserType('renter')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              userType === 'renter'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground bg-transparent'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              <span>Renter</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setUserType('business')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              userType === 'business'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground bg-transparent'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Car className="h-4 w-4" />
              <span>Business</span>
            </div>
          </button>
        </div>

        {/* Tab Description */}
        <div className="mt-4 p-3 rounded-lg transition-all duration-200 ">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                {userType === 'renter' ? 'Rent Cars' : 'Rent Out Your Cars'}
              </p>
              <p className="text-xs text-muted-foreground">
                {userType === 'renter' 
                  ? 'Browse and rent cars for your personal or business needs' 
                  : 'List your vehicles and manage your rental business'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
            {userType === 'renter' ? 'Full Name' : 'Business Name'}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={userType === 'renter' ? "John Doe" : "Acme Car Rentals"}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`h-12 rounded-lg border-input ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={userType === 'renter' ? "john@example.com" : "contact@yourbusiness.com"}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`h-12 pl-11 rounded-lg border-input ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-foreground mb-2 block">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`h-12 pl-11 pr-11 rounded-lg border-input ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Must be at least 8 characters long
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>
                {userType === 'renter' 
                  ? 'Join as Renter' 
                  : 'Register Business'}
              </span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </form>

      {/* Alternative Signup Options */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <div className="flex-1 border-t border-input"></div>
          <span className="mx-4 text-sm text-muted-foreground">Or sign up with</span>
          <div className="flex-1 border-t border-input"></div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleSignIn}
            className="flex-1 h-12 rounded-lg border-input hover:bg-accent flex items-center justify-center gap-2"
          >
            {/* Google Icon SVG with brand colors */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleFacebookClick}
            className="flex-1 h-12 rounded-lg border-input hover:bg-accent flex items-center justify-center gap-2"
          >
            {/* Facebook Icon SVG with brand colors */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}