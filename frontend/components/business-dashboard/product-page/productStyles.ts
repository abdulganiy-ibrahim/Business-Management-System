// Shared class strings for the products page. Change a style here and it updates everywhere.

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const buttonBase = `inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const primaryButton = `${buttonBase} bg-primary text-white hover:opacity-90`;

export const secondaryButton = `${buttonBase} border border-border bg-(--bg) text-foreground hover:bg-(--bg-sunken)`;

// Small icon-only button (edit)
export const iconButton = `flex size-9 shrink-0 items-center justify-center rounded-lg text-(--fg-muted) transition-colors hover:bg-(--bg-sunken) hover:text-foreground ${focusRing}`;

// Text input without horizontal padding, so the search box can use a different left padding
export const inputBase = `h-11 w-full rounded-xl border bg-(--bg) text-sm text-foreground transition-colors placeholder:text-(--fg-subtle) disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary`;

export const inputStyles = `${inputBase} px-3.5`;