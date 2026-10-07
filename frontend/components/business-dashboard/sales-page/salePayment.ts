import type { Sale } from "@/types/saleType";

// Shared by the card and the table, so both always agree.

// What the customer still owes. Rounded to cents so decimal noise
// (like 0.1 + 0.2) can never leave a fake debt on a fully paid sale.
export function getBalance(sale: Sale) {
  return Math.round((sale.totalAmount - sale.amountPaid) * 100) / 100;
}

// Badge colors in one place. TODO: swap "Part paid" for your warning color token if you have one.
const statusStyles = {
  paid: "bg-primary/10 text-primary",
  partPaid: "bg-amber-500/15 text-amber-700",
  unpaid: "bg-danger/10 text-danger",
};

export function getPaymentStatus(sale: Sale) {
  if (getBalance(sale) <= 0) {
    return { label: "Paid", style: statusStyles.paid };
  }
  if (sale.amountPaid > 0) {
    return { label: "Part paid", style: statusStyles.partPaid };
  }
  return { label: "Unpaid", style: statusStyles.unpaid };
}

// Returns an error message, or undefined when the amount is fine.
// A payment must be more than 0 and can't be more than what is still owed.
export function validatePaymentAmount(
  amount: string,
  balance: number,
): string | undefined {
  if (amount.trim() === "") return "Enter the amount being paid.";

  const value = Number(amount);
  if (Number.isNaN(value) || value <= 0) {
    return "Enter an amount greater than 0.";
  }

  // Compare in whole cents to avoid decimal rounding surprises
  if (Math.round(value * 100) > Math.round(balance * 100)) {
    return "Amount can't be more than the balance due.";
  }

  return undefined;
}