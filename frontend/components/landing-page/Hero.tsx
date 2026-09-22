export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            See your business clearly, then just ask.
          </h1>
          <p className="mt-5 max-w-md text-lg text-neutral-600">
            Bizview tracks your inventory, sales, and products in one place.
            It also answers plain questions about how things are actually going.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="sign-up"
              className="rounded-lg bg-[#1F6F5C] px-5 py-3 text-sm font-medium text-white hover:bg-[#195A4B]"
            >
              Get started
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* The most characteristic moment of the product: asking it a question */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-neutral-900 px-4 py-2.5 text-sm text-white">
              How's this week looking?
            </div>
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-[#EFF6F3] px-4 py-2.5 text-sm text-neutral-800">
              Revenue is up 14% vs. last week. You're down to 6 units of
              &nbsp;Blue Hoodie (M). Want me to flag it for reorder?
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-neutral-900 px-4 py-2.5 text-sm text-white">
              Yes, and what sold best?
            </div>
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-[#EFF6F3] px-4 py-2.5 text-sm text-neutral-800">
              Canvas Tote Bag: 42 units, your top seller three weeks running.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}