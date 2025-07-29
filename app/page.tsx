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
      setExpandedStep(10) // Automatically expand step 10 when input is submitted
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header is already included in app/layout.tsx */}
      <div className="container mx-auto px-4 py-16">
        <main id="main-content" className="flex justify-center">
          {/* Removed StepperSection from the main page */}
          <Cards />
        </main>
      </div>
      <Chatbot />
      {/* Footer is already included in app/layout.tsx */}
    </div>
  )
}
