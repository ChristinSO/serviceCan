"use client"

import { useState } from "react"
import { Chatbot } from "@/components/chatbot"
import { Cards } from "@/components/cards"

export default function PassportApplication() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [step9Input, setStep9Input] = useState("")
  const [step10Expanded, setStep10Expanded] = useState(false)

  const handleStep9Submit = () => {
    if (step9Input.trim()) {
      setStep10Expanded(true)
      setExpandedStep(10) // relic, modifiying this - results in bugs and I do not have the time or the patience. Good luck soldier
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <main id="main-content" className="flex justify-center">
          <Cards />
        </main>
      </div>
      <Chatbot />
    </div>
  )
}
