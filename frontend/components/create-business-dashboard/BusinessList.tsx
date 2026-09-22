import { FiBriefcase } from "react-icons/fi";
import { Business } from "@/types/BusinessType";

export default function BusinessList({ businesses }: { businesses: Business[] }) {
  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-tint text-primary">
          <FiBriefcase size={20} />
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground">
          No businesses yet
        </h3>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Once you create a business, it will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {businesses.map((business) => (
        <div
          key={business.id}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-tint text-primary">
            <FiBriefcase size={16} />
          </div>
          <h3 className="mt-3 text-sm font-medium text-foreground">
            {business.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{business.category}</p>
          <p className="mt-2 text-xs text-subtle">{business.phone}</p>
        </div>
      ))}
    </div>
  );
}