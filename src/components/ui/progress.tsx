import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  label?: string
  color?: "default" | "blue" | "green" | "yellow" | "red"
  showValue?: boolean
}

const colorClasses = {
  default: "bg-primary",
  blue: "bg-blue-600",
  green: "bg-green-600",
  yellow: "bg-yellow-600",
  red: "bg-red-600",
}

function Progress({
  className,
  value = 0,
  max = 100,
  label,
  color = "default",
  showValue = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className="w-full" {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showValue && <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-300 ease-in-out",
            colorClasses[color]
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    </div>
  )
}

export { Progress }
