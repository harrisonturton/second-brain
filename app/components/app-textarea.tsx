import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function AppTextarea() {
  const [value, setValue] = useState("")

  return (
      <Textarea
          placeholder="Ask anything"
          id="message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="overflow-y-auto break-words rounded-3xl resize-none max-h-full"
      />
  )
}
