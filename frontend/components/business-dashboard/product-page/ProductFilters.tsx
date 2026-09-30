"use client";

import { FiSearch } from "react-icons/fi";
import { sortOptions, type SortOption } from "./productFilter";
import { inputBase, inputStyles } from "./productStyles";

type ProductFiltersProps = {
  search: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
};

// Stacked on mobile, one row from sm up
export default function ProductFilters({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative grow">
        <FiSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product name"
          aria-label="Search products by name"
          className={`${inputBase} border-border pr-3.5 pl-10`}
        />
      </div>

      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as SortOption)}
        aria-label="Sort products"
        className={`${inputStyles} border-border sm:w-56`}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}