"use client";

import type { HTMLInputTypeAttribute } from "react";
import type { ProductFormState } from "./useProductForm";
import { inputStyles, primaryButton, secondaryButton } from "./productStyles";

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
};

// One label + input + error message
function TextField({
  id,
  label,
  value,
  onChange,
  error,
  optional,
  disabled,
  placeholder,
  type = "text",
}: TextFieldProps) {
  const isNumber = type === "number";

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
        inputMode={isNumber ? "decimal" : undefined}
        min={isNumber ? 0 : undefined}
        step={isNumber ? "any" : undefined}
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

type ProductFormProps = {
  form: ProductFormState; // from useProductForm
  submitLabel: string;
  onCancel: () => void;
};

/** The fields and buttons shared by CreateProductForm and EditProductForm. */
export default function ProductForm({
  form,
  submitLabel,
  onCancel,
}: ProductFormProps) {
  const { values, errors, serverError, isSubmitting, setValue, handleSubmit } =
    form;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <TextField
        id="product-name"
        label="Product name"
        placeholder="e.g. Cotton T-shirt"
        value={values.name}
        onChange={(value) => setValue("name", value)}
        error={errors.name}
        disabled={isSubmitting}
      />

      <TextField
        id="product-sku"
        label="SKU"
        optional
        placeholder="e.g. TSH-001"
        value={values.sku}
        onChange={(value) => setValue("sku", value)}
        error={errors.sku}
        disabled={isSubmitting}
      />

      {/* Stacked on mobile, side by side from sm up */}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="product-cost-price"
          label="Cost price"
          type="number"
          placeholder="0.00"
          value={values.costPrice}
          onChange={(value) => setValue("costPrice", value)}
          error={errors.costPrice}
          disabled={isSubmitting}
        />
        <TextField
          id="product-selling-price"
          label="Selling price"
          type="number"
          placeholder="0.00"
          value={values.sellingPrice}
          onChange={(value) => setValue("sellingPrice", value)}
          error={errors.sellingPrice}
          disabled={isSubmitting}
        />
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-xl bg-danger/10 px-3.5 py-3 text-sm text-danger"
        >
          {serverError}
        </p>
      )}

      {/* Primary button on top on mobile, on the right from sm up */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={`${secondaryButton} w-full sm:w-auto`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${primaryButton} w-full sm:w-auto`}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}