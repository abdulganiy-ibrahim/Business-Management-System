import type { SalesChartPoint } from "@/types/dashboardType";

// What the chart is given for each day
export type SalesChartDatum = {
  label: string; // "Mon", shown under the chart
  fullDate: string; // "Mon, 21 Oct 2026", shown in the tooltip
  total: number;
};

// "2026-10-21" -> a Date at local midnight.
// (new Date("2026-10-21") is read as UTC and can shift the day, so the parts are used instead.)
function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toChartData(points: SalesChartPoint[]): SalesChartDatum[] {
  return points.map((point) => {
    const date = parseDateOnly(point.date);

    return {
      label: date.toLocaleDateString("en-GB", { weekday: "short" }),
      fullDate: date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      total: point.total,
    };
  });
}

export function getChartTotal(points: SalesChartPoint[]) {
  const total = points.reduce((sum, point) => sum + point.total, 0);
  return Math.round(total * 100) / 100;
}

// 1200 -> "1.2K", used on the vertical axis
const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactNumber = (value: number) =>
  compactFormatter.format(value);