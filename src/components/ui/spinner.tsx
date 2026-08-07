import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  color?: "default" | "primary" | "white"
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  default: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
}

const colorClasses = {
  default: "border-muted-foreground/20 border-t-muted-foreground",
  primary: "border-primary/20 border-t-primary",
  white: "border-white/20 border-t-white",
}

function Spinner({ className, size = "default", color = "default", ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Spinner }
