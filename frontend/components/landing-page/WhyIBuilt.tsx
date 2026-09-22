
export default function WhyIBuilt() {
  return (
    <section id="why" className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Why I built this
        </h2>
        <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-neutral-700">
          <p>
            I kept running into the same story: small business owners
            managing stock, sales, and pricing across three spreadsheets and
            a notebook, guessing at what to reorder. I wanted to build
            something that actually answers the question they care about:
            "how am I doing?" Not another dashboard to decode.
          </p>
          <p>
            It was also the project I needed as a developer. Most of my
            previous work stopped at CRUD. This one forced me to design data
            that holds up under real business logic, and to connect an AI
            agent to that data directly, rather than bolting a chatbot onto a
            static help page.
          </p>
        </div>
      </div>
    </section>
  );
}
