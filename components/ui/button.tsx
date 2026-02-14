import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "md" | "sm" | "lg" | "xl";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-gradient-to-br from-coral-400 to-coral-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
            secondary: "border-2 border-coral-400 text-coral-600 bg-transparent hover:bg-coral-50",
            ghost: "text-warm-700 hover:bg-warm-100",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
            xl: "px-10 py-5 text-xl",
        };

        return (
            <Comp
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
