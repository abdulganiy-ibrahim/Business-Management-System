import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  
  type TextareaHTMLAttributes,
} from "react";

/* ---------- shared style fragments ---------- */

const controlBase =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-subtle " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary " +
  "transition-colors disabled:cursor-not-allowed disabled:bg-sunken disabled:text-subtle";

const controlBorder = (hasError?: boolean) =>
  hasError ? "border-danger" : "border-border";

/* ---------- Label ---------- */

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className = "", ...props }, ref) => (
    <label
      ref={ref}
      className={`mb-1.5 inline-block text-sm font-medium text-foreground ${className}`.trim()}
      {...props}
    >
      {children}
      {required && <span className="text-danger"> *</span>}
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
    <div className="flex flex-col gap-1.5">
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : undefined}
        className={`${controlBase} ${controlBorder(Boolean(error))} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="text-xs text-danger">
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
    <div className="flex flex-col gap-1.5">
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : undefined}
        className={`${controlBase} resize-y leading-relaxed ${controlBorder(
          Boolean(error)
        )} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
);
Textarea.displayName = "Textarea";

/* ---------- Select ---------- */

