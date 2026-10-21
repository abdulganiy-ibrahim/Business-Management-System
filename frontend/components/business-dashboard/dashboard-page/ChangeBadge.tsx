import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

const base =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium";

const styles = {
  good: "bg-primary/10 text-primary",
  bad: "bg-danger/10 text-danger",
  neutral: "bg-foreground/5 text-muted",
};

type ChangeBadgeProps = {
  /** From the backend. null means last period was 0 and this one is not. */
  changePercent: number | null;
  /** false for things where a rise is bad, like money out */
  higherIsBetter?: boolean;
};

// Green-ish for good changes, red for bad ones, grey for no change
export default function ChangeBadge({
  changePercent,
  higherIsBetter = true,
}: ChangeBadgeProps) {
  if (changePercent === null) {
    return (
      <span className={`${base} ${higherIsBetter ? styles.good : styles.neutral}`}>
        New
      </span>
    );
  }

  if (changePercent === 0) {
    return <span className={`${base} ${styles.neutral}`}>No change</span>;
  }

  const isUp = changePercent > 0;
  const isGood = isUp === higherIsBetter;
  const Icon = isUp ? FiTrendingUp : FiTrendingDown;

  return (
    <span className={`${base} ${isGood ? styles.good : styles.bad}`}>
      <Icon className="size-3.5" />
      {isUp ? "+" : ""}
      {changePercent}%
    </span>
  );
}