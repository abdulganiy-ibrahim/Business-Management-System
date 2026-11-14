// Class strings shared by the auth forms (reset password, update password).
// Swap them for the ones your sign-in form uses if you prefer.

export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// Input without horizontal padding, so the password field can leave room for its eye button
export const inputBaseClass = `h-11 w-full rounded-xl border bg-background-card text-sm text-foreground transition-colors placeholder:text-text-secondary/70 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary`;

export const inputClass = `${inputBaseClass} px-3.5`;

export const primaryButtonClass = `flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

// The round icon at the top of an auth screen
export const iconBadgeClass =
  'mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary';