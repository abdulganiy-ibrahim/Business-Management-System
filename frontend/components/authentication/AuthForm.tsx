'use client';

import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import { UserRound } from 'lucide-react';

type Tab = 'signup' | 'login';

const PANEL_COPY: Record<Tab, { heading: string; body: string }> = {
  signup: {
    heading: 'Start building something great.',
    body: 'Create an account to save your progress and pick up right where you left off.',
  },
  login: {
    heading: 'Welcome back.',
    body: "Sign in to pick up right where you left off.",
  },
};

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<Tab>('signup');

  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
  };

  const copy = PANEL_COPY[activeTab];

  return (
    <section className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-white p-12 xl:p-16">
        <div className="flex items-center gap-2 text-sm font-medium">
          <UserRound className="size-5" />
          <span>Your account</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
            {copy.heading}
          </h1>
          <p className="mt-4 text-white/80 text-lg leading-relaxed">{copy.body}</p>
        </div>

        <p className="text-sm text-white/60">
          {activeTab === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className="text-white underline underline-offset-4 hover:text-white/90"
              >
                Log in instead
              </button>
            </>
          ) : (
            <>
              New here?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('signup')}
                className="text-white underline underline-offset-4 hover:text-white/90"
              >
                Create an account
              </button>
            </>
          )}
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center min-h-screen lg:min-h-0 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="relative flex items-center w-full rounded-full bg-background-card border border-border p-1 mb-8">
            {/* Sliding pill — sits behind buttons */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary shadow-sm transition-transform duration-300 ${
                activeTab === 'login' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
              }`}
            />

            {/* Buttons sit side by side, on top of the pill */}
            <button
              type="button"
              onClick={() => handleTabSwitch('signup')}
              className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300 ${
                activeTab === 'signup' ? 'text-white' : 'text-text-secondary'
              }`}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300 ${
                activeTab === 'login' ? 'text-white' : 'text-text-secondary'
              }`}
            >
              Log In
            </button>
          </div>

          {activeTab === 'signup' ? (
            <SignUpForm onSwitchToLogin={() => handleTabSwitch('login')} />
          ) : (
            <SignInForm />
          )}
        </div>
      </div>
    </section>
  );
}