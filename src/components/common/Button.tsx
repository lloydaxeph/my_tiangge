import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-emerald-600 text-white active:bg-emerald-700 disabled:bg-emerald-300",
  secondary: "bg-white text-emerald-700 border-2 border-emerald-600 active:bg-emerald-50",
  danger: "bg-red-600 text-white active:bg-red-700 disabled:bg-red-300",
  ghost: "bg-transparent text-neutral-700 active:bg-neutral-100",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth = true, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "min-h-16 rounded-2xl px-6 text-xl font-semibold shadow-sm transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-70",
          fullWidth && "w-full",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
