import type { Inventory, UpdateInventoryRequest } from "@/types/inventoryType";

// What the inputs hold (numbers stay as text while the user types)
export type InventoryFormValues = {
  addQuantity: string;
  lowStockThreshold: string;
};

export type InventoryFormErrors = Partial<
  Record<keyof InventoryFormValues, string>
>;

export function validateInventoryForm(
  values: InventoryFormValues,
): InventoryFormErrors {
  const errors: InventoryFormErrors = {};

  // Add stock is optional, but if it is filled it must be a whole number of 1 or more
  if (values.addQuantity.trim() !== "") {
    const quantity = Number(values.addQuantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.addQuantity = "Enter a whole number, 1 or more.";
    }
  }

  const threshold = Number(values.lowStockThreshold);
  if (
    values.lowStockThreshold.trim() === "" ||
    !Number.isInteger(threshold) ||
    threshold < 0
  ) {
    errors.lowStockThreshold = "Enter a whole number, 0 or more.";
  }

  return errors;
}

// Builds what the backend receives, with only the things that changed.
// Returns null when nothing changed (nothing to save).
export function buildInventoryUpdate(
  inventory: Inventory,
  values: InventoryFormValues,
): UpdateInventoryRequest | null {
  const addQuantity =
    values.addQuantity.trim() === "" ? 0 : Number(values.addQuantity);
  const threshold = Number(values.lowStockThreshold);
  const thresholdChanged = threshold !== inventory.lowStockThreshold;

  if (addQuantity === 0 && !thresholdChanged) return null;

  return {
    addQuantity: addQuantity > 0 ? addQuantity : undefined,
    lowStockThreshold: thresholdChanged ? threshold : undefined,
  };
}