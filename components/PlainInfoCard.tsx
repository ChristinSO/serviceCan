"use client"
import type * as React from "react"

interface PlainInfoCardProps {
  title?: string
  children: React.ReactNode
}

export const PlainInfoCard: React.FC<PlainInfoCardProps> = ({ title, children }) => {
  return (
    <article className="bg-white border border-gray-300 border-solid w-full m-5">
      {title && (
        <header className="flex gap-2.5 items-center p-2.5 w-full text-lg leading-tight text-gray-800 bg-gray-100 border-b border-gray-300 border-solid">
          <h3 className="self-stretch my-auto">{title}</h3>
        </header>
      )}
      <section className="flex flex-col justify-center px-5 py-2 mt-2.5 w-full">{children}</section>
    </article>
  )
}
