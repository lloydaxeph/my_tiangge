import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={clsx(
        "w-full rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-colors active:bg-neutral-50",
        className
      )}
      {...props}
    />
  );
}
