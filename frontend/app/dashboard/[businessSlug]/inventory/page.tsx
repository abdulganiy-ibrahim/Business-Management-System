import { notFound } from "next/navigation";
import { InventoryView } from "@/components/business-dashboard";
import { getServerApi } from "@/lib/api/serverApi";
import { getBusinessBySlug } from "@/lib/data/BusinessData";
import { getInventoryByBusinessId } from "@/lib/data/inventoryData";
import { listOrEmpty } from "@/lib/data/listOrEmpty";
import { getProductsByBusinessId } from "@/lib/data/productData";

type InventoryPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export default async function InventoryPage({ params }: InventoryPageProps) {
  const { businessSlug } = await params;
  const api = await getServerApi();

  const business = await getBusinessBySlug(api, businessSlug);
  if (!business) notFound();

  const [inventory, products] = await Promise.all([
    listOrEmpty(() => getInventoryByBusinessId(api, business.id)),
    listOrEmpty(() => getProductsByBusinessId(api, business.id)),
  ]);

  return (
    <InventoryView
      inventory={inventory}
      products={products}
      businessId={business.id}
    />
  );
}