"use client";

import { useEffect, useState, type ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import { secondaryButton } from "../../ui/uiStyles";
import { getSaleItemsAction } from "@/lib/actions/saleActions";
import { formatPrice } from "./format";
import type { Sale, SaleItem } from "@/types/saleType";

type SaleItemsModalProps = {
  businessId: string;
  sale: Sale;
  /** productId -> product name (items only carry the id) */
  productNames: Map<number, string>;
  onClose: () => void;
};

// Mount with key={sale.id} (see SalesView) so each sale starts with a fresh load.
export default function SaleItemsModal({
  businessId,
  sale,
  productNames,
  onClose,
}: SaleItemsModalProps) {
  const [items, setItems] = useState<SaleItem[] | null>(null); // null = still loading
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); // bump to load again

  // Load this sale's items when the modal opens (and again on retry)
  useEffect(() => {
    let isCancelled = false;

    getSaleItemsAction(businessId, sale.id).then((result) => {
      if (isCancelled) return; // modal closed before the answer came back

      if (result.success) setItems(result.data);
      else setError(result.message);
    });

    return () => {
      isCancelled = true;
    };
  }, [businessId, sale.id, attempt]);

  const retry = () => {
    setError("");
    setItems(null);
    setAttempt((previous) => previous + 1);
  };

  // Decide what the body shows: error, loading, empty, or the items
  let content: ReactNode;

  if (error) {
    content = (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
        <button type="button" onClick={retry} className={secondaryButton}>
          Try again
        </button>
      </div>
    );
  } else if (items === null) {
    content = (
      <p role="status" className="py-8 text-center text-sm text-muted">
        Loading items...
      </p>
    );
  } else if (items.length === 0) {
    content = (
      <p className="py-8 text-center text-sm text-muted">
        No items found for this sale.
      </p>
    );
  } else {
    content = (
      <>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {productNames.get(item.productId) ?? `Product #${item.productId}`}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium text-foreground">
                {formatPrice(item.totalPrice)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-2 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Total</dt>
            <dd className="font-semibold text-foreground">
              {formatPrice(sale.totalAmount)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Paid</dt>
            <dd className="font-medium text-foreground">
              {formatPrice(sale.amountPaid)}
            </dd>
          </div>
        </dl>
      </>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Sale #${sale.id}`}
      description={
        sale.customerName ? `Customer: ${sale.customerName}` : "Walk-in customer"
      }
    >
      {content}
    </Modal>
  );
}