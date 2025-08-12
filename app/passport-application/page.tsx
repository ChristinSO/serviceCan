"use client"

import { useState } from "react"
import { StepperSection } from "@/components/stepper-section"
import { Chatbot } from "@/components/chatbot"

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
      <div className="container mx-auto py-8">
        {/* Main content area for the application */}
        <main id="main-content" className="lg:w-4/5 w-full mx-auto">
          <StepperSection
            expandedStep={expandedStep}
            setExpandedStep={setExpandedStep}
            step9Input={step9Input}
            setStep9Input={setStep9Input}
            handleStep9Submit={handleStep9Submit}
            step10Expanded={step10Expanded}
          />
        </main>
      </div>

      <Chatbot />
    </div>
  )
}
