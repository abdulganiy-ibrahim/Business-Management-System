"use client";

import { useEffect, useState, type ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import { secondaryButton } from "@/components/ui/uiStyles";
import { getInventoryTransactionsAction } from "@/lib/actions/inventoryActions";
import { formatDateTime } from "@/lib/format";
import type { Inventory } from "@/types/inventoryType";
import type { InventoryTransaction } from "@/types/inventoryTransactionType";
import {
  getQuantityChangeText,
  getTransactionLabel,
  isDeduction,
  sortNewestFirst,
} from "./inventoryTransactionDisplay";

type InventoryTransactionsModalProps = {
  businessId: string;
  inventory: Inventory;
  productName: string;
  onClose: () => void;
};

// Mount with key={inventory.id} (see InventoryView) so each inventory starts with a fresh load.
export default function InventoryTransactionsModal({
  businessId,
  inventory,
  productName,
  onClose,
}: InventoryTransactionsModalProps) {
  const [transactions, setTransactions] = useState<
    InventoryTransaction[] | null
  >(null); // null = still loading
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); // bump to load again

  // Load the transactions when the modal opens (and again on retry)
  useEffect(() => {
    let isCancelled = false;

    getInventoryTransactionsAction(businessId, inventory.id).then((result) => {
      if (isCancelled) return; // modal closed before the answer came back

      if (result.success) setTransactions(sortNewestFirst(result.data));
      else setError(result.message);
    });

    return () => {
      isCancelled = true;
    };
  }, [businessId, inventory.id, attempt]);

  const retry = () => {
    setError("");
    setTransactions(null);
    setAttempt((previous) => previous + 1);
  };

  // Decide what the body shows: error, loading, empty, or the transactions
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
  } else if (transactions === null) {
    content = (
      <p role="status" className="py-8 text-center text-sm text-muted">
        Loading transactions...
      </p>
    );
  } else if (transactions.length === 0) {
    content = (
      <p className="py-8 text-center text-sm text-muted">
        No transactions yet for this item.
      </p>
    );
  } else {
    content = (
      <ul className="divide-y divide-border">
        {transactions.map((transaction) => {
          const change = getQuantityChangeText(transaction);

          return (
            <li
              key={transaction.id}
              className="flex items-start justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {getTransactionLabel(transaction)}
                </p>
                {transaction.transactionDesc && (
                  <p className="mt-0.5 text-xs text-muted">
                    {transaction.transactionDesc}
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted">
                  {formatDateTime(transaction.createdAt)}
                </p>
              </div>

              {change && (
                <p
                  className={`shrink-0 text-sm font-semibold tabular-nums ${
                    isDeduction(transaction) ? "text-danger" : "text-primary"
                  }`}
                >
                  {change}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={productName}
      description={`In stock: ${inventory.quantity} · Low stock at: ${inventory.lowStockThreshold}`}
    >
      {content}
    </Modal>
  );
}