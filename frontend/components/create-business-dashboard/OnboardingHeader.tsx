

export default function OnboardingHeader({ userName }: { userName?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {userName ? `Welcome, ${userName}` : "Welcome"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Create a business to start tracking inventory, sales, and products.
      </p>
    </div>
  );
}