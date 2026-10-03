import { notFound } from "next/navigation";
import { SalesView } from "@/components/business-dashboard";
import { getServerApi } from "@/lib/api/serverApi";
import { getBusinessBySlug } from "@/lib/data/BusinessData";
import { listOrEmpty } from "@/lib/data/listOrEmpty";
import { getProductsByBusinessId } from "@/lib/data/productData";
import { getSalesByBusinessId } from "@/lib/data/saleData";

type SalesPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export default async function SalesPage({ params }: SalesPageProps) {
  const { businessSlug } = await params;
  const api = await getServerApi();

  const business = await getBusinessBySlug(api, businessSlug);
  if (!business) notFound();

  // The two requests don't depend on each other, so run them together
  const [sales, products] = await Promise.all([
    listOrEmpty(() => getSalesByBusinessId(api, business.id)),
    listOrEmpty(() => getProductsByBusinessId(api, business.id)),
  ]);

  return (
    <SalesView sales={sales} products={products} businessId={business.id} />
  );
}