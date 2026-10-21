import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  description?: string;
  /** Something on the right of the title, e.g. a "View all" link */
  action?: ReactNode;
  children: ReactNode;
  className?: string; // e.g. "xl:col-span-2"
};

// The frame shared by the chart, top products, recent sales and quick actions cards
export default function DashboardCard({
  title,
  description,
  action,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-border bg-background p-4 sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          )}
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}