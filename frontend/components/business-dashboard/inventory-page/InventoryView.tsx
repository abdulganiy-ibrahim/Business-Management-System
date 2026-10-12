"use client";

import { useMemo, useState } from "react";
import type { Inventory } from "@/types/inventoryType";
import type { Product } from "@/types/productType";
import EditInventoryForm from "./EditInventoryForm";
import InventoryCard from "./InventoryCard";
import InventoryTable from "./InventoryTable";
import InventoryTransactionsModal from "./InventoryTransactionsModal";

type InventoryViewProps = {
  inventory: Inventory[];
  products: Product[];
  businessId: string;
};

export default function InventoryView({
  inventory,
  products,
  businessId,
}: InventoryViewProps) {
  const [viewingInventory, setViewingInventory] = useState<Inventory | null>(null);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null);

  // Inventory only carries a productId, so this turns ids into names
  const productNames = useMemo(
    () => new Map(products.map((product) => [product.id, product.name])),
    [products],
  );

  const getProductName = (productId: number) =>
    productNames.get(productId) ?? `Product #${productId}`;

  // A to Z by product name (copy before sorting: .sort() changes the array it's called on)
  const sortedInventory = useMemo(
    () =>
      [...inventory].sort((a, b) =>
        (productNames.get(a.productId) ?? "").localeCompare(
          productNames.get(b.productId) ?? "",
        ),
      ),
    [inventory, productNames],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-muted">
          What you have in stock, and when it is running low.
        </p>
      </div>

      {/* List, or an empty message */}
      {sortedInventory.length > 0 ? (
        <>
          {/* Below lg: cards (1 column on phones, 2 on md) */}
          <ul className="grid gap-3 md:grid-cols-2 md:gap-4 lg:hidden">
            {sortedInventory.map((item) => (
              <InventoryCard
                key={item.id}
                inventory={item}
                productName={getProductName(item.productId)}
                onViewTransactions={setViewingInventory}
                onEdit={setEditingInventory}
              />
            ))}
          </ul>

          {/* lg and up: table (hides itself below lg) */}
          <InventoryTable
            inventory={sortedInventory}
            getProductName={getProductName}
            onViewTransactions={setViewingInventory}
            onEdit={setEditingInventory}
          />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted">
          No inventory yet.
        </p>
      )}

      {/* Modals: mounted only while open so they start fresh each time */}
      {viewingInventory && (
        <InventoryTransactionsModal
          key={viewingInventory.id}
          businessId={businessId}
          inventory={viewingInventory}
          productName={getProductName(viewingInventory.productId)}
          onClose={() => setViewingInventory(null)}
        />
      )}

      {editingInventory && (
        <EditInventoryForm
          key={editingInventory.id}
          businessId={businessId}
          inventory={editingInventory}
          productName={getProductName(editingInventory.productId)}
          onClose={() => setEditingInventory(null)}
        />
      )}
    </div>
  );
}