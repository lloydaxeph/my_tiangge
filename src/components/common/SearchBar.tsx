import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-neutral-400" />
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-14 w-full rounded-xl border-2 border-neutral-300 pl-12 pr-4 text-lg focus:border-emerald-600 focus:outline-none"
      />
    </div>
  );
}
