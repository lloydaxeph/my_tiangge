import clsx from "clsx";
import type { Category } from "../../types/domain";

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
  noneLabel = "All",
}: {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  noneLabel?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={clsx(
          "shrink-0 rounded-full px-4 py-2 text-base font-semibold",
          selectedId === null ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-700"
        )}
      >
        {noneLabel}
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={clsx(
            "shrink-0 rounded-full px-4 py-2 text-base font-semibold",
            selectedId === c.id ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-700"
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
