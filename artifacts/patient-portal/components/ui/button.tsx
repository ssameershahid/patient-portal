"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-forest-700 text-cream-100 hover:bg-forest-600 rounded-pill",
        secondary: "border-2 border-forest-700 text-forest-700 hover:bg-forest-50 rounded-pill",
        accent: "bg-warm-500 text-white hover:bg-warm-600 rounded-pill",
        destructive: "bg-error text-white hover:bg-error/90 rounded-pill",
        outline: "border border-cream-400 bg-white text-cream-900 hover:bg-cream-100 rounded-xl",
        ghost: "text-cream-700 hover:bg-cream-100 hover:text-cream-900 rounded-xl",
        link: "text-forest-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-7 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
