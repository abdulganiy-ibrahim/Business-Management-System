import { forwardRef, type SelectHTMLAttributes } from "react";
import { controlBase, controlBorder } from "./FormStyle";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, options, placeholder, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <select
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${props.id}-error` : undefined}
        defaultValue={props.defaultValue ?? ""}
        className={`${controlBase} ${controlBorder(
          Boolean(error)
        )} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="%236B6B66" stroke-width="1.5"><path d="M6 8l4 4 4-4"/></svg>')] bg-no-repeat bg-position-[right_0.75rem_center] pr-9 ${className}`.trim()}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${props.id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
);
Select.displayName = "Select";

export default Select;