import type { IconType } from "react-icons";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";
import { formatPrice } from "@/lib/format";
import type { SummaryCards } from "@/types/dashboardType";

type SummaryCardItem = {
  key: keyof SummaryCards; // which card of the backend response this is
  label: string;
  icon: IconType;
  formatValue: (value: number) => string;
  higherIsBetter: boolean; // false = a rise is shown in red
};

const formatCount = (value: number) => value.toLocaleString("en");

// Add, remove or reorder summary cards here
export const summaryCardItems: SummaryCardItem[] = [
  { key: "totalSales", label: "Total sales", icon: FiShoppingCart, formatValue: formatPrice, higherIsBetter: true },
  { key: "moneyIn", label: "Money in", icon: FiArrowDownLeft, formatValue: formatPrice, higherIsBetter: true },
  { key: "moneyOut", label: "Money out", icon: FiArrowUpRight, formatValue: formatPrice, higherIsBetter: false },
  { key: "totalProducts", label: "Products", icon: FiPackage, formatValue: formatCount, higherIsBetter: true },
];