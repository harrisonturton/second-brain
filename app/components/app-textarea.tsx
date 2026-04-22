import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface AppTextareaProps {
  onSubmit?: (value: string) => void | Promise<void>
}

export function AppTextarea({ onSubmit }: AppTextareaProps = {}) {
  const [value, setValue] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed && onSubmit) {
        onSubmit(trimmed)
        setValue("")
      }
    }
  }

  return (
      <Textarea
          placeholder="Ask anything"
          id="message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="overflow-y-auto break-words rounded-3xl resize-none max-h-full max-w-[768px]"
      />
  )
}
