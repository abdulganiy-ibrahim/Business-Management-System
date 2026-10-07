"use client";

import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { primaryButton } from "@/components/ui/uiStyles";
import type { Product } from "@/types/productType";
import type { Sale } from "@/types/saleType";
import CreateSaleForm from "./CreateSaleForm";
import SaleCard from "./SaleCard";
import SaleItemsModal from "./SaleItemsModal";

type SalesViewProps = {
  sales: Sale[];
  products: Product[];
  businessId: string;
};

export default function SalesView({
  sales,
  products,
  businessId,
}: SalesViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  // Newest sale first (copy before sorting: .sort() changes the array it's called on)
  const sortedSales = useMemo(
    () =>
      [...sales].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [sales],
  );

  // Sale items only carry a productId, so this turns ids into names
  const productNames = useMemo(
    () => new Map(products.map((product) => [product.id, product.name])),
    [products],
  );

  const hasProducts = products.length > 0;

  const payDebt = (sale: Sale) => {
    // TODO: implement paying debt for a sale
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading + new sale button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Sales
          </h1>
          <p className="mt-1 text-sm text-muted">
            Every sale you have recorded, newest first.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          disabled={!hasProducts}
          className={`${primaryButton} w-full sm:w-auto`}
        >
          <FiPlus className="size-4" />
          New sale
        </button>
      </div>

      {!hasProducts && (
        <p className="rounded-xl bg-sunken px-4 py-3 text-sm text-muted">
          Add a product first. A sale can only include products your business
          has.
        </p>
      )}

      {/* List, or an empty message */}
      {sortedSales.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {sortedSales.map((sale) => (
            <SaleCard key={sale.id} sale={sale} onViewItems={setViewingSale} onPayDebt={payDebt} />
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted">
          No sales yet. Record your first sale to see it here.
        </p>
      )}

      {/* Modals: mounted only while open so they start fresh each time */}
      {isCreateOpen && (
        <CreateSaleForm
          businessId={businessId}
          products={products}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {viewingSale && (
        <SaleItemsModal
          key={viewingSale.id}
          businessId={businessId}
          sale={viewingSale}
          productNames={productNames}
          onClose={() => setViewingSale(null)}
        />
      )}
    </div>
  );
}