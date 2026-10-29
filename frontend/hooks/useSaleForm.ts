"use client";

import { getNetworkErrorMessage } from "@/lib/network/networkMessages";
import { useMemo, useState, type FormEvent } from "react";
import type { Product } from "@/types/productType";
import type { CreateSaleRequest } from "@/types/saleType";
import {
  buildSalePayload,
  calculateBalance,
  calculateTotal,
  createEmptyRow,
  validatePaidAmount,
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
  const [paidAmount, setPaidAmountValue] = useState("");
  const [paidAmountError, setPaidAmountError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick lookup: product id -> product (for prices)
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const total = calculateTotal(rows, productsById);
  const balanceDue = calculateBalance(total, paidAmount); // what the customer still owes

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

  // Typing clears the error; "Paid in full" fills in the total
  const setPaidAmount = (value: string) => {
    setPaidAmountValue(value);
    setPaidAmountError("");
  };

  const payInFull = () => setPaidAmount(String(total));

  // ---------- Submitting ----------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateRows(rows);
    const paidError = validatePaidAmount(paidAmount, total) ?? "";
    setRowErrors(errors);
    setPaidAmountError(paidError);
    if (Object.keys(errors).length > 0 || paidError) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await onSubmit(buildSalePayload({ ...customer, rows, paidAmount }));
    } catch (error) {
      setServerError(
        getNetworkErrorMessage(error) ??
          (error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."),
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
    paidAmount,
    paidAmountError,
    balanceDue,
    serverError,
    isSubmitting,
    setCustomerField,
    updateRow,
    addRow,
    removeRow,
    setPaidAmount,
    payInFull,
    handleSubmit,
  };
}

export type SaleFormState = ReturnType<typeof useSaleForm>;