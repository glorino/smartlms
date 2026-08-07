"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value" | "defaultValue"> {
  min?: number
  max?: number
  step?: number
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  showValue?: boolean
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, showValue = false, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<number[]>(
      defaultValue || [min]
    )

    const currentValue = value || internalValue
    const percentage = ((currentValue[0] - min) / (max - min)) * 100

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(e.target.value)]
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <div className="w-full">
        {showValue && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {min}
            </span>
            <span className="text-sm font-medium text-foreground">
              {currentValue[0]}
            </span>
            <span className="text-sm text-muted-foreground">
              {max}
            </span>
          </div>
        )}
        <div className="relative flex w-full touch-none select-none items-center">
          <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={currentValue[0]}
            onChange={handleChange}
            className={cn(
              "w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:hover:bg-accent [&::-webkit-slider-thumb]:focus-visible:outline-none [&::-webkit-slider-thumb]:focus-visible:ring-2 [&::-webkit-slider-thumb]:focus-visible:ring-ring [&::-webkit-slider-thumb]:focus-visible:ring-offset-2",
              "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-secondary",
              className
            )}
            {...props}
          />
        </div>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
