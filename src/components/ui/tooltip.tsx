"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined)

function useTooltip() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error("Tooltip components must be used within a Tooltip provider")
  }
  return context
}

interface TooltipProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
}

function Tooltip({ children, open: controlledOpen, onOpenChange: controlledOnOpenChange, delayDuration = 200 }: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const onOpenChange = controlledOnOpenChange || setUncontrolledOpen

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <TooltipContext.Provider value={{ open, onOpenChange }}>
      <div className="relative inline-block">
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

interface TooltipTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ children, className, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const { onOpenChange } = useTooltip()

    return (
      <button
        ref={ref}
        type="button"
        className={cn("outline-none", className)}
        onMouseEnter={(e) => {
          onOpenChange(true)
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          onOpenChange(false)
          onMouseLeave?.(e)
        }}
        onFocus={(e) => {
          onOpenChange(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          onOpenChange(false)
          onBlur?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

function TooltipContent({ className, side = "top", sideOffset = 4, children, ...props }: TooltipContentProps) {
  const { open } = useTooltip()

  if (!open) return null

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
