"use client";

import { useState, type FormEvent } from "react";

// What the inputs hold (numbers stay as text while the user types)
export type ProductFormValues = {
  name: string;
  sku: string;
  costPrice: string;
  sellingPrice: string;
};

// What gets sent to the server
export type ProductPayload = {
  name: string;
  sku?: string;
  costPrice: number;
  sellingPrice: number;
};

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

const emptyValues: ProductFormValues = {
  name: "",
  sku: "",
  costPrice: "",
  sellingPrice: "",
};

function validatePrice(value: string): string | undefined {
  if (value.trim() === "") return "Enter a price.";

  const price = Number(value);
  if (Number.isNaN(price) || price < 0) return "Enter a valid price (0 or more).";

  return undefined;
}

function validate(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.name.trim()) errors.name = "Enter the product name.";

  const costError = validatePrice(values.costPrice);
  if (costError) errors.costPrice = costError;

  const sellingError = validatePrice(values.sellingPrice);
  if (sellingError) errors.sellingPrice = sellingError;

  return errors;
}

type UseProductFormOptions = {
  initialValues?: ProductFormValues;
  /** The form-specific server call. Throw an Error to show its message in the form. */
  onSubmit: (payload: ProductPayload) => Promise<void>;
};

export function useProductForm({
  initialValues = emptyValues,
  onSubmit,
}: UseProductFormOptions) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update one field and clear its error
  const setValue = (field: keyof ProductFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await onSubmit({
        name: values.name.trim(),
        sku: values.sku.trim() || undefined,
        costPrice: Number(values.costPrice),
        sellingPrice: Number(values.sellingPrice),
      });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, serverError, isSubmitting, setValue, handleSubmit };
}

export type ProductFormState = ReturnType<typeof useProductForm>;