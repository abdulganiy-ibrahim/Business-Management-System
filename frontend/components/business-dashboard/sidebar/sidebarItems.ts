import {
  FiCpu,
  FiGrid,
  FiLayers,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";

export const sidebarItems = [
  { label: "Dashboard", path: "", icon: FiGrid },
  { label: "Products", path: "/products", icon: FiPackage },
  { label: "Sales", path: "/sales", icon: FiShoppingCart },
  { label: "Inventory", path: "/inventory", icon: FiLayers },
  { label: "AI Assistant", path: "/assistant", icon: FiCpu },
];