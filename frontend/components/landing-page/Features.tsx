import {
  FiBox,
  FiTrendingUp,
  FiPackage,
  FiMessageCircle,
} from "react-icons/fi";

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

export default function Features() {
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