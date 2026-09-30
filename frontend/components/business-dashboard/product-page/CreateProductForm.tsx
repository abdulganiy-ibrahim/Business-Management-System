"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
// TODO: match this import and the call below to your real helper
import { createProduct } from "@/lib/data/productData";
import ProductForm from "./ProductForm";
import { useProductForm } from "./useProductForm";
import { browserApi } from "@/lib/api/browserApi";

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
    onSubmit: async (payload) => {
      await createProduct(browserApi, businessId, payload); // talks to the server
      router.refresh(); // reload the product list
      onClose();
    },
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add product"
      description="Enter the details of the product you sell."
    >
      <ProductForm form={form} submitLabel="Add product" onCancel={onClose} />
    </Modal>
  );
}