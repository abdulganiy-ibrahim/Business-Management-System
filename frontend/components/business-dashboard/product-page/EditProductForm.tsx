"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import type { Product } from "@/types/productType";
// TODO: match this import and the call below to your real helper
// import { updateProduct } from "@/lib/data/productData";
import ProductForm from "./ProductForm";
import { useProductForm } from "./useProductForm";

type EditProductFormProps = {
  product: Product;
  onClose: () => void;
};

// Mount this only while it's open, with key={product.id} (see ProductsView),
// so the fields always start from the selected product.
export default function EditProductForm({
  product,
  onClose,
}: EditProductFormProps) {
  const router = useRouter();

  const form = useProductForm({
    initialValues: {
      name: product.name,
      sku: product.sku ?? "",
      costPrice: String(product.costPrice),
      sellingPrice: String(product.sellingPrice),
    },
    onSubmit: async (payload) => {
      // await updateProduct(product.id, payload);
      router.refresh(); // reload the product list
      onClose();
    },
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit product"
      description="Update the details of this product."
    >
      <ProductForm form={form} submitLabel="Save changes" onCancel={onClose} />
    </Modal>
  );
}