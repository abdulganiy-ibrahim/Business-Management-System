import type { SummaryCards } from "@/types/dashboardType";
import SummaryCard from "./SummaryCard";
import { summaryCardItems } from "./summaryCardItems";

// 2 x 2 on phones and tablets, one row of four from xl up
export default function SummaryCardGrid({ summary }: { summary: SummaryCards }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {summaryCardItems.map((item) => {
        const card = summary[item.key];

        return (
          <SummaryCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={item.formatValue(card.current)}
            changePercent={card.changePercent}
            higherIsBetter={item.higherIsBetter}
          />
        );
      })}
    </div>
  );
}