"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import TextField from "@/components/ui/TextField";
import { primaryButton, secondaryButton } from "@/components/ui/uiStyles";
import { updateInventoryAction } from "@/lib/actions/inventoryActions";
import type { Inventory } from "@/types/inventoryType";
import {
  buildInventoryUpdate,
  validateInventoryForm,
  type InventoryFormErrors,
  type InventoryFormValues,
} from "@/utils/inventoryFormUtils";
import StockStatusBadge from "./StockStatusBadge";

type EditInventoryFormProps = {
  businessId: string;
  inventory: Inventory;
  productName: string;
  onClose: () => void;
};

// Mount this only while it's open, with key={inventory.id} (see InventoryView),
// so the fields always start from the selected inventory.
export default function EditInventoryForm({
  businessId,
  inventory,
  productName,
  onClose,
}: EditInventoryFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<InventoryFormValues>({
    addQuantity: "",
    lowStockThreshold: String(inventory.lowStockThreshold),
  });
  const [errors, setErrors] = useState<InventoryFormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update one field and clear its error
  const setValue = (field: keyof InventoryFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError("");
  };

  // Preview of the stock after adding (only while the amount is valid)
  const addQuantity = Number(values.addQuantity);
  const newStock =
    values.addQuantity.trim() !== "" &&
    Number.isInteger(addQuantity) &&
    addQuantity >= 1
      ? inventory.quantity + addQuantity
      : null;

  const handleUpdateInventory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validateInventoryForm(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Only what changed is sent. The backend works out the transactions from it.
    const update = buildInventoryUpdate(inventory, values);
    if (!update) {
      setFormError("Nothing to save. Add stock or change the low stock threshold.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const result = await updateInventoryAction(businessId, update);

      if (!result.success) {
        setFormError(result.message);
        return;
      }

      router.refresh(); // reload the inventory list
      onClose();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit inventory"
      description={productName}
    >
      <form
        onSubmit={handleUpdateInventory}
        noValidate
        className="flex flex-col gap-5"
      >
        {/* Where the stock stands right now */}
        <div className="flex items-center justify-between gap-4 rounded-xl bg-foreground/5 px-4 py-3">
          <div>
            <p className="text-xs text-muted">Current stock</p>
            <p className="text-lg font-semibold text-foreground">
              {inventory.quantity}
            </p>
          </div>
          <StockStatusBadge inventory={inventory} />
        </div>

        <div className="flex flex-col gap-2">
          <TextField
            id="inventory-add-quantity"
            label="Add stock"
            optional
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="0"
            value={values.addQuantity}
            onChange={(value) => setValue("addQuantity", value)}
            error={errors.addQuantity}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted">
            {newStock !== null
              ? `New stock will be ${newStock}.`
              : "Units to add to the current stock."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <TextField
            id="inventory-low-stock-threshold"
            label="Low stock threshold"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={values.lowStockThreshold}
            onChange={(value) => setValue("lowStockThreshold", value)}
            error={errors.lowStockThreshold}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted">
            Stock at or below this number is marked as low.
          </p>
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-xl bg-danger/10 px-3.5 py-3 text-sm text-danger"
          >
            {formError}
          </p>
        )}

        {/* Primary button on top on mobile, on the right from sm up */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={`${secondaryButton} w-full sm:w-auto`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${primaryButton} w-full sm:w-auto`}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}