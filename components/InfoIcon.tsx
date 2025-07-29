"use client"
import type * as React from "react"
interface InfoIconProps {
  className?: string
}
export const InfoIcon: React.FC<InfoIconProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center w-6 min-h-6 ${className}`}>
      <img
        src="/placeholder.svg?height=16&width=16"
        alt="Information icon"
        className="object-contain self-stretch my-auto w-4 aspect-[1.6] fill-slate-700"
      />
    </div>
  )
}
