// Shared class strings for the header. Change a style here and it updates everywhere.

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

// Square icon-only button (hamburger, bell)
export const iconButton = `flex size-10 shrink-0 items-center justify-center rounded-xl text-(--fg-muted) transition-colors hover:bg-(--bg-sunken) hover:text-foreground ${focusRing}`;

// Floating panel under a trigger (business switcher, user menu)
export const dropdownPanel =
  "absolute top-full z-40 mt-2 overflow-hidden rounded-xl border border-border bg-(--bg) shadow-lg";

// A row inside a dropdown panel
export const dropdownItem = `flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-(--bg-sunken) ${focusRing}`;