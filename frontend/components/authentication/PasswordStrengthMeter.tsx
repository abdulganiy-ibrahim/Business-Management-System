import { getPasswordStrength, type PasswordStrength } from '@/utils/passwordStrength';

const levels: Record<
  PasswordStrength,
  { label: string; filledBars: number; barClass: string; textClass: string }
> = {
  weak: { label: 'Weak', filledBars: 1, barClass: 'bg-danger', textClass: 'text-danger' },
  okay: { label: 'Okay', filledBars: 2, barClass: 'bg-amber-500', textClass: 'text-amber-700' },
  strong: { label: 'Strong', filledBars: 3, barClass: 'bg-primary', textClass: 'text-primary' },
};

// Three bars that fill up as the password gets stronger, with a label
export default function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (!strength) return null;

  const level = levels[strength];

  return (
    <div className="flex items-center gap-3">
      <div aria-hidden className="flex flex-1 gap-1.5">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              bar <= level.filledBars ? level.barClass : 'bg-foreground/10'
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${level.textClass}`}>{level.label}</span>
    </div>
  );
}