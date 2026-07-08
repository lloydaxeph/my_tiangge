import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  onBack,
  action,
}: {
  title: string;
  onBack?: boolean | (() => void);
  action?: ReactNode;
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof onBack === "function") return onBack();
    navigate(-1);
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      {onBack && (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full active:bg-neutral-200"
        >
          <ChevronLeft className="h-8 w-8 text-neutral-700" />
        </button>
      )}
      <h1 className="flex-1 truncate text-2xl font-bold text-neutral-900">{title}</h1>
      {action}
    </div>
  );
}
