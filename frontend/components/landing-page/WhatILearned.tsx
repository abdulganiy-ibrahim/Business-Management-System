const lessons = [
  "Designing a relational schema that holds up under real inventory math: stock has to deduct correctly across returns, edits, and partial refunds.",
  "Building an AI agent with real tool access to live business data, instead of a chatbot glued onto static text.",
  "Writing an API clean enough to serve both a UI and an AI agent as clients, without duplicating logic between them.",
  "Building auth and access control good enough to trust with someone else's sales numbers.",
];

export default function WhatILearned() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
        What building this taught me
      </h2>
      <p className="mt-4 text-neutral-600">
        This project was as much for me as a developer as it was for the
        business owners using it.
      </p>

      <ul className="mt-8 space-y-5">
        {lessons.map((lesson) => (
          <li key={lesson} className="flex gap-3 text-neutral-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F6F5C]" />
            <span>{lesson}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}