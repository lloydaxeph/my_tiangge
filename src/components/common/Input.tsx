import { type InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className="block" htmlFor={inputId}>
        {label && (
          <span className="mb-1 block text-lg font-medium text-neutral-800">
            {label}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "min-h-14 w-full rounded-xl border-2 border-neutral-300 px-4 text-lg",
            "focus:border-emerald-600 focus:outline-none",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="mt-1 block text-base text-red-600">{error}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";
