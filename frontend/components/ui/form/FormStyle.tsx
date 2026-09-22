export const controlBase =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-subtle " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary " +
  "transition-colors disabled:cursor-not-allowed disabled:bg-sunken disabled:text-subtle";

export const controlBorder = (hasError?: boolean) =>
  hasError ? "border-danger" : "border-border";