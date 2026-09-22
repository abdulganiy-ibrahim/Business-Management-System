"use client";

import { useState } from "react";
import {
  FiBox,
  FiTrendingUp,
  FiPackage,
  FiMessageCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";

/* -------------------------------------------------------------------- */
/*  Navbar                                                               */
/* -------------------------------------------------------------------- */

function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Why I built this", href: "#why" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#F7F7F5]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-semibold tracking-tight text-neutral-900">
          Bizview
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#get-started"
            className="rounded-lg bg-[#1F6F5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#195A4B]"
          >
            Get started
          </a>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-neutral-200 px-6 py-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#get-started"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-[#1F6F5C] px-4 py-2 text-center text-sm font-medium text-white"
          >
            Get started
          </a>
        </nav>
      )}
    </header>
  );
}

/* -------------------------------------------------------------------- */
/*  Hero                                                                 */
/* -------------------------------------------------------------------- */

function Hero() {
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
              href="#get-started"
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

/* -------------------------------------------------------------------- */
/*  Why I built this                                                     */
/* -------------------------------------------------------------------- */

function WhyIBuilt() {
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

/* -------------------------------------------------------------------- */
/*  Features                                                             */
/* -------------------------------------------------------------------- */

const features = [
  {
    icon: FiBox,
    title: "Inventory management",
    description:
      "Know what you have, what's running low, and what's not moving. Updated the moment a sale comes in.",
  },
  {
    icon: FiTrendingUp,
    title: "Sales tracking",
    description:
      "Every sale is logged automatically, so your revenue and trends are always current, not last week's export.",
  },
  {
    icon: FiPackage,
    title: "Product catalog",
    description:
      "Organize products, variants, and pricing in one place instead of across scattered spreadsheets.",
  },
  {
    icon: FiMessageCircle,
    title: "Ask the AI agent",
    description:
      "Ask plain questions, like \"what sold best last month?\", and get a straight answer with the numbers behind it.",
  },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-neutral-900">
        Everything your business runs on, in one place.
      </h2>

      <div className="mt-12 divide-y divide-neutral-200 border-t border-neutral-200">
        {features.map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className={`flex flex-col gap-4 py-8 md:flex-row md:items-center md:gap-10 ${
              i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EFF6F3] text-[#1F6F5C]">
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
              <p className="mt-1 max-w-md text-neutral-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/*  How it works — a genuine sequence, so numbering earns its place      */
/* -------------------------------------------------------------------- */

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

function HowItWorks() {
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

/* -------------------------------------------------------------------- */
/*  What building this taught me                                        */
/* -------------------------------------------------------------------- */

const lessons = [
  "Designing a relational schema that holds up under real inventory math: stock has to deduct correctly across returns, edits, and partial refunds.",
  "Building an AI agent with real tool access to live business data, instead of a chatbot glued onto static text.",
  "Writing an API clean enough to serve both a UI and an AI agent as clients, without duplicating logic between them.",
  "Building auth and access control good enough to trust with someone else's sales numbers.",
];

function WhatILearned() {
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

/* -------------------------------------------------------------------- */
/*  Final CTA                                                            */
/* -------------------------------------------------------------------- */

function FinalCTA() {
  return (
    <section id="get-started" className="border-t border-neutral-200 bg-[#14181A]">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Stop guessing how your business is doing.
        </h2>
        <p className="mt-4 text-neutral-300">
          Set up your catalog, connect your sales, and start asking.
        </p>
        <a
          href="#"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
        >
          Get started free
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/*  Footer                                                               */
/* -------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="bg-[#14181A] px-6 py-8 text-sm text-neutral-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
        <span>© {new Date().getFullYear()} Bizview. Built by a developer, for small businesses.</span>
        <a href="https://github.com" className="hover:text-white">
          View the code
        </a>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------- */
/*  Page composition                                                     */
/* -------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <main className="bg-[#F7F7F5] text-neutral-900">
      <Navbar />
      <Hero />
      <WhyIBuilt />
      <Features />
      <HowItWorks />
      <WhatILearned />
      <FinalCTA />
      <Footer />
    </main>
  );
}