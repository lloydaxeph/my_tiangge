import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <Icon className="h-14 w-14 text-neutral-300" />
      <p className="text-xl font-semibold text-neutral-700">{title}</p>
      {description && <p className="text-lg text-neutral-500">{description}</p>}
    </div>
  );
}
