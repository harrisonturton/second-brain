import type { SVGProps } from 'react'

export function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19.5V4.5m0 0L5.25 11.25M12 4.5l6.75 6.75"
      />
    </svg>
  )
}
