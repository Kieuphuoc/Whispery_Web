import * as React from "react"
import { cn } from "@/shared/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, ...props }, ref) => {
    return (
      <div className={cn(
        "flex h-12 w-full items-center gap-3 rounded-input border border-gray-100 bg-white px-4 shadow-sm transition-all focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10",
        className
      )}>
        {icon && <div className="text-gray-400">{icon}</div>}
        <input
          type={type}
          className="flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          {...props}
        />
        {rightElement && <div className="text-gray-400">{rightElement}</div>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
