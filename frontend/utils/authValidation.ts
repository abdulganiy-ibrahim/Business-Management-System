// Validate Email address
export function validateEmail(email: string): string | undefined {
  const value = email.trim();

  if (!value) return "Enter your email address.";

  // something@something.something, no spaces
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }

  return undefined;
}