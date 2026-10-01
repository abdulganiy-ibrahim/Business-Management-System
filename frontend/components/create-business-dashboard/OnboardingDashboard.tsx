"use client";
import { useState, useEffect } from "react";
import OnboardingHeader from "./OnboardingHeader";
import BusinessList from "./BusinessList";
import CreateBusinessForm from "./CreateBusinessForm";
import { Business } from "@/types/BusinessType";
import { getBusinesses } from "@/lib/data/BusinessData";
import { browserApi } from "@/lib/api/browserApi";
import { toast } from "sonner";

interface OnboardingDashboardProps {
  userName?: string;
  businesses: Business[];
}

export default function OnboardingDashboard({
  userName, businesses }: OnboardingDashboardProps) {
  
  const hasBusinesses = businesses.length > 0;

  return (
    <main className="min-h-screen bg-white">
      <div>
        <OnboardingHeader userName={userName} />

        {hasBusinesses ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <section>
              <h2 className="mb-4 text-sm font-medium text-muted px-2">
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