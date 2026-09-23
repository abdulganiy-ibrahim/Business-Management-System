"use client";
import OnboardingHeader from "./OnboardingHeader";
import BusinessList from "./BusinessList";
import CreateBusinessForm from "./CreateBusinessForm";
import { Business, BusinessFormValues } from "@/types/BusinessType";

interface OnboardingDashboardProps {
  userName?: string;
  /** Will come from the API once business fetching is wired up. */
  businesses?: Business[];
}

export default function OnboardingDashboard({
  userName,
  businesses = [],
}: OnboardingDashboardProps) {
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