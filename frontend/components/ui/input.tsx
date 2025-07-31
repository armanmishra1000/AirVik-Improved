import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex px-6 py-2.5 w-full rounded-lg border border-[#B0B0B0] bg-transparent text-base transition-colors file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-[#2f2f2f] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
