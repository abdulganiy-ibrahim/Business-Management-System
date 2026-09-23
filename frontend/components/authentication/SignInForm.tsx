'use client';

import { supabaseBrowserClient } from '@/lib/supabase/supabaseClient';
import { useState } from 'react';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const supabase = await supabaseBrowserClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md md:max-w-lg lg:max-w-xl w-full h-fit mx-auto bg-background-card rounded-2xl shadow-sm py-8 px-8 md:px-12"
    >
      <section className='flex flex-col items-center text-center mb-8'>
        <h1 className='text-2xl font-semibold text-primary tracking-tight'>Welcome back</h1>
        <p className='mt-1 text-sm text-muted-foreground'>Sign in to continue</p>
      </section>

      <section className="flex flex-col gap-4">
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

          <p>Forgot your password? <button type='button' onClick={() => router.push('/forgot-password')} className="text-primary hover:underline">Reset it</button></p>
        </div>

        <div className='mx-auto w-full mt-2'>
          <button
            type="submit" 
            disabled={isLoading}
            className="bg-primary text-white w-full py-2.5 rounded-full hover:bg-p-bg-hover transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </section>
    </form>
  )
}