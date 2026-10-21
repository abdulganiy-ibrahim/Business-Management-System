"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice } from "@/lib/format";
import type { SalesChartPoint } from "@/types/dashboardType";
import DashboardCard from "./DashboardCard";
import {
  formatCompactNumber,
  getChartTotal,
  toChartData,
} from "@/utils/dashboardStatsUtils";

// Chart colors in one place. They read your theme colors.
const chartColors = {
  line: "var(--color-primary)",
  grid: "var(--color-border)",
  text: "var(--color-muted)",
  tooltipBackground: "var(--color-background)",
  tooltipText: "var(--color-foreground)",
};

type SalesChartCardProps = {
  points: SalesChartPoint[]; // always 7 days from the backend
  className?: string;
};

export default function SalesChartCard({
  points,
  className,
}: SalesChartCardProps) {
  const data = toChartData(points);
  const hasSales = points.some((point) => point.total > 0);

  // Tooltip title: "Mon" (the axis label) -> "Mon, 21 Oct 2026"
  const fullDates = Object.fromEntries(
    data.map((day) => [day.label, day.fullDate]),
  );

  return (
    <DashboardCard
      title="Sales overview"
      description={`Last 7 days · ${formatPrice(getChartTotal(points))}`}
      className={className}
    >
      {hasSales ? (
        <div
          role="img"
          aria-label="Line chart of sales for the last 7 days"
          className="h-64 w-full sm:h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                {/* The soft fill under the line */}
                <linearGradient id="sales-chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.line} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.line} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke={chartColors.grid} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: chartColors.text }}
              />
              <YAxis
                width={44}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCompactNumber}
                tick={{ fontSize: 12, fill: chartColors.text }}
              />

              <Tooltip
                formatter={(value) => [formatPrice(Number(value)), "Sales"]}
                labelFormatter={(label) => fullDates[String(label)] ?? label}
                contentStyle={{
                  background: chartColors.tooltipBackground,
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: chartColors.tooltipText, fontWeight: 600 }}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke={chartColors.line}
                strokeWidth={2}
                fill="url(#sales-chart-fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        // Same height as the chart, so the page doesn't jump
        <p className="flex h-64 items-center justify-center text-sm text-muted sm:h-72">
          No sales in the last 7 days.
        </p>
      )}
    </DashboardCard>
  );
}