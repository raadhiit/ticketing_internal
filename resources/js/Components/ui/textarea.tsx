import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
      <textarea
          ref={ref}
          className={cn(
            "flex bg-transparent shadow-sm px-3 py-1 border border-neutral-600 rounded-md w-full text-base transition-colors",
            "placeholder:text-muted-foreground focus-visible:border-neutral-400",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

            // === Tambahan untuk textarea ===
            "min-h-[80px] resize-none",
              className,
          )}
          {...props}
      />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
