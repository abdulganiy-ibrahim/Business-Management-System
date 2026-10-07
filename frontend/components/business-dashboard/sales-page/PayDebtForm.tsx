"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import TextField from "@/components/ui/TextField";
import {
  focusRing,
  primaryButton,
  secondaryButton,
} from "@/components/ui/uiStyles";
import { payDebtAction } from "@/lib/actions/saleActions";
import type { Sale } from "@/types/saleType";
import { formatPrice } from "./format";
import { getBalance, validatePaymentAmount } from "./salePayment";

type PayDebtFormProps = {
  businessId: string;
  sale: Sale;
  onClose: () => void;
};

// Mount this only while it's open, with key={sale.id} (see SalesView),
// so the amount box starts empty every time.
export default function PayDebtForm({
  businessId,
  sale,
  onClose,
}: PayDebtFormProps) {
  const router = useRouter();

  const [amount, setAmount] = useState(""); // text while typing
  const [amountError, setAmountError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balance = getBalance(sale);

  // What would still be owed after this payment (only while the amount is valid)
  const isAmountValid = validatePaymentAmount(amount, balance) === undefined;
  const remaining = isAmountValid
    ? Math.round((balance - Number(amount)) * 100) / 100
    : null;

  // Typing clears the error; "Pay full balance" fills in everything that is owed
  const changeAmount = (value: string) => {
    setAmount(value);
    setAmountError("");
  };

  const handlePayDebt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validatePaymentAmount(amount, balance);
    setAmountError(validationError ?? "");
    if (validationError) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      // Sends saleId and amountPaid. The backend does the rest.
      const result = await payDebtAction(
        businessId,
        sale.id,
        Math.round(Number(amount) * 100) / 100,
      );

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.refresh(); // reload the sales list
      onClose();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Pay debt"
      description={`${sale.customerName || "Walk-in customer"} · Sale #${sale.id}`}
    >
      <form onSubmit={handlePayDebt} noValidate className="flex flex-col gap-5">
        {/* Where the sale stands right now */}
        <dl className="flex flex-col gap-2 rounded-xl bg-foreground/5 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Total</dt>
            <dd className="font-medium text-foreground">
              {formatPrice(sale.totalAmount)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Paid so far</dt>
            <dd className="font-medium text-foreground">
              {formatPrice(sale.amountPaid)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-2">
            <dt className="font-medium text-foreground">Balance due</dt>
            <dd className="font-semibold text-danger">{formatPrice(balance)}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2">
          <TextField
            id="pay-debt-amount"
            label="Amount to pay"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={changeAmount}
            error={amountError}
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={() => changeAmount(String(balance))}
              disabled={isSubmitting}
              className={`rounded-md font-medium text-primary hover:underline ${focusRing}`}
            >
              Pay full balance
            </button>

            {remaining !== null && (
              <p className="text-muted">
                {remaining === 0
                  ? "This clears the balance."
                  : `Remaining after payment: ${formatPrice(remaining)}`}
              </p>
            )}
          </div>
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
            onClick={onClose}
            disabled={isSubmitting}
            className={`${secondaryButton} w-full sm:w-auto cursor-pointer`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${primaryButton} w-full sm:w-auto cursor-pointer`}
          >
            {isSubmitting ? "Saving..." : "Record payment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}