import type React from "react"

interface CardImageProps {
  src: string
  alt: string
  className?: string
}

export const CardImage: React.FC<CardImageProps> = ({ src, alt, className = "" }) => {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={`flex shrink-0 gap-2.5 justify-center items-center rounded-xl h-[168px] w-[300px] max-md:h-[150px] max-md:w-[272px] max-sm:w-full max-sm:h-[140px] ${className}`}
    />
  )
}
