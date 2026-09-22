const steps = [
  {
    title: "Add your products",
    description: "Set up your catalog and starting stock in a few minutes.",
  },
  {
    title: "Record sales as they happen",
    description:
      "Log sales manually or connect your point of sale, and inventory updates itself.",
  },
  {
    title: "Ask the AI anything",
    description:
      '"Why did sales dip on Tuesdays?" Get a direct answer, backed by your own numbers.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          How it works
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title}>
              <span className="text-sm font-medium text-[#1F6F5C]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-medium text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-2 text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}