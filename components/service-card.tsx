import type React from "react"
import Link from "next/link"
import { CardIcon } from "./card-icon"
import { CardImage } from "./card-image"

interface ServiceCardProps {
  title: string
  description: string
  iconType: "svg" | "image"
  iconContent: string
  altText?: string
  href?: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  iconType,
  iconContent,
  altText = "",
  href,
}) => {
  const CardContent = () => (
    <article className="flex flex-col gap-6 items-start px-6 pt-4 pb-9 rounded-xl shadow-sm bg-zinc-100 h-[357px] max-w-[348px] min-w-[348px] w-[348px] max-md:w-80 max-md:max-w-xs max-md:h-auto max-md:min-w-80 max-sm:px-5 max-sm:pt-4 max-sm:pb-8 max-sm:w-full max-sm:max-w-none max-sm:min-w-[auto] hover:shadow-md transition-shadow cursor-pointer">
      {iconType === "svg" ? <CardIcon svgContent={iconContent} /> : <CardImage src={iconContent} alt={altText} />}
      <div className="flex flex-col gap-2.5 items-start self-stretch">
        <header className="flex gap-2.5 items-start self-stretch">
          <h3 className="text-3xl font-bold leading-10 underline decoration-1 decoration-slate-700 decoration-solid flex-[1_0_0] text-slate-700 underline-offset-[2.5px] max-md:text-2xl max-md:leading-9 max-sm:text-2xl max-sm:leading-8">
            {title}
          </h3>
        </header>
        <p className="self-stretch text-xl leading-8 text-zinc-800 max-md:text-lg max-md:leading-7 max-sm:text-base max-sm:leading-7">
          {description}
        </p>
      </div>
    </article>
  )

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}
