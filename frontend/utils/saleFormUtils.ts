import type { Product } from "@/types/productType";
import type { CreateSaleRequest } from "@/types/saleType";

// ---------- Types ----------

// One "product + quantity" line. Numbers stay as text while the user types.
export type SaleRow = {
  rowId: string; // local id so React can track rows; never sent to the server
  productId: string; // "" until a product is picked
  quantity: string;
};

export type SaleFormValues = {
  customerName: string;
  customerNumber: string;
  rows: SaleRow[];
};

export type SaleRowErrors = { productId?: string; quantity?: string };
export type SaleRowErrorMap = Record<string, SaleRowErrors>; // keyed by rowId

export type ProductsById = Map<number, Product>;

// ---------- Rows ----------

let rowCounter = 0;

export function createEmptyRow(): SaleRow {
  rowCounter += 1;
  return { rowId: `row-${rowCounter}`, productId: "", quantity: "1" };
}

// ---------- Totals (a preview: the backend calculates the real total) ----------

export function calculateRowTotal(row: SaleRow, productsById: ProductsById) {
  const product = productsById.get(Number(row.productId));
  const quantity = Number(row.quantity);

  if (!product || !(quantity > 0)) return 0;
  return product.sellingPrice * quantity;
}

export function calculateTotal(rows: SaleRow[], productsById: ProductsById) {
  const total = rows.reduce(
    (sum, row) => sum + calculateRowTotal(row, productsById),
    0,
  );
  return Math.round(total * 100) / 100; // avoid 0.1 + 0.2 style rounding noise
}

// ---------- Validation ----------

export function validateRows(rows: SaleRow[]): SaleRowErrorMap {
  const errors: SaleRowErrorMap = {};

  for (const row of rows) {
    const rowErrors: SaleRowErrors = {};
    const quantity = Number(row.quantity);

    if (!row.productId) rowErrors.productId = "Select a product.";
    if (!Number.isInteger(quantity) || quantity < 1) {
      rowErrors.quantity = "Enter a whole number, 1 or more.";
    }

    if (Object.keys(rowErrors).length > 0) errors[row.rowId] = rowErrors;
  }

  return errors;
}

// ---------- Payload (what the backend receives) ----------

export function buildSalePayload(
  values: SaleFormValues,
  total: number,
): CreateSaleRequest {
  return {
    customerName: values.customerName.trim() || undefined,
    customerNumber: values.customerNumber.trim() || undefined,
    saleItems: values.rows.map((row) => ({
      productId: Number(row.productId), // the id, not the product name
      quantity: Number(row.quantity),
    })),
    // TODO: when the "amount paid" field is added, send its value here.
    // Until then every sale is recorded as fully paid.
    paidAmount: total,
  };
}