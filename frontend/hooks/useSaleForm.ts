"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Product } from "@/types/productType";
import type { CreateSaleRequest } from "@/types/saleType";
import {
  buildSalePayload,
  calculateTotal,
  createEmptyRow,
  validateRows,
  type SaleRow,
  type SaleRowErrorMap,
} from "@/utils/saleFormUtils";

type CustomerField = "customerName" | "customerNumber";
type RowField = "productId" | "quantity";

type UseSaleFormOptions = {
  products: Product[];
  /** The form-specific server call. Throw an Error to show its message in the form. */
  onSubmit: (payload: CreateSaleRequest) => Promise<void>;
};

export function useSaleForm({ products, onSubmit }: UseSaleFormOptions) {
  const [customer, setCustomer] = useState({
    customerName: "",
    customerNumber: "",
  });
  const [rows, setRows] = useState<SaleRow[]>(() => [createEmptyRow()]);
  const [rowErrors, setRowErrors] = useState<SaleRowErrorMap>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick lookup: product id -> product (for prices)
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const total = calculateTotal(rows, productsById);

  // ---------- Changing the form ----------

  const setCustomerField = (field: CustomerField, value: string) => {
    setCustomer((previous) => ({ ...previous, [field]: value }));
  };

  // Update one field of one row and clear that field's error
  const updateRow = (rowId: string, field: RowField, value: string) => {
    setRows((previous) =>
      previous.map((row) =>
        row.rowId === rowId ? { ...row, [field]: value } : row,
      ),
    );
    setRowErrors((previous) => ({
      ...previous,
      [rowId]: { ...previous[rowId], [field]: undefined },
    }));
  };

  const addRow = () => setRows((previous) => [...previous, createEmptyRow()]);

  // A sale always keeps at least one row
  const removeRow = (rowId: string) =>
    setRows((previous) =>
      previous.length > 1
        ? previous.filter((row) => row.rowId !== rowId)
        : previous,
    );

  // ---------- Submitting ----------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateRows(rows);
    setRowErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await onSubmit(buildSalePayload({ ...customer, rows }, total));
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

  return {
    customer,
    rows,
    rowErrors,
    productsById,
    total,
    serverError,
    isSubmitting,
    setCustomerField,
    updateRow,
    addRow,
    removeRow,
    handleSubmit,
  };
}

export type SaleFormState = ReturnType<typeof useSaleForm>;