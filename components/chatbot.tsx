"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [showQA, setShowQA] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState("")

  // Simulated Q&A responses based on keywords
  const getQAResponse = (question) => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes("passport") && lowerQuestion.includes("renew")) {
      return {
        title: "How to Renew Your Passport",
        answer: "To renew your passport, you'll need to submit Form DS-82 by mail if you meet certain criteria. Your passport must be undamaged, issued when you were 16 or older, and issued within the last 15 years.",
        relatedQuestions: [
          "What documents do I need for passport renewal?",
          "How long does passport renewal take?",
          "Can I renew my passport online?"
        ]
      }
    } else if (lowerQuestion.includes("passport") && lowerQuestion.includes("fee")) {
      return {
        title: "Passport Fees",
        answer: "Current passport fees are: Adult passport book - $130, Adult passport card - $30, Both book and card - $160. Additional execution fee of $35 applies for first-time applicants.",
        relatedQuestions: [
          "Are there expedited passport fees?",
          "What payment methods are accepted?",
          "Can I get a refund on passport fees?"
        ]
      }
    } else if (lowerQuestion.includes("passport") && lowerQuestion.includes("photo")) {
      return {
        title: "Passport Photo Requirements",
        answer: "Passport photos must be 2x2 inches, taken within the last 6 months, with a white background. You must have a neutral expression with both eyes open.",
        relatedQuestions: [
          "Can I take my own passport photo?",
          "Where can I get passport photos taken?",
          "What should I wear for passport photos?"
        ]
      }
    } else {
      return {
        title: "Passport Information",
        answer: "I can help you with various passport-related questions including applications, renewals, fees, photo requirements, and processing times. Please ask a specific question.",
        relatedQuestions: [
          "How do I apply for a new passport?",
          "What are current passport processing times?",
          "Do I need a passport for international travel?"
        ]
      }
    }
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = { id: Date.now(), text: inputValue, sender: "user" }
      setMessages((prevMessages) => [...prevMessages, newMessage])
      setCurrentQuestion(inputValue)
      setShowQA(true)
      setInputValue("")

      // Simulate bot response after a delay
      setTimeout(() => {
        const qaData = getQAResponse(inputValue)
        const botResponse = {
          id: Date.now() + 1,
          text: qaData.answer,
          sender: "bot",
        }
        setMessages((prevMessages) => [...prevMessages, botResponse])
      }, 1000)
    }
  }

  const handleRelatedQuestion = (question) => {
    const newMessage = { id: Date.now(), text: question, sender: "user" }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setCurrentQuestion(question)

    setTimeout(() => {
      const qaData = getQAResponse(question)
      const botResponse = {
        id: Date.now() + 1,
        text: qaData.answer,
        sender: "bot",
      }
      setMessages((prevMessages) => [...prevMessages, botResponse])
    }, 1000)
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 w-96 h-[500px] z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
        >
          <Card className="h-full flex flex-col shadow-xl border-2 border-gray-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-[#26374a] text-white">
              <CardTitle id="chatbot-title" className="text-base font-bold">
                Passport Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-[#1c2b3a]"
                aria-label="Close chatbot"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 bg-white overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4" role="log" aria-live="polite" aria-atomic="false">
                {/* Initial greeting if no messages */}
                {messages.length === 0 && !showQA && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Ask me anything about passports!</p>
                  </div>
                )}

                {/* Google-style Q&A section */}
                {showQA && currentQuestion && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {getQAResponse(currentQuestion).title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {getQAResponse(currentQuestion).answer}
                      </p>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-600 mb-2">People also ask:</p>
                      <div className="space-y-1">
                        {getQAResponse(currentQuestion).relatedQuestions.map((q, index) => (
                          <button
                            key={index}
                            onClick={() => handleRelatedQuestion(q)}
                            className="text-left w-full text-sm text-blue-600 hover:text-blue-800 hover:underline py-1"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat messages */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 text-sm leading-relaxed rounded-lg ${
                      message.sender === "user"
                        ? "bg-[#26374a] text-white ml-auto max-w-[80%]"
                        : "bg-[#f5f5f5] text-[#333333] mr-auto max-w-[80%] border border-gray-300"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              
              {/* Input section */}
              <div className="flex space-x-2 border-t pt-3">
                <label htmlFor="chatbot-input" className="sr-only">
                  Type your message
                </label>
                <Input
                  id="chatbot-input"
                  placeholder="Ask about passports..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 text-sm gc-input border-2 border-gray-400 focus:border-[#3b99fc] bg-white"
                />
                <Button onClick={handleSendMessage} className="gc-button-primary px-3" aria-label="Send message">
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-40 gc-button-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        aria-expanded={isOpen}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </Button>
    </>
  )
}