// Returns an error message, or undefined when the email looks fine.
// This only catches typos. The real check is the server's.
export function validateEmail(email: string): string | undefined {
  const value = email.trim();

  if (!value) return "Enter your email address.";

  // something@something.something, no spaces
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }

  return undefined;
}

// ---------- Passwords ----------

// Minimum length is enforced by the server, but we can catch typos here.
export const MIN_PASSWORD_LENGTH = 8;

// Passwords are not trimmed: spaces are allowed.
export function validateNewPassword(password: string): string | undefined {
  if (!password) return "Enter a new password.";

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return undefined;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | undefined {
  if (!confirmation) return "Confirm your new password.";

  if (confirmation !== password) return "The passwords don't match.";

  return undefined;
}