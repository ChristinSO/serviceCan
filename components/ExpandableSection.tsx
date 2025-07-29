"use client"
import * as React from "react"
import { InfoIcon } from "./InfoIcon"
interface ExpandableSectionProps {
  triggerText: string
  children: React.ReactNode
}
export const ExpandableSection: React.FC<ExpandableSectionProps> = ({ triggerText, children }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  return (
    <div className="mt-2.5 w-full">
      <button
        className="flex gap-2 items-center w-full text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="expandable-content"
      >
        <InfoIcon className="self-stretch my-auto" />
        <div className="flex overflow-hidden flex-1 shrink items-center self-stretch px-0 py-2.5 my-auto text-lg font-semibold leading-7 basis-0 min-w-60 text-zinc-800">
          <span className="flex-1 shrink self-stretch my-auto text-lg leading-7 basis-0 text-zinc-800 font-normal">
            {triggerText}
          </span>
        </div>
      </button>
      {isExpanded && (
        <div id="expandable-content" className="mt-2.5">
          {children}
        </div>
      )}
    </div>
  )
}
