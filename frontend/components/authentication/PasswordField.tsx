'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { focusRing, inputBaseClass } from './authStyles';

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
};

// A password input with an eye button to show or hide what was typed.
// autoComplete="new-password" lets password managers offer to generate a strong one.
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  placeholder,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBaseClass} pr-11 pl-3.5 ${error ? 'border-danger' : 'border-border'}`}
        />

        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          disabled={disabled}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className={`absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-xl text-text-secondary hover:text-foreground disabled:cursor-not-allowed ${focusRing}`}
        >
          {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}