const variants = {
  healthy: "bg-emerald-50 text-emerald-700",
  degraded: "bg-amber-50 text-amber-700",
  critical: "bg-red-50 text-red-700",
};

export function StatusBadge({
  status,
}: {
  status: keyof typeof variants;
}) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${variants[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}
