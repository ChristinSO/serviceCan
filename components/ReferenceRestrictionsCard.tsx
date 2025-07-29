"use client"
import type * as React from "react"
import { XCircle } from "lucide-react"

interface ReferenceRestrictionsCardProps {
  title: string;
  items: string[];
}

export const ReferenceRestrictionsCard: React.FC<ReferenceRestrictionsCardProps> = ({ title, items }) => {
  return (
    <article className="bg-white border border-pink-800 border-solid w-full m-2">
      <header className="flex gap-2.5 items-center p-2.5 w-full text-lg leading-tight text-pink-800 bg-red-100 border border-pink-800 border-solid">
        <XCircle className="h-8 w-8 text-red-800" aria-hidden="true" />
        <h3 className="self-stretch my-auto">{title}</h3>
      </header>
      <section className="flex flex-col justify-center px-5 py-2 mt-2.5 w-full">
        <ul className="text-base leading-relaxed text-black list-disc pl-5">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  )
}