import type { CreateProduct } from "@/types/productType";

// What the inputs hold (numbers stay as text while the user types).
// quantity and lowStockThreshold are only used when CREATING a product.
export type ProductFormValues = {
  name: string;
  sku: string;
  costPrice: string;
  sellingPrice: string;
  quantity: string;
  lowStockThreshold: string;
};

// What gets sent when EDITING a product (stock is edited on the Inventory page)
export type ProductPayload = Omit<CreateProduct, "quantity" | "lowStockThreshold">;

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export const emptyValues: ProductFormValues = {
  name: "",
  sku: "",
  costPrice: "",
  sellingPrice: "",
  quantity: "",
  lowStockThreshold: "",
};

// ---------- Validation ----------

function validatePrice(value: string): string | undefined {
  if (value.trim() === "") return "Enter a price.";

  const price = Number(value);
  if (Number.isNaN(price) || price < 0) return "Enter a valid price (0 or more).";

  return undefined;
}

function validateWholeNumber(value: string): string | undefined {
  if (value.trim() === "") return "Enter a number (0 or more).";

  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    return "Enter a whole number, 0 or more.";
  }

  return undefined;
}

// The four product fields. Used when editing.
export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.name.trim()) errors.name = "Enter the product name.";

  const costError = validatePrice(values.costPrice);
  if (costError) errors.costPrice = costError;

  const sellingError = validatePrice(values.sellingPrice);
  if (sellingError) errors.sellingPrice = sellingError;

  return errors;
}

// The product fields plus the stock fields. Used when creating.
export function validateCreateProductForm(
  values: ProductFormValues,
): ProductFormErrors {
  const errors = validateProductForm(values);

  const quantityError = validateWholeNumber(values.quantity);
  if (quantityError) errors.quantity = quantityError;

  const thresholdError = validateWholeNumber(values.lowStockThreshold);
  if (thresholdError) errors.lowStockThreshold = thresholdError;

  return errors;
}

// ---------- Payloads (what the backend receives) ----------

export function buildProductPayload(values: ProductFormValues): ProductPayload {
  return {
    name: values.name.trim(),
    sku: values.sku.trim() || undefined,
    costPrice: Number(values.costPrice),
    sellingPrice: Number(values.sellingPrice),
  };
}

export function buildCreateProductPayload(
  values: ProductFormValues,
): CreateProduct {
  return {
    ...buildProductPayload(values),
    quantity: Number(values.quantity),
    lowStockThreshold: Number(values.lowStockThreshold),
  };
}