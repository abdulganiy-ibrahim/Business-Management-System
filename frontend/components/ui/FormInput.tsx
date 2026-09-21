import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import "./FormInput.css";


export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className = "", ...props }, ref) => (
    <label ref={ref} className={`form-label ${className}`.trim()} {...props}>
      {children}
      {required && <span className="form-label-required"> *</span>}
    </label>
  )
);
Label.displayName = "Label";

/* ---------- Input ---------- */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => (
    <div className="form-control">
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : undefined}
        className={`form-input${error ? " form-input--error" : ""} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  )
);
Input.displayName = "Input";

/* ---------- Textarea ---------- */

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", rows = 4, ...props }, ref) => (
    <div className="form-control">
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : undefined}
        className={`form-textarea${error ? " form-textarea--error" : ""} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  )
);
Textarea.displayName = "Textarea";