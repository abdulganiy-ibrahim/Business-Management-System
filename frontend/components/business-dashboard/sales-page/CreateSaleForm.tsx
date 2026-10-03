"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { createSaleAction } from "@/lib/actions/saleActions";
import type { Product } from "@/types/productType";
import SaleForm from "./SaleForm";
import { useSaleForm } from "@/hooks/useSaleForm";

type CreateSaleFormProps = {
  businessId: string;
  products: Product[]; // the business's products, shown in the dropdown
  onClose: () => void;
};

// Mount this only while it's open (see SalesView) so the form starts empty every time.
export default function CreateSaleForm({
  businessId,
  products,
  onClose,
}: CreateSaleFormProps) {
  const router = useRouter();

  const form = useSaleForm({
    products,
    onSubmit: async (payload) => {
      const result = await createSaleAction(businessId, payload); // talks to the server
      if (!result.success) throw new Error(result.message); // shown inside the form

      router.refresh(); // reload the sales list
      onClose();
    },
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="New sale"
      description="Choose what was sold and how many."
    >
      <SaleForm form={form} products={products} onCancel={onClose} />
    </Modal>
  );
}