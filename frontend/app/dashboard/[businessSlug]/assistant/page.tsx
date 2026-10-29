import { notFound } from "next/navigation";
import { AssistantView } from "@/components/business-dashboard";
import { getServerApi } from "@/lib/api/serverApi";
import { getBusinessBySlug } from "@/lib/data/BusinessData";

type AssistantPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export default async function AssistantPage({ params }: AssistantPageProps) {
  const { businessSlug } = await params;
  const api = await getServerApi();

  const business = await getBusinessBySlug(api, businessSlug);
  if (!business) notFound();

  return <AssistantView businessId={business.id} />;
}