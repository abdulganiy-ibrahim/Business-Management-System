import type { IconType } from "react-icons";
import { FiBarChart2, FiLayers, FiPlus, FiShoppingCart } from "react-icons/fi";

type QuickAction = {
  label: string;
  description: string;
  /** Added to /dashboard/<business-slug>. null = no page yet, shown as disabled. */
  path: string | null;
  icon: IconType;
};

// Add, remove or reorder quick actions here
export const quickActions: QuickAction[] = [
  { label: "Add product", description: "Create a new product", path: "/products", icon: FiPlus },
  { label: "New sale", description: "Record a sale", path: "/sales", icon: FiShoppingCart },
  { label: "Manage inventory", description: "Update your stock", path: "/inventory", icon: FiLayers },
  { label: "View report", description: "Coming soon", path: null, icon: FiBarChart2 },
];