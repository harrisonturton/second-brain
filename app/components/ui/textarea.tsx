import * as React from "react"

import { cn } from "@/lib/utils"
import {ArrowUp} from "lucide-react";

interface TextareaProps extends React.ComponentProps<"textarea"> {
}

function Textarea({ className, ...props }: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = React.useState(false)

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current
    const container = containerRef.current
    if (!textarea || !container) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    
    // Get the available height from the parent container
    const parentContainer = container.parentElement
    if (!parentContainer) return
    
    const parentHeight = parentContainer.clientHeight
    const containerTop = container.offsetTop
    const availableHeight = parentHeight - containerTop - 20 // 20px buffer
    
    // Calculate the content height needed
    const contentHeight = textarea.scrollHeight
    const buttonHeight = 48 // button div height (32px + 16px padding)
    const totalNeededHeight = contentHeight + buttonHeight
    
    if (totalNeededHeight <= availableHeight) {
      // Still expanding - set height to content
      textarea.style.height = `${contentHeight}px`
      setIsScrollable(false)
    } else {
      // Reached max height - set to available space and enable scroll
      const maxTextareaHeight = availableHeight - buttonHeight
      textarea.style.height = `${maxTextareaHeight}px`
      setIsScrollable(true)
    }
  }, [])

  // Adjust height on mount and when value changes
  React.useEffect(() => {
    adjustHeight()
  }, [adjustHeight, props.value])

  // Also adjust on window resize
  React.useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [adjustHeight])

  return (
    <div ref={containerRef} className="border-input rounded-3xl border bg-transparent">
      <div className="w-full">
        <textarea
          ref={textareaRef}
          data-slot="textarea"
                      className={cn(
              "placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none rounded-t-xl",
              isScrollable ? "overflow-y-auto" : "overflow-hidden",
              className
            )}
          onInput={adjustHeight}
          {...props}
        />
      </div>
      <div className="flex justify-end p-2">
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          <ArrowUp/>
        </button>
      </div>
    </div>
  )
}

export { Textarea }
