export const ScoreBar = ({ value }: { value: number | null }) => {
  if (value == null || Number.isNaN(value)) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="group flex min-w-0 items-center gap-2" title={`${Math.round(clamped)}`}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export const ScoreCircle = ({ value }: { value: number | null }) => {
  const strokeDasharray = value ? 175 - (value * 175) / 100 : undefined;
  return (
    <div className="relative w-16 h-16 mb-sm">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-surface-container-high"
          cx="32"
          cy="32"
          fill="transparent"
          r="28"
          stroke="var(--muted-foreground)"
          strokeWidth="6"
        />
        <circle
          className="text-on-tertiary-container"
          cx="32"
          cy="32"
          fill="transparent"
          r="28"
          stroke="var(--primary)"
          strokeDasharray="175"
          strokeDashoffset={strokeDasharray}
          strokeWidth="6"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-metric-sm text-metric-sm">{value}</span>
    </div>
  );
}