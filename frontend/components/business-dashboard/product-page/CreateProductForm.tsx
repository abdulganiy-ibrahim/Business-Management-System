"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
// TODO: if you already have your own create action/helper, use that instead.
// The only requirement: it must send a CreateProduct (name, sku?, costPrice,
// sellingPrice, quantity, lowStockThreshold).
import { createProductAction } from "@/lib/actions/productActions";
import ProductForm from "./ProductForm";
import {
  buildCreateProductPayload,
  validateCreateProductForm,
} from "@/utils/productFormUtils";
import { useProductForm } from "./useProductForm";

type CreateProductFormProps = {
  businessId: string;
  onClose: () => void;
};

// Mount this only while it's open (see ProductsView) so the form starts empty every time.
export default function CreateProductForm({
  businessId,
  onClose,
}: CreateProductFormProps) {
  const router = useRouter();

  const form = useProductForm({
    validate: validateCreateProductForm, // product fields + stock fields
    buildPayload: buildCreateProductPayload, // -> CreateProduct
    onSubmit: async (payload) => {
      const result = await createProductAction(businessId, payload); // talks to the server
      if (!result.success) throw new Error(result.message); // shown inside the form

      router.refresh(); // reload the product list
      onClose();
    },
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add product"
      description="Enter the product details and how much stock you have."
    >
      <ProductForm
        form={form}
        submitLabel="Add product"
        showInventoryFields
        onCancel={onClose}
      />
    </Modal>
  );
}