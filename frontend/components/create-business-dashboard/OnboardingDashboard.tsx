"use client";
import { useState, useEffect } from "react";
import OnboardingHeader from "./OnboardingHeader";
import BusinessList from "./BusinessList";
import CreateBusinessForm from "./CreateBusinessForm";
import { Business } from "@/types/BusinessType";
import { getBusinesses } from "@/lib/data/BusinessData";
import { toast } from "sonner";

interface OnboardingDashboardProps {
  userName?: string;
}

export default function OnboardingDashboard({
  userName }: OnboardingDashboardProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const fetchBusinesses = async () => {
    try {
      const data = await getBusinesses();

      setBusinesses(data);
    } catch (error) {
      toast.error(
        error instanceof Error ?
        error.message :
        'Failed to fetch Businesses'
      );
    } 
  }

  useEffect(() => {
    fetchBusinesses();
  }, []);
  
  const hasBusinesses = businesses.length > 0;

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <OnboardingHeader userName={userName} />

        {hasBusinesses ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <section>
              <h2 className="mb-4 text-sm font-medium text-muted">
                Your businesses
              </h2>
              <BusinessList businesses={businesses} />
            </section>

            <section>
              <CreateBusinessForm compact />
            </section>
          </div>
        ) : (
          <div className="mx-auto max-w-md">
            <CreateBusinessForm />
          </div>
        )}
      </div>
    </main>
  );
}