'use client';

import { supabaseBrowserClient } from '@/lib/supabase/supabaseClient';
import { useState } from "react"
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

type SignUpFormProps = {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const supabase = await supabaseBrowserClient();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name, // stored as user metadata in Supabase
        },
        emailRedirectTo: `${window.location.origin}/sign-up`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success('Account created! Check your email to verify.');
    console.log('Session:', data.session); // temporary - so you can inspect the JWT shape

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md md:max-w-lg lg:max-w-xl w-full h-fit mx-auto bg-background-card rounded-2xl shadow-sm py-8 px-8 md:px-12"
    >
      <section className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-primary tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          It only takes a minute to get started
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
          <input 
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2.5 border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
          <input 
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="p-2.5 border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div className="relative flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</label>
          <input 
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className="p-2.5 pr-10 border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-9 text-muted-foreground hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button> 
        </div>

        {/*submit button */}
        <div className="mx-auto w-full mt-2">
          <button
            type="submit" 
            disabled={isLoading}
            className="bg-primary text-white w-full py-2.5 rounded-full cursor-pointer hover:bg-p-bg-hover transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
      </section>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  )
}