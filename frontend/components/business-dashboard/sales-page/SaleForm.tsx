"use client";

import SlowRequestNotice from "@/components/network/SlowRequestNotice";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import SelectField from "@/components/ui/SelectField";
import TextField from "@/components/ui/TextField";
import {
  focusRing,
  iconButton,
  primaryButton,
  secondaryButton,
} from "@/components/ui/uiStyles";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/productType";
import { calculateRowTotal } from "@/utils/saleFormUtils";
import type { SaleFormState } from "@/hooks/useSaleForm";

type SaleFormProps = {
  form: SaleFormState; // from useSaleForm
  products: Product[];
  onCancel: () => void;
};

export default function SaleForm({ form, products, onCancel }: SaleFormProps) {
  const {
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
  } = form;

  // Every product can be used once per sale
  const canAddRow = rows.length < products.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* A disabled fieldset disables every input inside it while saving */}
      <fieldset disabled={isSubmitting} className="flex min-w-0 flex-col gap-6">
        {/* ---------- Items ---------- */}
        <div className="flex flex-col gap-3">
          {rows.map((row, index) => {
            // Hide products already picked in the other rows
            const pickedElsewhere = new Set(
              rows
                .filter((other) => other.rowId !== row.rowId && other.productId)
                .map((other) => other.productId),
            );
            const options = products
              .filter((product) => !pickedElsewhere.has(String(product.id)))
              .map((product) => ({
                value: String(product.id),
                label: `${product.name} (${formatPrice(product.sellingPrice)})`,
              }));
            const errors = rowErrors[row.rowId];

            return (
              <div
                key={row.rowId}
                className="flex flex-col gap-4 rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    Item {index + 1}
                  </p>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.rowId)}
                      aria-label={`Remove item ${index + 1}`}
                      className={`${iconButton} -mr-1.5`}
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  )}
                </div>

                {/* Stacked on mobile, product + quantity side by side from sm up */}
                <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
                  <SelectField
                    id={`${row.rowId}-product`}
                    label="Product"
                    placeholder="Select a product"
                    value={row.productId}
                    onChange={(value) => updateRow(row.rowId, "productId", value)}
                    options={options}
                    error={errors?.productId}
                  />
                  <TextField
                    id={`${row.rowId}-quantity`}
                    label="Quantity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    value={row.quantity}
                    onChange={(value) => updateRow(row.rowId, "quantity", value)}
                    error={errors?.quantity}
                  />
                </div>

                <p className="text-sm text-muted">
                  Item total:{" "}
                  <span className="font-medium text-foreground">
                    {formatPrice(calculateRowTotal(row, productsById))}
                  </span>
                </p>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addRow}
            disabled={!canAddRow}
            className={`${secondaryButton} w-full`}
          >
            <FiPlus className="size-4" />
            Add another product
          </button>
        </div>

        {/* ---------- Customer ---------- */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="sale-customer-name"
            label="Customer name"
            optional
            placeholder="e.g. Jane Doe"
            value={customer.customerName}
            onChange={(value) => setCustomerField("customerName", value)}
          />
          <TextField
            id="sale-customer-number"
            label="Customer number"
            optional
            type="tel"
            inputMode="tel"
            value={customer.customerNumber}
            onChange={(value) => setCustomerField("customerNumber", value)}
          />
        </div>

        {/* ---------- Total and payment ---------- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-sunken px-4 py-3">
            <span className="text-sm text-muted">Total</span>
            <span className="text-lg font-semibold text-foreground">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <TextField
              id="sale-paid-amount"
              label="Amount paid"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              placeholder="0.00"
              value={paidAmount}
              onChange={setPaidAmount}
              error={paidAmountError}
            />

            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={payInFull}
                className={`rounded-md font-medium text-primary hover:underline ${focusRing}`}
              >
                Paid in full
              </button>

              {balanceDue > 0 && (
                <p className="text-muted">
                  Balance due:{" "}
                  <span className="font-medium text-danger">
                    {formatPrice(balanceDue)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </fieldset>

      {serverError && (
        <p
          role="alert"
          className="rounded-xl bg-danger/10 px-3.5 py-3 text-sm text-danger"
        >
          {serverError}
        </p>
      )}

      <SlowRequestNotice isPending={isSubmitting} />


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
          {isSubmitting ? "Saving..." : "Create sale"}
        </button>
      </div>
    </form>
  );
}