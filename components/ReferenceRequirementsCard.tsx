"use client"
import type * as React from "react"
import { CheckCircle2 } from "lucide-react"

interface ReferenceRequirementsCardProps {
  title: string;
  items: string[];
}

export const ReferenceRequirementsCard: React.FC<ReferenceRequirementsCardProps> = ({ title, items }) => {
  return (
    <article className="bg-white border border-green-800 border-solid w-full m-2">
      <header className="flex gap-2.5 items-center p-2.5 w-full text-lg leading-tight text-green-800 bg-green-100 border border-green-800 border-solid">
        <CheckCircle2 className="h-8 w-8 text-green-800" aria-hidden="true" />
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