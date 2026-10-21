import Link from "next/link";
import { focusRing } from "../../ui/uiStyles";
import DashboardCard from "./DashboardCard";
import { quickActions } from "./quickActions";

const tile = "flex flex-col items-start gap-3 rounded-xl border border-border p-4";

type QuickActionsProps = {
  businessSlug: string;
  className?: string;
};

export default function QuickActions({
  businessSlug,
  className,
}: QuickActionsProps) {
  return (
    <DashboardCard
      title="Quick actions"
      description="Jump to common tasks"
      className={className}
    >
      {/* 2 x 2 tiles */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map(({ label, description, path, icon: Icon }) => {
          const content = (
            <>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  {label}
                </span>
                <span className="block text-xs text-muted">{description}</span>
              </span>
            </>
          );

          // No page yet: shown dimmed and not clickable
          if (path === null) {
            return (
              <div
                key={label}
                aria-disabled="true"
                className={`${tile} cursor-not-allowed opacity-60`}
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={label}
              href={`/dashboard/${businessSlug}${path}`}
              className={`${tile} transition-colors hover:bg-foreground/5 ${focusRing}`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}