"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup } from "@/components/ui/radio-group"

// Simple RadioOption component since it's not in shadcn/ui
const RadioOption = ({ id, name, value, label, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
      className="h-4 w-4 text-[#af3c43] border-gray-300 focus:ring-[#af3c43]"
    />
    <label htmlFor={id} className="text-sm sm:text-base text-[#333333] cursor-pointer">
      {label}
    </label>
  </div>
)

// Simple card components
const ReferenceRequirementsCard = ({ title, items }) => (
  <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
    <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mb-3">{title}</h4>
    <ul className="text-xs sm:text-sm text-black list-disc pl-5 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)

const ReferenceRestrictionsCard = ({ title, items }) => (
  <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
    <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mb-3">{title}</h4>
    <ul className="text-xs sm:text-sm text-black list-disc pl-5 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)

const PlainInfoCard = ({ title, items }) => (
  <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mb-3">{title}</h4>
    <ul className="text-xs sm:text-sm text-black list-disc pl-5 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)

interface StepperSectionProps {
  expandedStep: number | null
  setExpandedStep: (step: number | null) => void
  step9Input: string
  setStep9Input: (value: string) => void
  handleStep9Submit: () => void
  step10Expanded: boolean
}

export function StepperSection({
  expandedStep,
  setExpandedStep,
  step9Input,
  setStep9Input,
  handleStep9Submit,
  step10Expanded,
}: StepperSectionProps) {
  const [selectedProcessingTime, setSelectedProcessingTime] = useState<string | null>(null)
  const [selectedPassportType, setSelectedPassportType] = useState<string | null>(null)
  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<string[]>([])
  const [showEmergencyDisclaimer, setShowEmergencyDisclaimer] = useState(false)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle clicking outside accordions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Close any open step when clicking outside the container
        if (expandedStep !== null) {
          setExpandedStep(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [expandedStep, setExpandedStep])

  // Options configuration
  const processingTimeOptions = {
    "10 to 20 business days or more": { fee: 0 },
    "2 to 9 business days": { fee: 0 },
    "By the end of the next business day (Emergencies only)": { fee: 335 }
  }

  const passportTypeOptions = {
    "5-year adult passport (age 16 or over)": { baseFee: 120 },
    "10-year adult passport (age 16 or over)": { baseFee: 160 }
  }

  const additionalOptions = {
    "Express pickup (within 2 to 9 business days)": { fee: 50 },
    "File transfer (to a different passport office in Canada)": { fee: 45 },
    "Replacing a lost or stolen passport": { fee: 45 }
  }

  // Handler functions
  const handleProcessingTimeChange = (value: string) => {
    setSelectedProcessingTime(value)
    setShowEmergencyDisclaimer(value === "By the end of the next business day (Emergencies only)")
  }

  const handlePassportTypeChange = (value: string) => {
    setSelectedPassportType(value)
  }

  const handleAdditionalOptionChange = (option: string, checked: boolean) => {
    setSelectedAdditionalOptions(prev => {
      if (checked) {
        return [...prev, option]
      } else {
        return prev.filter(item => item !== option)
      }
    })
  }

  // Calculate total fee
  const calculateTotalFee = () => {
    let total = 120
    
    if (selectedPassportType && passportTypeOptions[selectedPassportType]) {
      total += passportTypeOptions[selectedPassportType].baseFee
    }
    
    if (selectedProcessingTime && processingTimeOptions[selectedProcessingTime]) {
      total += processingTimeOptions[selectedProcessingTime].fee
    }
    
    selectedAdditionalOptions.forEach(option => {
      if (additionalOptions[option]) {
        total += additionalOptions[option].fee
      }
    })
    
    return total
  }

  const totalFee = calculateTotalFee()

  const toggleStep = (stepId: number) => {
    const currentScrollY = window.scrollY
    
    if (expandedStep === stepId) {
      setExpandedStep(null)
    } else {
      setExpandedStep(stepId)
      const newCompletedSteps = Array.from(new Set([...completedSteps, ...Array.from({length: stepId}, (_, i) => i + 1)]))
      setCompletedSteps(newCompletedSteps)
    }
    
    setTimeout(() => {
      window.scrollTo(0, currentScrollY)
    }, 0)
  }

  const steps = [
    {
      id: 1,
      title: "Gather Required Documents",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#26374a]">What you need to apply for a passport</h2>
          
          <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
            You need <strong>all</strong> of the following:
          </p>
    
          <ul className="text-sm sm:text-base leading-relaxed text-[#333333] list-disc pl-4 sm:pl-5 space-y-3 sm:space-y-4">
            <li>
              <a 
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/new-adult-passport/citizenship-proof.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label="Proof of Canadian citizenship - opens in new window"
              >
                proof of Canadian citizenship
              </a>
              <ul className="list-disc pl-4 sm:pl-5 mt-2 space-y-2">
                <li>This can be a birth certificate or citizenship certificate.
                  <ul className="list-disc pl-4 sm:pl-5 mt-1 space-y-1">
                    <li>If you have a <strong>paper</strong> certificate, it must be the original document, not a photocopy.</li>
                    <li>If you have a citizenship <strong>e-certificate</strong>, you must attach a{' '}
                      <a 
                        href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/proof-citizenship/valid.html#e-certificate-print" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label="Printed copy of e-certificate - opens in new window"
                      >
                        printed copy
                      </a>.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
    
            <li>
              a{' '}
              <a 
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/new-adult-passport/identity-documents.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label="Document to support your identity - opens in new window"
              >
                document to support your identity
              </a>
              <ul className="list-disc pl-4 sm:pl-5 mt-2">
                <li>This can be a photocopy <strong>or</strong> the original.
                  <ul className="list-disc pl-4 sm:pl-5 mt-1">
                    <li>If you want to use a photocopy of your ID, make sure you show both sides and have it signed <strong>and</strong> dated by your guarantor or signing official.</li>
                  </ul>
                </li>
              </ul>
            </li>
    
            <li>2 identical passport photos</li>
            <li>a guarantor</li>
            <li>2 references</li>
          </ul>
    
          <p className="text-[#333333] text-sm sm:text-base leading-relaxed mt-4 sm:mt-6">
            If you have a Canadian passport or other travel document and it's still valid, you also need to send us it.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "Download application form",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
            Download the adult passport application form
          </p>
          
          <a 
            href="https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/forms/pdf/pptc153.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#318000] text-white px-4 sm:px-6 py-2 sm:py-3 rounded font-medium hover:bg-[#266600] transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm sm:text-base"
            aria-label="Download passport application form PDF - opens in new window"
          >
            Download passport application (PPTC 153) (PDF, 1.7 MB)
          </a>
    
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3 sm:mb-4">Fill out the form on your computer to save time.</h4>
            <ul className="text-sm sm:text-base text-[#333333] list-disc pl-4 sm:pl-5 space-y-2">
              <li>Save the form on your computer and use Adobe Reader 10 or higher to open it.</li>
              <li><strong>Don't</strong> use your phone or tablet, or open it in your web browser. The form will <strong>not</strong> work properly.</li>
              <li>Read the instructions at the end of the form to make sure you've filled it out properly and completely.
                <ul className="list-disc pl-4 sm:pl-5 mt-1">
                  <li>Don't forget to tell us if you want a 5- or 10-year passport under section 6 of the form (<strong>Period of validity</strong>).</li>
                </ul>
              </li>
              <li>Include your email address to make it easier to check the status of your application online after you apply.</li>
            </ul>
          </div>
    
          {/* Accordion Sections with reduced spacing */}
          <div className="space-y-2">
            {/* Mental Incapacity */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">If you're applying for an adult with a mental incapacity</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <ul className="text-sm sm:text-base text-[#333333] list-disc pl-4 sm:pl-5 space-y-3">
                  <li>Complete the Declaration – Additional information to apply for travel document services for an adult who requires authorized third party assistance [PPTC 662] (PDF, 1.3 MB).
                    <ul className="list-disc pl-4 sm:pl-5 mt-1">
                      <li>Make sure all responsible parties have signed the declaration.</li>
                    </ul>
                  </li>
                  <li>Include 1 of the following:
                    <ul className="list-disc pl-4 sm:pl-5 mt-2 space-y-2">
                      <li>a power of attorney for the person <strong>with</strong> a doctor's note confirming their mental incapacity</li>
                      <li>a document that shows guardianship of the person you are authorized to apply for</li>
                      <li>a judicial court order <strong>or</strong> a notarized summary of the court order that can't be provided due to privacy reasons. The summary must show
                        <ul className="list-disc pl-4 sm:pl-5 mt-1 space-y-1">
                          <li>who has guardianship of the individual</li>
                          <li>whether mobility restrictions exist (provide all details and end dates, if applicable)</li>
                          <li>the issue date and court order number</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>If you're applying by mail, include a photocopy of both sides of your ID, and write the date the photocopy was made on it.</li>
                </ul>
              </div>
            </details>
    
            {/* Minor Mental Incapacity */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">If you're applying for someone with a mental incapacity who is between the age of 16 and the age of majority in your province or territory</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <ul className="text-sm sm:text-base text-[#333333] list-disc pl-4 sm:pl-5 space-y-3">
                  <li>Complete the declaration – additional information to apply for travel document services for an adult who requires authorized third party assistance [PPTC 662] (PDF, 1.3 MB)</li>
                  <li>Include:
                    <ul className="list-disc pl-4 sm:pl-5 mt-2 space-y-2">
                      <li>proof of a mental incapacity, such as a doctor's note</li>
                      <li>proof of parentage that confirms the relationship between you and the child</li>
                      <li><strong>if you're applying by mail,</strong> include a photocopy of both sides of your ID and write the date the photocopy was made on it</li>
                      <li><strong>in cases of separation or divorce,</strong> provide all documents about custody, decision-making responsibilities, access and parenting time or mobility of the child, including any divorce judgment or order
                        <ul className="list-disc pl-4 sm:pl-5 mt-1">
                          <li>Only the person with parental rights can apply for the passport. If parents have joint custody or joint decision-making responsibilities</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </details>
    
            {/* Valid Visa */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">If your passport has a valid visa in it</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <p className="text-sm sm:text-base text-[#333333]">
                  Tell us on your form if you need the visa and want your original passport back. If you don't, the visa could be damaged when the previous passport is cancelled.
                </p>
              </div>
            </details>
    
            {/* Large Print Forms */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Get large-print forms or braille instructions</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <ul className="text-sm sm:text-base text-[#333333] list-disc pl-4 sm:pl-5 space-y-3">
                  <li><strong>In Canada or the US</strong> Contact us online (opens in a new tab) or call 1-800-567-6868 (TTY: 1-866-255-7655).
                    <ul className="list-disc pl-4 sm:pl-5 mt-1">
                      <li>Tell us whether you need a large print form or braille instructions, and your mailing address. We'll mail you the forms.</li>
                    </ul>
                  </li>
                  <li><strong>Outside Canada and the US:</strong> contact the closest Canadian government office abroad.</li>
                </ul>
              </div>
            </details>
          </div>
    
          {/* Lost/Stolen/Damaged Section */}
          <h3 className="text-base sm:text-lg font-semibold text-[#26374a] mt-6 sm:mt-8">Lost, stolen or damaged passports may need an extra form</h3>
          
          <div className="space-y-2">
            {/* Lost or Stolen */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Your most recent passport was <strong>lost or stolen</strong></span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's still valid</h4>
                    <p className="text-sm sm:text-base text-[#333333] mb-3">
                      You need to contact us as soon as possible to report the theft or loss of your previous passport.
                    </p>
                    <p className="text-sm sm:text-base text-[#333333] mb-2">Since your passport is still valid, you <strong>must</strong></p>
                    <ol className="list-decimal pl-4 sm:pl-5 space-y-1">
                      <li>submit a declaration concerning a lost, stolen, inaccessible, damaged or found Canadian travel document [PPTC 203] (PDF, 1.3 MB) with your application</li>
                      <li>pay the extra <strong>$45</strong> fee for replacing a lost or stolen passport</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's expired</h4>
                    <p className="text-sm sm:text-base text-[#333333]">
                      You only need the main application form. Complete it and then submit it to us.
                    </p>
                  </div>
                </div>
              </div>
            </details>
    
            {/* Damaged Passport */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Your most recent passport was <strong>damaged</strong></span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's still valid</h4>
                    <p className="text-sm sm:text-base text-[#333333]">
                      You <strong>must</strong> submit a declaration concerning a lost, stolen, inaccessible, damaged or found Canadian travel document [PPTC 203] (PDF, 1.33 MB) with your application.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's expired</h4>
                    <p className="text-sm sm:text-base text-[#333333]">
                      You only need the main application form. Complete it and then submit it to us.
                    </p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Get Passport Photos",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
            <div className="flex-1 text-[#333333] text-sm sm:text-base leading-relaxed space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#26374a] mb-4">Photo specifications</h2>
              
              <h3 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3">Go to a commercial photographer or studio to have your photo taken.</h3>
              <p>Make sure your photo</p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-1">
                <li>is the right size</li>
                <li>has the quality we need</li>
                <li>captures a neutral facial expression</li>
                <li>reflects how you look now (taken no more than 6 months before you apply)</li>
              </ul>
    
              <h3 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3 mt-6">Size</h3>
              <p>Your photos must meet these specifications:</p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-2">
                <li>They must be 50 mm wide by 70 mm high (2 inches wide by 2¾ inches high).</li>
                <li>The height of your face must measure between 31 mm (1¼ inches) and 36 mm (1⁷⁄₁₆ inches) from your chin to the crown of your head (natural top of head).</li>
              </ul>
    
              <p className="mt-4">
                Read the{' '}
                <a 
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Full photo requirements - opens in new window"
                >
                  full photo requirements
                </a>
                {' '}for more information.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <img 
                src="https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/images/photo-passport-en.jpg"
                alt="Passport photo requirements illustration showing proper dimensions and positioning"
                className="w-full max-w-64 h-auto border border-gray-300 rounded mx-auto lg:mx-0"
              />
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 border border-gray-300 rounded">
            <p>
              On the back of 1 of your photos, the photographer must write or stamp
            </p>
            <ul className="list-disc pl-4 sm:pl-6 space-y-2 mt-2">
              <li>their studio or company name</li>
              <li>their complete address <strong>and</strong></li>
              <li>the date the photos were taken</li>
            </ul>
            <p className="mt-3">
              Your guarantor also needs to sign 1 of your photos.
            </p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs sm:text-sm">
                <strong>Note:</strong> If you're renewing an adult passport, you do <strong>not</strong> need a guarantor.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Find References",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
            You need 2 references for your application.
          </p>
          
          <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
            To avoid delays, make sure your references are available if or when we need to contact them. We may ask for additional references at any time.
          </p>
    
          <div className="space-y-2">
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Reference requirements</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <ReferenceRequirementsCard
                  title="Your references must"
                  items={[
                    "be 18 or older",
                    "have known you for at least 2 years",
                    "agree to you using their name and contact information for your application",
                    "be available if we need to contact them"
                  ]}
                />
                                
                <div className="mt-4">
                  <ReferenceRestrictionsCard 
                    title="Who cannot be your reference"
                    items={[
                      "your guarantor",
                      "a member of your immediate family",
                      "your spouse or common-law partner",
                      "your child or grandchild",
                      "other members of your extended family",
                      "spouse or common-law partner",
                      "parent, step-parent, foster parent, or a parents spouse or common-law partner",
                      "mother-in-law or father-in-law",
                      "child (biological, adopted, foster or stepchild) or your child's spouse or common-law partner",
                      "son-in-law or daughter-in-law",
                      "sibling (brother, half-brother or stepbrother, or sister, half-sister or stepsister) or your sibling's spouse or common-law partner",
                      "brother-in-law or sister-in-law",
                      "grandparent (biological, adopted, step or foster grandparent) or your grandparent's spouse or common-law partner",
                      "grandmother-in-law or grandfather-in-law",
                      "grandchild (biological, adopted, step or foster grandchild) or your grandchild's spouse or common-law partner",
                      "grandson-in-law or granddaughter-in-law",
                      "anyone else who's related to you or your spouse or common-law partner by blood, marriage, common-law partnership, adoption or guardianship and lives at the same address as you",
                    ]}
                  />
                </div>
              </div>
            </details>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Find a Guarantor",
      content: (
        <div className="space-y-4 sm:space-y-6">
         <h3 className="text-base sm:text-lg font-semibold text-[#26374a] mt-4 sm:mt-6">Your guarantor must sign:</h3>
      
          <ul className="text-sm sm:text-base leading-relaxed text-black list-disc pl-4 sm:pl-5 mb-4">
            <li>your application form (4 specific fields: signature, location signed, date, and years known)</li>
            <li>the back of 1 passport photo with "I certify this to be a true likeness of [your name]"</li>
            <li><strong>all</strong> photocopies of your supporting identity documents (for adult applications only)</li>
          </ul>
    
          <ul className="text-[#333333] text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <li className="p-1">You don't need a guarantor if you're renewing a passport.</li>
           <li className="p-1">Your guarantor can't charge you money for this service, and you can't help them complete these tasks.</li> 
          </ul>
    
          <div className="space-y-2">
            <details className="border border-gray-300 rounded group">
              <summary className="p-2 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Regular passport submitted in Canada</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <ReferenceRequirementsCard
                  title="Your guarantor must"
                  items={[
                    "have known you for at least 2 years",
                    "be available if we need to contact them",
                    "be a Canadian citizen 18 years of age or older",
                    "provide the information needed from their passport",
                    "have been 16 years of age or older when they applied for their own passport",
                    "hold a 5-year or 10-year Canadian passport that, on the day you submit your application, is:",
                    "  • expired for no more than 1 year, **or**",
                    "  • valid, meaning it isn't or wasn't:",
                    "    ◦ expired",
                    "    ◦ damaged", 
                    "    ◦ inaccessible",
                    "    ◦ suspended or revoked",
                    "    ◦ reported lost or stolen",
                    "    ◦ found and returned",
                    "    ◦ destroyed by us",
                    "    ◦ requested to be returned"
                  ]}
                />
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs sm:text-sm text-[#333333]">
                    <strong>For child applications:</strong> If you're the parent/guardian applying for your child, you cannot be the guarantor. The other parent/guardian can serve as guarantor if they meet the requirements. For adopted children in probationary adoption, the provincial director of family services can serve as guarantor.
                  </p>
                </div>
              </div>
            </details>
    
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Regular passport submitted outside Canada</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-4">
                  Your guarantor can be anyone who meets the basic requirements for a regular passport in Canada, OR an occupation-based guarantor.
                </p>
                
                <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mb-3">Occupation-based guarantors</h4>
                <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-3">
                  Must be registered/licensed with appropriate local authority and currently working in one of these professions:
                </p>
                <ul className="text-sm sm:text-base leading-relaxed text-black list-disc pl-4 sm:pl-5 mb-4">
                  <li>judge</li>
                  <li>dentist</li>
                  <li>pharmacist</li>
                  <li>veterinarian</li>
                  <li>police officer</li>
                  <li>notary public</li>
                  <li>lawyer/notary</li>
                  <li>medical doctor</li>
                  <li>dean/head of university or college</li>
                  <li>signing officer of a bank, trust company, or financial institution offering full banking services</li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-600">
                  Retired professionals can be used if their professional association still lists them.
                </p>
              </div>
            </details>
    
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Military personnel passport</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-4">
                  Regular Military Force officers may act as guarantor for Regular Force personnel and dependants if they have known you personally for 2+ years:
                </p>
                <ul className="text-sm sm:text-base leading-relaxed text-black list-disc pl-4 sm:pl-5 mb-4">
                  <li>NDHQ directors</li>
                  <li>base commanders</li>
                  <li>commanding officers</li>
                  <li>NDHQ career managers</li>
                  <li>NDHQ directors general</li>
                  <li>personnel administrative officers</li>
                  <li>any commissioned officer (captain and above) with access to service records</li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  Instead of indicating years known, they must write "through service records which I have verified."
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Military police can only act as guarantors for military personnel and must have personally known you for at least 2 years.
                </p>
              </div>
            </details>
    
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]">Certificate of identity or refugee travel document</span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <ReferenceRequirementsCard
                  title="Your guarantor must"
                  items={[
                    "live in Canada",
                    "be a permanent resident of Canada or Canadian citizen",
                    "be available to verify your application",
                    "have personally known you for at least 6 months",
                    "be registered/licensed with appropriate local authority",
                    "currently work in their professional field"
                  ]}
                />
                
                <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mt-4 mb-3">Required professions:</h4>
                <ul className="text-sm sm:text-base leading-relaxed text-black list-disc pl-4 sm:pl-5 mb-4">
                  <li>mayor</li>
                  <li>pharmacist</li>
                  <li>postmaster</li>
                  <li>optometrist</li>
                  <li>veterinarian</li>
                  <li>notary public</li>
                  <li>nurse practitioner</li>
                  <li>dentist, medical doctor or chiropractor</li>
                  <li>principal of a primary or secondary school</li>
                  <li>senior administrator or teacher in a university</li>
                  <li>professional engineer (P. Eng. or Ing. in Quebec)</li>
                  <li>senior administrator in a community college (CEGEP in Quebec)</li>
                  <li>judge, magistrate or police officer (municipal, provincial or RCMP)</li>
                  <li>professional accountant (APA, CA, CGA, CMA, PA or RPA member)</li>
                  <li>lawyer (provincial bar association member), or notary in Quebec</li>
                  <li>minister of religion</li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-600">
                  Retired professionals can be used only if their name still appears on the relevant association listing.
                </p>
              </div>
            </details>
          </div>
    
          <div className="space-y-2 mt-4 sm:mt-6">
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]"><strong>If you can't find a guarantor</strong></span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-4">
                  You need to contact us to get a Statutory Declaration in Lieu of Guarantor form. There are 2 versions available:
                </p>
                <ul className="text-sm sm:text-base leading-relaxed text-black list-disc pl-4 sm:pl-5 mb-4">
                  <li>For passport applications</li>
                  <li>For refugee travel document or certificate of identity applications</li>
                </ul>
                
                <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-4">
                  <strong>Important:</strong> These forms are not available online.
                </p>
    
                <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-4">
                  You must find someone who can administer an oath to swear to and sign the form. This person doesn't need to know you personally.
                </p>
    
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mb-3">If you're in Canada</h4>
                    <ul className="text-xs sm:text-sm text-black list-disc pl-4 sm:pl-5">
                      <li>notary public</li>
                      <li>justice of the peace</li>
                      <li>commissioner for oaths</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mb-3">If you're outside Canada</h4>
                    <ul className="text-xs sm:text-sm text-black list-disc pl-4 sm:pl-5">
                      <li>Canadian or British diplomatic or consular representative</li>
                      <li>qualified local official (civil servant, member of Parliament)</li>
                    </ul>
                  </div>
                </div>
                
                <details className="border border-gray-300 rounded group">
                  <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-medium text-[#26374a]">Contact Information</span>
                      <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <div className="p-3 sm:p-4 border-t border-gray-300">
                    <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                      Our agents answer calls Monday to Friday, from 8:30 a.m. to 5:00 p.m. your local time (9:00 a.m. to 5:30 p.m. in Newfoundland and Labrador). They do not answer calls on statutory holidays.
                    </p>
    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3">Call us</h4>
                        <p className="text-[#333333] text-xs sm:text-sm mb-3">
                          Reach us at either of the numbers below.
                        </p>
                        <div className="space-y-2">
                          <p className="text-[#333333] text-xs sm:text-sm">
                            Toll-free number: <strong>1-800-567-6868</strong>
                          </p>
                          <p className="text-[#333333] text-xs sm:text-sm">
                            Direct number: <strong>1-819-997-8338</strong>
                          </p>
                        </div>
                      </div>
    
                      <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded">
                        <h4 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3">Use our TTY service</h4>
                        <p className="text-[#333333] text-xs sm:text-sm mb-3">
                          If you're hearing impaired or have a speech impediment, use our TTY service.
                        </p>
                        <p className="text-[#333333] text-xs sm:text-sm">
                          <strong>1-866-255-7655</strong>
                        </p>
                      </div>
    
                      <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded sm:col-span-2 lg:col-span-1">
                        <h4 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3">Go to a passport office</h4>
                        <p className="text-[#333333] text-xs sm:text-sm mb-3">
                          Use walk-in service at a passport office to request the status of your application.
                        </p>
                        <a 
                          href="#" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                          aria-label="Find a passport office - opens in new window"
                        >
                          Find a passport office and check walk-in wait times
                        </a>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </details>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Find out how to submit your application",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#26374a]">Submit your application</h2>
          
          <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
            You may need to provide proof that you need the passport.
          </p>
    
          <div className="w-full">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs" role="tablist">
                <button
                  className="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm sm:text-base border-[#26374a] text-[#26374a]"
                  aria-selected="true"
                  role="tab"
                >
                  In person
                </button>
                <button
                  className="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm sm:text-base border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  aria-selected="false"
                  role="tab"
                >
                  By mail
                </button>
              </nav>
            </div>
    
            <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6" role="tabpanel">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3">By appointment</h3>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-3">
                    You can{' '}
                    <a 
                      href="https://eservices.canada.ca/en/reservation/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label="Book an appointment online - opens in new window"
                    >
                      book an appointment online
                    </a>.
                  </p>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    Some locations have a high demand for appointments. Their availability may vary.
                  </p>
                </div>
    
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#26374a] mb-3">Without an appointment (walk-in)</h3>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-3">
                    Go to a{' '}
                    <a 
                      href="https://ircc.canada.ca/english/passport/map/map.asp?service=express#table1caption" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label="Passport office with express pick-up service - opens in new window"
                    >
                      passport office with <strong>express</strong> pick-up service
                    </a>.
                  </p>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    If the location is busy, we may prioritize people who need a passport within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: `Calculate your fees`,
      subtitle: `Estimated fee: $${totalFee}`,
      content: (
        <div className="space-y-4 sm:space-y-6">
          {/* Processing Time Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#26374a]">When do you need the passport? <span className="text-red-600">(required)</span></h3>
            <div 
              className="space-y-3"
              role="radiogroup"
              aria-label="Processing time options"
            >
              {Object.entries(processingTimeOptions).map(([option, details]) => (
                <div key={option} className="flex items-center justify-between p-3 sm:p-4 border border-gray-300 bg-white">
                  <RadioOption
                    id={`processing-${option.replace(/\s/g, "-").toLowerCase()}`}
                    name="processing-time"
                    value={option}
                    label={option}
                    checked={selectedProcessingTime === option}
                    onChange={handleProcessingTimeChange}
                  />
                  <div className="text-sm sm:text-base font-semibold text-[#666666]">
                    {details.fee > 0 ? `+${details.fee}` : "No additional fee"}
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Disclaimer Dropdown */}
            {showEmergencyDisclaimer && (
              <div className="mt-4 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg" role="alert" aria-live="polite">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-orange-800 mb-2">Emergency Processing Requirements</h4>
                    <p className="text-xs sm:text-sm text-orange-700">
                      <strong>Only for emergencies</strong> and <strong>if you have to travel over that specific weekend or statutory holiday</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Passport Type Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#26374a]">What is your preferred passport type? <span className="text-red-600">(required)</span></h3>
            <div 
              className="space-y-3"
              role="radiogroup"
              aria-label="Passport type options"
            >
              {Object.entries(passportTypeOptions).map(([option, details]) => (
                <div key={option} className="flex items-center justify-between p-3 sm:p-4 border border-gray-300 bg-white">
                  <RadioOption
                    id={`passport-${option.replace(/\s/g, "-").toLowerCase()}`}
                    name="passport-type"
                    value={option}
                    label={`${option} - ${details.baseFee}`}
                    checked={selectedPassportType === option}
                    onChange={handlePassportTypeChange}
                  />
                  <div className="text-sm sm:text-base font-semibold text-[#af3c43]">
                    ${details.baseFee}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#26374a]">Additional options:</h3>
            <div className="space-y-3" role="group" aria-label="Additional options">
              {Object.entries(additionalOptions).map(([option, details]) => (
                <div key={option} className="flex items-center justify-between p-3 sm:p-4 border border-gray-300 bg-white">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`additional-${option.replace(/\s/g, "-").toLowerCase()}`}
                      checked={selectedAdditionalOptions.includes(option)}
                      onChange={(e) => handleAdditionalOptionChange(option, e.target.checked)}
                      className="h-4 w-4 text-[#af3c43] border-gray-300 rounded focus:ring-[#af3c43] focus:ring-2"
                      aria-describedby={`additional-${option.replace(/\s/g, "-").toLowerCase()}-price`}
                    />
                    <label 
                      htmlFor={`additional-${option.replace(/\s/g, "-").toLowerCase()}`}
                      className="text-sm sm:text-base text-[#333333] cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                  <div 
                    className="text-sm sm:text-base font-semibold text-[#666666]"
                    id={`additional-${option.replace(/\s/g, "-").toLowerCase()}-price`}
                  >
                    +${details.fee}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Calculation Summary */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-[#f5f5f5] border border-gray-300" aria-live="polite" aria-atomic="true">
            <h4 className="text-base sm:text-lg font-bold text-[#26374a] mb-4">Fee Calculation</h4>
            <div className="space-y-2">
              {selectedPassportType && (
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-[#333333]">{selectedPassportType}:</span>
                  <span className="font-semibold text-sm sm:text-base">
                    ${passportTypeOptions[selectedPassportType]?.baseFee || 0}
                  </span>
                </div>
              )}
              
              {selectedProcessingTime && processingTimeOptions[selectedProcessingTime]?.fee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-[#333333]">{selectedProcessingTime}:</span>
                  <span className="font-semibold text-sm sm:text-base">
                    +${processingTimeOptions[selectedProcessingTime].fee}
                  </span>
                </div>
              )}

              {selectedAdditionalOptions.map((option) => (
                <div key={option} className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-[#333333]">{option}:</span>
                  <span className="font-semibold text-sm sm:text-base">
                    +${additionalOptions[option]?.fee || 0}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-[#af3c43] mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base sm:text-lg text-[#26374a]">Total Fee:</span>
                <span className="font-bold text-lg sm:text-xl text-[#af3c43]">${totalFee}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Disclaimer */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-base sm:text-lg font-bold text-[#26374a] mb-4">Payment Information</h4>
            <p className="text-sm sm:text-base text-[#333333] mb-3">
              Fees must be paid in person through:
            </p>
            <ul className="text-sm sm:text-base text-[#333333] list-disc pl-4 sm:pl-5 space-y-1 mb-4">
              <li>Credit card or prepaid card (Visa®, MasterCard® or American Express®)</li>
              <li>Debit card</li>
              <li>Certified cheque or money order (postal or bank)
                <ul className="list-disc pl-4 sm:pl-5 mt-1 space-y-1">
                  <li>In Canadian funds</li>
                  <li>With the exact amount</li>
                </ul>
              </li>
              <li>Cheque from Canadian provincial, territorial or federal government departments
                <ul className="list-disc pl-4 sm:pl-5 mt-1">
                  <li>For example, the Ministry of Social Services</li>
                </ul>
              </li>
            </ul>
            <p className="text-sm sm:text-base font-semibold text-red-700">
              **We don't accept cash or personal cheques.**
            </p>
          </div>

          {/* No Refunds Disclaimer */}
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-base sm:text-lg font-bold text-[#26374a] mb-4">No Refunds Policy</h4>
            <p className="text-sm sm:text-base text-[#333333] mb-3">
              No refunds if you:
            </p>
            <ul className="text-sm sm:text-base text-[#333333] list-disc pl-4 sm:pl-5 space-y-1">
              <li>Cancel your application</li>
              <li>Are refused a travel document</li>
              <li>Are issued a passport for a shorter validity period than requested
                <ul className="list-disc pl-4 sm:pl-5 mt-1 space-y-1">
                  <li>For example, if we issue a passport that's valid for less than 5 years, despite you applying for a 5- or 10-year passport, you won't get a refund.</li>
                  <li>This may happen if you've lost or damaged your passport multiple times.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Getting your passport",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            {/* Applied by Mail */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]"><strong>You applied by mail</strong></span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    When your passport is ready, we'll mail it to you. Mail time is usually 5 business days, but it can vary across the country.
                  </p>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    Any original documents you submitted will be mailed back to you. <strong>They may be in a separate package from your passport.</strong>
                  </p>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    While you're waiting for your passport, you can{' '}
                    <a 
                      href="https://etatpasseport-passportstatus.service.canada.ca/en/expectations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label="Check the status of your application online - opens in new window"
                    >
                      check the status of your application online
                    </a>
                    {' '}for instant updates.
                  </p>
                </div>
              </div>
            </details>
    
            {/* Applied in Person */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]"><strong>You applied in person</strong></span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    When your passport is ready, we'll mail it to you <strong>unless</strong> you paid for pickup service. Mail time is usually 5 business days, but it can vary across the country.
                  </p>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    While you're waiting for your passport, you can{' '}
                    <a 
                      href="https://etatpasseport-passportstatus.service.canada.ca/en/expectations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label="Check the status of your application online - opens in new window"
                    >
                      check the status of your application online
                    </a>
                    {' '}for instant updates.
                  </p>
                  
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-sm sm:text-base font-semibold text-[#26374a] mb-3">If you paid for a pick-up service</h4>
                    <p className="text-[#333333] text-sm sm:text-base leading-relaxed mb-3">
                      The pickup date will be indicated on your receipt.
                    </p>
                    <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                      You can send someone else to pick up your passport if they have
                    </p>
                    <ul className="text-sm sm:text-base leading-relaxed text-[#333333] list-disc pl-4 sm:pl-5 mt-2">
                      <li>valid identification <strong>and</strong></li>
                      <li>something in writing from you saying they're allowed to</li>
                    </ul>
                  </div>
                </div>
              </div>
            </details>
    
            {/* Moving Before Receiving Passport */}
            <details className="border border-gray-300 rounded group">
              <summary className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer list-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-[#26374a]"><strong>If you're moving, but don't have your passport yet</strong></span>
                  <span className="transform group-open:rotate-180 transition-transform" aria-hidden="true">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </summary>
              <div className="p-3 sm:p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed">
                    Contact us to update your mailing address if you
                  </p>
                  <ul className="text-sm sm:text-base leading-relaxed text-[#333333] list-disc pl-4 sm:pl-5">
                    <li>haven't received your passport <strong>and</strong></li>
                    <li>are moving within 30 days of submitting your application</li>
                  </ul>
                  <p className="text-[#333333] text-sm sm:text-base leading-relaxed mt-4">
                    If you have a community mailbox, make sure you check it before you contact us about your application.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section 
      className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8" 
      aria-label="Passport Application Steps"
      ref={containerRef}
    >
      <div className="border-b-4 border-[#af3c43] pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#26374a] mb-2">Passport Application Process Guide</h1>
        <p className="text-sm sm:text-base text-[#666666]">Learn about the steps for how to apply for your first adult passport</p>
      </div>

      <div className="">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connecting line - Dynamic height based on expanded state */}
            {index < steps.length - 1 && (
              <div
                className="absolute left-3 sm:left-4 w-0.5 bg-gray-400 z-0"
                style={{
                  top: "2.5rem",
                  height: expandedStep === step.id ? "calc(100% - 2.5rem + 2rem)" : "3rem",
                }}
                aria-hidden="true"
              />
            )}

            <div className="flex relative z-10" ref={(el) => (stepRefs.current[index] = el)}>
              {/* Step indicator */}
              <div className="flex flex-col items-center mr-4 sm:mr-6 relative z-10">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors duration-200 focus:ring-2 focus:ring-[#3b99fc] focus:ring-offset-2 ${
                    expandedStep === step.id || completedSteps.includes(step.id)
                      ? "bg-[#26374a] text-white border-[#26374a]"
                      : "bg-white text-[#26374a] border-[#26374a] hover:bg-[#f5f5f5]"
                  }`}
                  aria-expanded={expandedStep === step.id}
                  aria-controls={`step-${step.id}-content`}
                  id={`step-${step.id}-header`}
                  aria-label={`Step ${step.id}: ${step.title}`}
                >
                  {step.id}
                </button>
              </div>

              {/* Step content */}
              <div className="flex-1 pb-6 sm:pb-8">
                <div className="border-2 border-gray-300 rounded">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-[#f5f5f5] transition-colors duration-200 focus:ring-2 focus:ring-[#3b99fc] focus:ring-inset"
                    aria-expanded={expandedStep === step.id}
                    aria-controls={`step-${step.id}-content`}
                    aria-labelledby={`step-${step.id}-header`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-[#26374a] pr-4">{step.title}</h3>
                        {step.subtitle && (
                          <p className="text-sm sm:text-base font-semibold text-[#af3c43] mt-1">{step.subtitle}</p>
                        )}
                      </div>
                      <div
                        className={`transform transition-transform duration-200 flex-shrink-0 ${
                          expandedStep === step.id ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {expandedStep === step.id && (
                    <div
                      id={`step-${step.id}-content`}
                      role="region"
                      aria-labelledby={`step-${step.id}-header`}
                      className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-300 bg-white"
                    >
                      <div className="pt-4 sm:pt-6">{step.content}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}