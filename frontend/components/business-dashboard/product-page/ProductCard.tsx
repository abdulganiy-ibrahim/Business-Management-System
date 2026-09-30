import { FiEdit2 } from "react-icons/fi";
import type { Product } from "@/types/ProductType";
import { iconButton } from "./productStyles";

// TODO: set your currency code (e.g. "USD", "NGN", "GBP")
const CURRENCY_CODE = "USD";

const priceFormatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: CURRENCY_CODE,
});

const formatPrice = (amount: number) => priceFormatter.format(amount);

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
};

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:p-5">
      {/* Name, SKU and edit button */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">
            {product.name}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted">
            {product.sku ? `SKU: ${product.sku}` : "No SKU"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(product)}
          aria-label={`Edit ${product.name}`}
          className={iconButton}
        >
          <FiEdit2 className="size-4" />
        </button>
      </div>

      {/* Prices */}
      <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <dt className="text-xs text-muted">Cost price</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {formatPrice(product.costPrice)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Selling price</dt>
          <dd className="mt-0.5 text-sm font-medium text-foreground">
            {formatPrice(product.sellingPrice)}
          </dd>
        </div>
      </dl>

      <p className="text-xs text-muted">
        Added {formatDate(product.createdAt)}
      </p>
    </li>
  );
}