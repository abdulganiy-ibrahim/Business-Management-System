"use client";

import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { inputStyles } from "../business-dashboard/sales-page/uiStyles";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  min?: number;
  step?: number | "any";
};

// One label + input + error message. Nothing is automatic: pass type, min, step yourself.
export default function TextField({
  id,
  label,
  value,
  onChange,
  error,
  optional,
  disabled,
  placeholder,
  type = "text",
  inputMode,
  min,
  step,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optional && (
          <span className="font-normal text-subtle"> (optional)</span>
        )}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        inputMode={inputMode}
        min={min}
        step={step}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputStyles} ${error ? "border-danger" : "border-border"}`}
      />

      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}