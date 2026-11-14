export type PasswordStrength = "weak" | "okay" | "strong";

// A quick hint for the user, not a security check. One point for each of:
// 8+ characters, 12+ characters, upper and lower case, a number, a symbol.
export function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return "weak";
  if (score === 3) return "okay";
  return "strong";
}