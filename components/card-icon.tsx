import type React from "react"

interface CardIconProps {
  svgContent: string
  className?: string
}

export const CardIcon: React.FC<CardIconProps> = ({ svgContent, className = "" }) => {
  return (
    <div
      className={`flex shrink-0 gap-2.5 justify-center items-center p-2.5 bg-indigo-50 rounded-xl h-[168px] w-[300px] max-md:h-[150px] max-md:w-[272px] max-sm:w-full max-sm:h-[140px] ${className}`}
    >
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  )
}
