"use client"

import { useState, useRef, useEffect } from "react" // Import useEffect
import { Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioOption } from "@/components/radio-option" // Import RadioOption
import { ReferenceRestrictionsCard } from "@/components/ReferenceRestrictionsCard"
import { ReferenceRequirementsCard } from "@/components/ReferenceRequirementsCard"
import { PlainInfoCard } from "@/components/PlainInfoCard"
import { RadioGroup } from "@/components/ui/radio-group" // Import RadioGroup

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

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedExpandedStep = localStorage.getItem('passport-expanded-step')
    const savedCompletedSteps = localStorage.getItem('passport-completed-steps')
    
    if (savedExpandedStep) {
      setExpandedStep(parseInt(savedExpandedStep))
    }
    
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps))
    }
  }, [])
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (expandedStep !== null) {
      localStorage.setItem('passport-expanded-step', expandedStep.toString())
    } else {
      localStorage.removeItem('passport-expanded-step')
    }
  }, [expandedStep])
  
  useEffect(() => {
    localStorage.setItem('passport-completed-steps', JSON.stringify(completedSteps))
  }, [completedSteps])

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
    // Show emergency disclaimer if urgent option is selected
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
    let total = 0
    
    // Base passport fee
    if (selectedPassportType && passportTypeOptions[selectedPassportType]) {
      total += passportTypeOptions[selectedPassportType].baseFee
    }
    
    // Processing time fee (if applicable)
    if (selectedProcessingTime && processingTimeOptions[selectedProcessingTime]) {
      total += processingTimeOptions[selectedProcessingTime].fee
    }
    
    // Additional options fees
    selectedAdditionalOptions.forEach(option => {
      if (additionalOptions[option]) {
        total += additionalOptions[option].fee
      }
    })
    
    return total
  }

  const totalFee = calculateTotalFee()

  const toggleStep = (stepId: number) => {
    if (expandedStep === stepId) {
      setExpandedStep(null)
    } else {
      setExpandedStep(stepId)
      // Mark this step and all previous steps as completed
      const newCompletedSteps = Array.from(new Set([...completedSteps, ...Array.from({length: stepId}, (_, i) => i + 1)]))
      setCompletedSteps(newCompletedSteps)
    }
  }

  const steps = [
    {
      id: 1,
      title: `Determine your needs`,
      subtitle: `Total Fee: $${totalFee}`,
      content: (
        <div className="space-y-6">
          {/* Processing Time Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#26374a]">When do you need the passport? (required)</h3>
            <RadioGroup
              onValueChange={handleProcessingTimeChange}
              value={selectedProcessingTime || ""}
              className="space-y-3"
              aria-label="Processing time options"
            >
              {Object.entries(processingTimeOptions).map(([option, details]) => (
                <div key={option} className="flex items-center justify-between p-4 border border-gray-300 bg-white">
                  <RadioOption
                    id={`processing-${option.replace(/\s/g, "-").toLowerCase()}`}
                    name="processing-time"
                    value={option}
                    label={option}
                    checked={selectedProcessingTime === option}
                    onChange={handleProcessingTimeChange}
                  />
                  <div className="text-base font-semibold text-[#666666]">
                    {details.fee > 0 ? `+${details.fee}` : "No additional fee"}
                  </div>
                </div>
              ))}
            </RadioGroup>

            {/* Emergency Disclaimer Dropdown */}
            {showEmergencyDisclaimer && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-orange-800 mb-2">Emergency Processing Requirements</h4>
                    <p className="text-sm text-orange-700">
                      <strong>Only for emergencies</strong> and <strong>if you have to travel over that specific weekend or statutory holiday</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Passport Type Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#26374a]">What is your preferred passport type? (required)</h3>
            <RadioGroup
              onValueChange={handlePassportTypeChange}
              value={selectedPassportType || ""}
              className="space-y-3"
              aria-label="Passport type options"
            >
              {Object.entries(passportTypeOptions).map(([option, details]) => (
                <div key={option} className="flex items-center justify-between p-4 border border-gray-300 bg-white">
                  <RadioOption
                    id={`passport-${option.replace(/\s/g, "-").toLowerCase()}`}
                    name="passport-type"
                    value={option}
                    label={`${option} - $${details.baseFee}`}
                    checked={selectedPassportType === option}
                    onChange={handlePassportTypeChange}
                  />
                  <div className="text-base font-semibold text-[#af3c43]">
                    ${details.baseFee}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Options Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#26374a]">Additional options:</h3>
            <div className="space-y-3">
              {Object.entries(additionalOptions).map(([option, details]) => (
                <div key={option} className="flex items-center justify-between p-4 border border-gray-300 bg-white">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`additional-${option.replace(/\s/g, "-").toLowerCase()}`}
                      checked={selectedAdditionalOptions.includes(option)}
                      onChange={(e) => handleAdditionalOptionChange(option, e.target.checked)}
                      className="h-4 w-4 text-[#af3c43] border-gray-300 rounded focus:ring-[#af3c43]"
                    />
                    <label 
                      htmlFor={`additional-${option.replace(/\s/g, "-").toLowerCase()}`}
                      className="text-base text-[#333333] cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                  <div className="text-base font-semibold text-[#666666]">
                    +${details.fee}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Calculation Summary */}
          <div className="mt-8 p-6 bg-[#f5f5f5] border border-gray-300" aria-live="polite" aria-atomic="true">
            <h4 className="text-lg font-bold text-[#26374a] mb-4">Fee Calculation</h4>
            <div className="space-y-2">
              {selectedPassportType && (
                <div className="flex justify-between items-center">
                  <span className="text-base text-[#333333]">{selectedPassportType}:</span>
                  <span className="font-semibold text-base">
                    ${passportTypeOptions[selectedPassportType]?.baseFee || 0}
                  </span>
                </div>
              )}
              
              {selectedProcessingTime && processingTimeOptions[selectedProcessingTime]?.fee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-base text-[#333333]">{selectedProcessingTime}:</span>
                  <span className="font-semibold text-base">
                    +$${processingTimeOptions[selectedProcessingTime].fee}
                  </span>
                </div>
              )}

              {selectedAdditionalOptions.map((option) => (
                <div key={option} className="flex justify-between items-center">
                  <span className="text-base text-[#333333]">{option}:</span>
                  <span className="font-semibold text-base">
                    +$${additionalOptions[option]?.fee || 0}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-[#af3c43] mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-[#26374a]">Total Fee:</span>
                <span className="font-bold text-xl text-[#af3c43]">${totalFee}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Disclaimer */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-lg font-bold text-[#26374a] mb-4">Payment Information</h4>
            <p className="text-base text-[#333333] mb-3">
              Fees must be paid in person through:
            </p>
            <ul className="text-base text-[#333333] list-disc pl-5 space-y-1 mb-4">
              <li>Credit card or prepaid card (Visa®, MasterCard® or American Express®)</li>
              <li>Debit card</li>
              <li>Certified cheque or money order (postal or bank)
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>In Canadian funds</li>
                  <li>With the exact amount</li>
                </ul>
              </li>
              <li>Cheque from Canadian provincial, territorial or federal government departments
                <ul className="list-disc pl-5 mt-1">
                  <li>For example, the Ministry of Social Services</li>
                </ul>
              </li>
            </ul>
            <p className="text-base font-semibold text-red-700">
              **We don't accept cash or personal cheques.**
            </p>
          </div>

          {/* No Refunds Disclaimer */}
          <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-lg font-bold text-[#26374a] mb-4">No Refunds Policy</h4>
            <p className="text-base text-[#333333] mb-3">
              No refunds if you:
            </p>
            <ul className="text-base text-[#333333] list-disc pl-5 space-y-1">
              <li>Cancel your application</li>
              <li>Are refused a travel document</li>
              <li>Are issued a passport for a shorter validity period than requested
                <ul className="list-disc pl-5 mt-1 space-y-1">
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
      id: 2,
      title: "Get Passport Photos",
      content: (
        <div className="space-y-6">
          <div className="flex gap-8 items-start">
            <div className="flex-1 text-[#333333] text-base leading-relaxed space-y-4">
              <h2 className="text-xl font-bold text-[#26374a] mb-4">Photo specifications</h2>
              
              <h3 className="text-lg font-semibold text-[#26374a] mb-3">Go to a commercial photographer or studio to have your photo taken.</h3>
              <p>Make sure your photo</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>is the right size</li>
                <li>has the quality we need</li>
                <li>captures a neutral facial expression</li>
                <li>reflects how you look now (taken no more than 6 months before you apply)</li>
              </ul>
    
              <h3 className="text-lg font-semibold text-[#26374a] mb-3 mt-6">Size</h3>
              <p>Your photos must meet these specifications:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>They must be 50 mm wide by 70 mm high (2 inches wide by 2¾ inches high).</li>
                <li>The height of your face must measure between 31 mm (1¼ inches) and 36 mm (1⁷⁄₁₆ inches) from your chin to the crown of your head (natural top of head).</li>
              </ul>
    
              <p className="mt-4">
                Read the{' '}
                <a 
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  full photo requirements
                </a>
                {' '}for more information.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/images/photo-passport-en.jpg"
                alt="Passport photo requirements illustration"
                className="w-64 h-auto border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded">
            <p>
              On the back of 1 of your photos, the photographer must write or stamp
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>their studio or company name</li>
              <li>their complete address <strong>and</strong></li>
              <li>the date the photos were taken</li>
            </ul>
            <p className="mt-3">
              Your guarantor also needs to sign 1 of your photos.
            </p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm">
                <strong>Note:</strong> If you're renewing an adult passport, you do <strong>not</strong> need a guarantor.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Download application form",
      content: (
        <div className="space-y-6">
          <p className="text-[#333333] text-base leading-relaxed">
            Download the adult passport application form
          </p>
          
          <a 
            href="https://www.canada.ca/content/dam/ircc/migration/ircc/english/passport/forms/pdf/pptc153.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#318000] text-white px-6 py-3 rounded font-medium hover:bg-[#266600] transition-colors"
          >
            Download passport application (PPTC 153) (PDF, 1.7 MB)
          </a>
    
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-[#26374a] mb-4">Fill out the form on your computer to save time.</h4>
            <ul className="text-base text-[#333333] list-disc pl-5 space-y-2">
              <li>Save the form on your computer and use Adobe Reader 10 or higher to open it.</li>
              <li><strong>Don't</strong> use your phone or tablet, or open it in your web browser. The form will <strong>not</strong> work properly.</li>
              <li>Read the instructions at the end of the form to make sure you've filled it out properly and completely.
                <ul className="list-disc pl-5 mt-1">
                  <li>Don't forget to tell us if you want a 5- or 10-year passport under section 6 of the form (<strong>Period of validity</strong>).</li>
                </ul>
              </li>
              <li>Include your email address to make it easier to check the status of your application online after you apply.</li>
            </ul>
          </div>
    
          {/* Accordion Sections */}
          <Accordion type="multiple" className="space-y-4">
            {/* Mental Incapacity */}
            <AccordionItem value="mentalIncapacity" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]">If you're applying for an adult with a mental incapacity</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <ul className="text-base text-[#333333] list-disc pl-5 space-y-3">
                  <li>Complete the Declaration – Additional information to apply for travel document services for an adult who requires authorized third party assistance [PPTC 662] (PDF, 1.3 MB).
                    <ul className="list-disc pl-5 mt-1">
                      <li>Make sure all responsible parties have signed the declaration.</li>
                    </ul>
                  </li>
                  <li>Include 1 of the following:
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>a power of attorney for the person <strong>with</strong> a doctor's note confirming their mental incapacity</li>
                      <li>a document that shows guardianship of the person you are authorized to apply for</li>
                      <li>a judicial court order <strong>or</strong> a notarized summary of the court order that can't be provided due to privacy reasons. The summary must show
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>who has guardianship of the individual</li>
                          <li>whether mobility restrictions exist (provide all details and end dates, if applicable)</li>
                          <li>the issue date and court order number</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>If you're applying by mail, include a photocopy of both sides of your ID, and write the date the photocopy was made on it.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
    
            {/* Minor Mental Incapacity */}
            <AccordionItem value="minorMentalIncapacity" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]">If you're applying for someone with a mental incapacity who is between the age of 16 and the age of majority in your province or territory</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <ul className="text-base text-[#333333] list-disc pl-5 space-y-3">
                  <li>Complete the declaration – additional information to apply for travel document services for an adult who requires authorized third party assistance [PPTC 662] (PDF, 1.3 MB)</li>
                  <li>Include:
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>proof of a mental incapacity, such as a doctor's note</li>
                      <li>proof of parentage that confirms the relationship between you and the child</li>
                      <li><strong>if you're applying by mail,</strong> include a photocopy of both sides of your ID and write the date the photocopy was made on it</li>
                      <li><strong>in cases of separation or divorce,</strong> provide all documents about custody, decision-making responsibilities, access and parenting time or mobility of the child, including any divorce judgment or order
                        <ul className="list-disc pl-5 mt-1">
                          <li>Only the person with parental rights can apply for the passport. If parents have joint custody or joint decision-making responsibilities</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
    
            {/* Valid Visa */}
            <AccordionItem value="validVisa" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]">If your passport has a valid visa in it</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <p className="text-base text-[#333333]">
                  Tell us on your form if you need the visa and want your original passport back. If you don't, the visa could be damaged when the previous passport is cancelled.
                </p>
              </AccordionContent>
            </AccordionItem>
    
            {/* Large Print Forms */}
            <AccordionItem value="largePrint" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]">Get large-print forms or braille instructions</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <ul className="text-base text-[#333333] list-disc pl-5 space-y-3">
                  <li><strong>In Canada or the US</strong> Contact us online (opens in a new tab) or call 1-800-567-6868 (TTY: 1-866-255-7655).
                    <ul className="list-disc pl-5 mt-1">
                      <li>Tell us whether you need a large print form or braille instructions, and your mailing address. We'll mail you the forms.</li>
                    </ul>
                  </li>
                  <li><strong>Outside Canada and the US:</strong> contact the closest Canadian government office abroad.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
    
          {/* Lost/Stolen/Damaged Section */}
          <h3 className="text-lg font-semibold text-[#26374a] mt-8">Lost, stolen or damaged passports may need an extra form</h3>
          
          <Accordion type="multiple" className="space-y-4">
            {/* Lost or Stolen */}
            <AccordionItem value="lostStolen" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]">Your most recent passport was <strong>lost or stolen</strong></span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's still valid</h4>
                    <p className="text-base text-[#333333] mb-3">
                      You need to contact us as soon as possible to report the theft or loss of your previous passport.
                    </p>
                    <p className="text-base text-[#333333] mb-2">Since your passport is still valid, you <strong>must</strong></p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>submit a declaration concerning a lost, stolen, inaccessible, damaged or found Canadian travel document [PPTC 203] (PDF, 1.3 MB) with your application</li>
                      <li>pay the extra <strong>$45</strong> fee for replacing a lost or stolen passport</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's expired</h4>
                    <p className="text-base text-[#333333]">
                      You only need the main application form. Complete it and then submit it to us.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
    
            {/* Damaged Passport */}
            <AccordionItem value="damaged" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]">Your most recent passport was <strong>damaged</strong></span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's still valid</h4>
                    <p className="text-base text-[#333333]">
                      You <strong>must</strong> submit a declaration concerning a lost, stolen, inaccessible, damaged or found Canadian travel document [PPTC 203] (PDF, 1.33 MB) with your application.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#26374a] mb-2">If it's expired</h4>
                    <p className="text-base text-[#333333]">
                      You only need the main application form. Complete it and then submit it to us.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    {
      id: 4,
      title: "Find Guarantors and References",
      hasTooltip: true,
      content: (
        <div className="space-y-6">
          <p className="text-[#333333] text-base leading-relaxed">
            You need a guarantor and 2 references
          </p>
          <h3 className="text-lg font-semibold text-[#26374a]">References</h3>
          
          <p className="text-[#333333] text-base leading-relaxed mb-6">
                  To avoid delays, make sure your references are available if or when we need to contact them. We may ask for additional references at any time.
                </p>
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="referenceRequirements" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]">Reference requirements</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <p className="text-[#333333] text-base leading-relaxed mb-4">
                  Your references must
                </p>
                <ul className="text-base leading-relaxed text-black list-disc pl-5 mb-4">
                  <li>be 18 or older</li>
                  <li>have known you for at least 2 years</li>
                  <li>agree to you using their name and contact information for your application</li>
                </ul>
                
                
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
    
          <h3 className="text-lg font-semibold text-[#26374a] mt-8">Guarantors</h3>
          <div className="space-y-4">
            <p className="text-[#333333] text-base leading-relaxed">
              You need a guarantor to sign:
            </p>
            <ul className="text-base leading-relaxed text-black list-disc pl-5">
              <li>your application form</li>
              <li>1 of your passport photos <strong>and</strong></li>
              <li><strong>all</strong> copies of your supporting identity documents (ID)</li>
            </ul>
    
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="guarantorRequirements" className="border border-gray-300 rounded">
                <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                  <span className="text-base font-medium text-[#26374a]">Guarantor Requirements</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t border-gray-300">
                  <ReferenceRequirementsCard
                    title="Your Guarantor must"
                    items={[
                      "be 18 or older",
                      "have known you for at least 2 years",
                      "be a Canadian citizen",
                      "have a 5-year or 10-year Canadian passport that, on the day you submit your application, is",
                      "  • expired for no more than 1 year, **or**",
                      "  • valid, meaning it isn't or wasn't",
                      "    ◦ expired",
                      "    ◦ damaged",
                      "    ◦ inaccessible",
                      "    ◦ suspended or revoked",
                      "    ◦ reported lost or stolen",
                      "    ◦ found and returned",
                      "    ◦ destroyed by us",
                      "    ◦ requested to be returned",
                      "have been 16 or older when they applied for their passport",
                      "include the necessary information from their passport on your application form",
                      "be available if we need to contact them"
                    ]}
                  />
          <p className="text-base">
              <a 
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/travel-documents-references-guarantors.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Additional guarantor requirements
              </a>
            </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
    
           
    
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="noGuarantor" className="border border-gray-300 rounded">
                <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                  <span className="text-base font-medium text-[#26374a]"><strong>If you can't find a guarantor</strong></span>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t border-gray-300">
                  <p className="text-[#333333] text-base leading-relaxed mb-4">
                    You need to
                  </p>
                  <ul className="text-base leading-relaxed text-black list-disc pl-5 space-y-3">
                    <li>contact us to get a Statutory Declaration in Lieu of Guarantor form
                      <ul className="list-disc pl-5 mt-1">
                        <li>It's <strong>not</strong> available online.</li>
                      </ul>
                    </li>
                    <li>find someone who can administer an oath to swear to and sign the form
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>This person doesn't need to know you personally.</li>
                        <li><strong>If you're in Canada,</strong> this can be a
                          <ul className="list-disc pl-5 mt-1">
                            <li>notary public</li>
                            <li>justice of the peace</li>
                            <li>commissioner for oaths</li>
                          </ul>
                        </li>
                        <li><strong>If you're outside Canada,</strong> this can be a
                          <ul className="list-disc pl-5 mt-1">
                            <li>Canadian or British diplomatic or consular representative</li>
                            <li>qualified local official, such as a civil servant or member of Parliament</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Gather Documents",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#26374a]">What you need to apply for a passport</h2>
          
          <p className="text-[#333333] text-base leading-relaxed">
            You need <strong>all</strong> of the following:
          </p>
    
          <ul className="text-base leading-relaxed text-[#333333] list-disc pl-5 space-y-4">
            <li>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                proof of Canadian citizenship
              </a>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>This can be a birth certificate or citizenship certificate.
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>If you have a <strong>paper</strong> certificate, it must be the original document, not a photocopy.</li>
                    <li>If you have a citizenship <strong>e-certificate</strong>, you must attach a{' '}
                      <a 
                        href="#" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
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
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                document to support your identity
              </a>
              <ul className="list-disc pl-5 mt-2">
                <li>This can be a photocopy <strong>or</strong> the original.
                  <ul className="list-disc pl-5 mt-1">
                    <li>If you want to use a photocopy of your ID, make sure you show both sides and have it signed <strong>and</strong> dated by your guarantor or signing official.</li>
                  </ul>
                </li>
              </ul>
            </li>
    
            <li>2 identical passport photos</li>
            <li>a guarantor</li>
            <li>2 references</li>
          </ul>
    
          <p className="text-[#333333] text-base leading-relaxed mt-6">
            If you have a Canadian passport or other travel document and it's still valid, you also need to send us it.
          </p>
        </div>
      ),
    },
    {
      id: 6,
      title: "Submit your application in person",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#26374a]">Submit your application</h2>
          
          <p className="text-[#333333] text-base leading-relaxed">
            You may need to provide proof that you need the passport.
          </p>
    
          <Tabs defaultValue="inPerson" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#f5f5f5] border border-gray-300">
              <TabsTrigger
                value="inPerson"
                className="data-[state=active]:bg-[#26374a] data-[state=active]:text-white font-semibold"
              >
                In person
              </TabsTrigger>
              <TabsTrigger
                value="byMail"
                className="data-[state=active]:bg-[#26374a] data-[state=active]:text-white font-semibold"
              >
                By mail
              </TabsTrigger>
            </TabsList>
    
            <TabsContent value="inPerson" className="space-y-6 mt-6" role="tabpanel" aria-labelledby="tab-inPerson">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#26374a] mb-3">By appointment</h3>
                  <p className="text-[#333333] text-base leading-relaxed mb-3">
                    You can{' '}
                    <a 
                      href="#" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      book an appointment online
                    </a>.
                  </p>
                  <p className="text-[#333333] text-base leading-relaxed">
                    Some locations have a high demand for appointments. Their availability may vary.
                  </p>
                </div>
    
                <div>
                  <h3 className="text-lg font-semibold text-[#26374a] mb-3">Without an appointment (walk-in)</h3>
                  <p className="text-[#333333] text-base leading-relaxed mb-3">
                    Go to a{' '}
                    <a 
                      href="#" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      passport office with <strong>express</strong> pick-up service
                    </a>.
                  </p>
                  <p className="text-[#333333] text-base leading-relaxed">
                    If the location is busy, we may prioritize people who need a passport within 48 hours.
                  </p>
                </div>
              </div>
            </TabsContent>
    
            <TabsContent value="byMail" className="space-y-6 mt-6" role="tabpanel" aria-labelledby="tab-byMail">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#26374a]">Submit the application by mail</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="province-selector" className="block text-base font-medium text-[#26374a] mb-2">
                      Canadian Province
                    </label>
                    <select 
                      id="province-selector"
                      className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#26374a] focus:border-transparent"
                    >
                      <option value="">Select a province</option>
                      <option value="AB">Alberta</option>
                      <option value="BC">British Columbia</option>
                      <option value="MB">Manitoba</option>
                      <option value="NB">New Brunswick</option>
                      <option value="NL">Newfoundland and Labrador</option>
                      <option value="NS">Nova Scotia</option>
                      <option value="ON">Ontario</option>
                      <option value="PE">Prince Edward Island</option>
                      <option value="QC">Quebec</option>
                      <option value="SK">Saskatchewan</option>
                      <option value="NT">Northwest Territories</option>
                      <option value="NU">Nunavut</option>
                      <option value="YT">Yukon</option>
                    </select>
                  </div>
    
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Disclaimer:</strong> Due to the potential Canada Post labour disruption, you should use another courier if you want to apply by mail, or apply at a Service Canada Centre or passport office.
                    </p>
                  </div>
    
                  <p className="text-[#333333] text-base leading-relaxed">
                    Service standards don't include mailing time. Mailing times vary across the country.
                  </p>
    
                  <p className="text-[#333333] text-base leading-relaxed">
                    Use a certified courier or traceable mail service to reduce the delivery time of your application and help protect your documents.
                  </p>
    
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded">
                      <h4 className="text-base font-semibold text-[#26374a] mb-3">Mailing address (non-courier)</h4>
                      <div className="text-base text-[#333333] space-y-1">
                        <p>Government of Canada Passport Program</p>
                        <p>Gatineau, Quebec</p>
                        <p>K1A 0G3</p>
                      </div>
                    </div>
    
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded">
                      <h4 className="text-base font-semibold text-[#26374a] mb-3">Courier address</h4>
                      <div className="text-base text-[#333333] space-y-1">
                        <p>Government of Canada Passport Program</p>
                        <p>22 De Varennes Street</p>
                        <p>Gatineau, Quebec</p>
                        <p>J8T 8R1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ),
    },
    {
      id: 7,
      title: "Track your progress",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#26374a]">Check the status of your passport application</h2>
          
          <p className="text-[#333333] text-base leading-relaxed">
            See how long it may take us to process your application under normal circumstances.
          </p>
          
          <p className="text-[#333333] text-base leading-relaxed">
            Avoid waiting on the phone and get the status of your application online.
          </p>
    
          <a 
            href="https://etatpasseport-passportstatus.service.canada.ca/en/expectations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#318000] text-white px-6 py-3 rounded font-medium hover:bg-[#266600] transition-colors"
          >
            Check the status of your application
          </a>
    
          <div className="space-y-4">
            <p className="text-[#333333] text-base leading-relaxed">
              If your application is not displayed it is processing:
            </p>
            
            <ul className="text-base leading-relaxed text-[#333333] list-disc pl-5 space-y-1">
              <li>Outside Canada and US: up to 20 business days</li>
              <li>In Canada, applied by mail: up to 10 business days</li>
              <li>In Canada, applied in person: up to 5 business days</li>
            </ul>
    
            <p className="text-[#333333] text-base leading-relaxed mt-6">
              If you still can't see your passport: contact us
            </p>
    
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="contactUs" className="border border-gray-300 rounded">
                <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                  <span className="text-base font-medium text-[#26374a]">Contact Information</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t border-gray-300">
                  <p className="text-[#333333] text-base leading-relaxed mb-6">
                    Our agents answer calls Monday to Friday, from 8:30 a.m. to 5:00 p.m. your local time (9:00 a.m. to 5:30 p.m. in Newfoundland and Labrador). They do not answer calls on statutory holidays.
                  </p>
    
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Call Us Card */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                      <h4 className="text-lg font-semibold text-[#26374a] mb-3">Call us</h4>
                      <p className="text-[#333333] text-sm mb-3">
                        Reach us at either of the numbers below.
                      </p>
                      <div className="space-y-2">
                        <p className="text-[#333333] text-sm">
                          Toll-free number: <strong>1-800-567-6868</strong>
                        </p>
                        <p className="text-[#333333] text-sm">
                          Direct number: <strong>1-819-997-8338</strong>
                        </p>
                      </div>
                    </div>
    
                    {/* TTY Service Card */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <h4 className="text-lg font-semibold text-[#26374a] mb-3">Use our TTY service</h4>
                      <p className="text-[#333333] text-sm mb-3">
                        If you're hearing impaired or have a speech impediment, use our TTY service.
                      </p>
                      <p className="text-[#333333] text-sm">
                        <strong>1-866-255-7655</strong>
                      </p>
                    </div>
    
                    {/* Passport Office Card */}
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                      <h4 className="text-lg font-semibold text-[#26374a] mb-3">Go to a passport office</h4>
                      <p className="text-[#333333] text-sm mb-3">
                        Use walk-in service at a passport office to request the status of your application.
                      </p>
                      <a 
                        href="#" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 text-sm"
                      >
                        Find a passport office and check walk-in wait times
                      </a>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Getting your passport",
      content: (
        <div className="space-y-6">
          <Accordion type="multiple" className="space-y-4">
            {/* Applied by Mail */}
            <AccordionItem value="appliedByMail" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]"><strong>You applied by mail</strong></span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <p className="text-[#333333] text-base leading-relaxed">
                    When your passport is ready, we'll mail it to you. Mail time is usually 5 business days, but it can vary across the country.
                  </p>
                  <p className="text-[#333333] text-base leading-relaxed">
                    Any original documents you submitted will be mailed back to you. <strong>They may be in a separate package from your passport.</strong>
                  </p>
                  <p className="text-[#333333] text-base leading-relaxed">
                    While you're waiting for your passport, you can{' '}
                    <a 
                      href="https://etatpasseport-passportstatus.service.canada.ca/en/expectations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      check the status of your application online
                    </a>
                    {' '}for instant updates.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
    
            {/* Applied in Person */}
            <AccordionItem value="appliedInPerson" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]"><strong>You applied in person</strong></span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <p className="text-[#333333] text-base leading-relaxed">
                    When your passport is ready, we'll mail it to you <strong>unless</strong> you paid for pickup service. Mail time is usually 5 business days, but it can vary across the country.
                  </p>
                  <p className="text-[#333333] text-base leading-relaxed">
                    While you're waiting for your passport, you can{' '}
                    <a 
                      href="https://etatpasseport-passportstatus.service.canada.ca/en/expectations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      check the status of your application online
                    </a>
                    {' '}for instant updates.
                  </p>
                  
                  <div className="mt-6">
                    <h4 className="text-base font-semibold text-[#26374a] mb-3">If you paid for a pick-up service</h4>
                    <p className="text-[#333333] text-base leading-relaxed mb-3">
                      The pickup date will be indicated on your receipt.
                    </p>
                    <p className="text-[#333333] text-base leading-relaxed">
                      You can send someone else to pick up your passport if they have
                    </p>
                    <ul className="text-base leading-relaxed text-[#333333] list-disc pl-5 mt-2">
                      <li>valid identification <strong>and</strong></li>
                      <li>something in writing from you saying they're allowed to</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
    
            {/* Moving Before Receiving Passport */}
            <AccordionItem value="movingAddress" className="border border-gray-300 rounded">
              <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 text-left">
                <span className="text-base font-medium text-[#26374a]"><strong>If you're moving, but don't have your passport yet</strong></span>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t border-gray-300">
                <div className="space-y-4">
                  <p className="text-[#333333] text-base leading-relaxed">
                    Contact us to update your mailing address if you
                  </p>
                  <ul className="text-base leading-relaxed text-[#333333] list-disc pl-5">
                    <li>haven't received your passport <strong>and</strong></li>
                    <li>are moving within 30 days of submitting your application</li>
                  </ul>
                  <p className="text-[#333333] text-base leading-relaxed mt-4">
                    If you have a community mailbox, make sure you check it before you contact us about your application.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
 
  ]

  return (
    <section className="space-y-8" aria-label="Passport Application Steps">
      <div className="border-b-4 border-[#af3c43] pb-4">
        <h1 className="text-3xl font-bold text-[#26374a] mb-2">Passport Application Checklist</h1>
        <p className="text-base text-[#666666]">Complete each step to apply for your Canadian passport</p>
      </div>

      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connecting line - Dynamic height based on expanded state */}
            {index < steps.length - 1 && (
              <div
                className="absolute left-4 w-0.5 bg-gray-400 z-0"
                style={{
                  top: "3rem",
                  height: expandedStep === step.id ? "calc(100% - 3rem + 2rem)" : "4rem",
                }}
                aria-hidden="true"
              />
            )}

            <div className="flex relative z-10" ref={(el) => (stepRefs.current[index] = el)}>
              {/* Step indicator */}
              <div className="flex flex-col items-center mr-6 relative z-10">
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-200 focus:ring-2 focus:ring-[#3b99fc] focus:ring-offset-2 ${
                    expandedStep === step.id || completedSteps.includes(step.id)
                      ? "bg-[#26374a] text-white border-[#26374a]"
                      : "bg-white text-[#26374a] border-[#26374a] hover:bg-[#f5f5f5]"
                  }`}
                  aria-expanded={expandedStep === step.id}
                  aria-controls={`step-${step.id}-content`}
                  id={`step-${step.id}-header`}
                >
                  {step.id}
                </button>
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <div className="gc-card border-2 border-gray-300">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full px-6 py-4 text-left hover:bg-[#f5f5f5] transition-colors duration-200 focus:ring-2 focus:ring-[#3b99fc] focus:ring-inset"
                    aria-expanded={expandedStep === step.id}
                    aria-controls={`step-${step.id}-content`}
                    aria-labelledby={`step-${step.id}-header`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-sm font-semibold text-[#666666]">Step {step.id} of 8</span>
                          {step.hasTooltip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 p-0 text-[#26374a] hover:bg-transparent"
                                    aria-label="More information about filling the application form"
                                    onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling
                                  >
                                    <Info className="h-4 w-4" aria-hidden="true" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#26374a] text-white border border-[#26374a]">
                                  <p>Additional information about this step</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[#26374a]">{step.title}</h3>
                        {step.subtitle && (
                          <p className="text-base font-semibold text-[#af3c43] mt-1">{step.subtitle}</p>
                        )}
                      </div>
                      <div
                        className={`transform transition-transform duration-200 ${
                          expandedStep === step.id ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg className="w-5 h-5 text-[#26374a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="px-6 pb-6 border-t border-gray-300 bg-white"
                    >
                      <div className="pt-6">{step.content}</div>
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
