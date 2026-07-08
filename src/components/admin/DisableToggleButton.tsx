import clsx from "clsx";

export function DisableToggleButton({
  disabled,
  onToggle,
}: {
  disabled: boolean;
  onToggle: (nextDisabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!disabled)}
      className={clsx(
        "shrink-0 rounded-full px-4 py-2 text-base font-semibold",
        disabled ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
      )}
    >
      {disabled ? "Disabled" : "Active"}
    </button>
  );
}
