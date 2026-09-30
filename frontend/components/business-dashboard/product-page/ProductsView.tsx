"use client";

import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import type { Product } from "@/types/productType";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { filterAndSortProducts, type SortOption } from "./productFilter";
import { primaryButton } from "./productStyles";

type ProductsViewProps = {
  products: Product[];
  businessId: string;
};

export default function ProductsView({
  products,
  businessId,
}: ProductsViewProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const visibleProducts = useMemo(
    () => filterAndSortProducts(products, search, sort),
    [products, search, sort],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading + add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage what you sell and how it is priced.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className={`${primaryButton} w-full sm:w-auto cursor-pointer`}
        >
          <FiPlus className="size-4" />
          Add product
        </button>
      </div>

      <ProductFilters
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      {/* List, or an empty message */}
      {visibleProducts.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={setEditingProduct}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted">
          {products.length === 0
            ? "No products yet. Add your first product to get started."
            : "No products match your search."}
        </p>
      )}

      {/* Modals: mounted only while open so their forms reset each time */}
      {isCreateOpen && (
        <CreateProductForm
          businessId={businessId}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {editingProduct && (
        <EditProductForm
          key={editingProduct.id}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          businessId={businessId}
        />
      )}
    </div>
  );
}