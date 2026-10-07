import type { Sale } from "@/types/saleType";
import { getBalance } from "./salePayment";

export type SalesStats = {
  salesCount: number;
  totalSales: number; // everything sold
  amountReceived: number; // money actually collected
  outstandingDebt: number; // money customers still owe
  unpaidCount: number; // how many sales still have a balance
  averageSale: number;
  collectionRate: number; // whole percent of the total that was collected
};

const toCents = (amount: number) => Math.round(amount * 100) / 100;

// One pass over the list. All amounts are rounded to cents.
export function calculateSalesStats(sales: Sale[]): SalesStats {
  let totalSales = 0;
  let amountReceived = 0;
  let outstandingDebt = 0;
  let unpaidCount = 0;

  for (const sale of sales) {
    totalSales += sale.totalAmount;
    amountReceived += sale.amountPaid;

    const balance = getBalance(sale);
    if (balance > 0) {
      outstandingDebt += balance;
      unpaidCount += 1;
    }
  }

  const salesCount = sales.length;

  return {
    salesCount,
    unpaidCount,
    totalSales: toCents(totalSales),
    amountReceived: toCents(amountReceived),
    outstandingDebt: toCents(outstandingDebt),
    averageSale: salesCount > 0 ? toCents(totalSales / salesCount) : 0,
    // floor, so it only says 100% when everything has really been collected
    collectionRate:
      totalSales > 0 ? Math.floor((amountReceived / totalSales) * 100) : 0,
  };
}