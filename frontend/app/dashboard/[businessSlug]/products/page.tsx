import { notFound } from "next/navigation";
import { ProductsView } from "@/components/business-dashboard";
import { getServerApi } from "@/lib/api/serverApi";
import { getBusinessBySlug } from "@/lib/data/BusinessData";
import { getProductsByBusinessId } from "@/lib/data/productData";
import type { Product } from "@/types/productType";

type ProductsPageProps = {
  params: Promise<{ businessSlug: string }>;
};

function isNotFoundError(error: unknown): boolean {
  const { status, response } = (error ?? {}) as {
    status?: number;
    response?: { status?: number };
  };
  return status === 404 || response?.status === 404;
}

async function loadProducts(
  api: Awaited<ReturnType<typeof getServerApi>>,
  businessId: string,
): Promise<Product[]> {
  try {
    return (await getProductsByBusinessId(api, businessId)) ?? [];
  } catch (error) {
    if (isNotFoundError(error)) return [];
    throw error; // real failures go to error.tsx
  }
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { businessSlug } = await params;
  const api = await getServerApi();

  const business = await getBusinessBySlug(api, businessSlug);
  if (!business) notFound(); // unknown business is a real 404

  const products = await loadProducts(api, business.id);

  return <ProductsView products={products} businessId={business.id} />;
}