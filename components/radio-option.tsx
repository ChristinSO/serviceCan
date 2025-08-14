"use client"

import { RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface RadioOptionProps {
  id: string
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (value: string) => void
  fee?: number
}

export function RadioOption({ id, name, value, label, checked, onChange, fee }: RadioOptionProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem
        value={value}
        id={id}
        checked={checked}
        onClick={() => onChange(value)} // on click to toggle
        className={cn(
          "h-4 w-4 border-2 border-gray-400 data-[state=checked]:bg-[#26374a] data-[state=checked]:border-[#26374a]",
          "focus:ring-2 focus:ring-[#3b99fc] focus:ring-offset-2", // Added focus styles
        )}
      />
      <Label htmlFor={id} className="text-base font-medium text-[#333333] cursor-pointer">
        {label}
        {fee !== undefined && fee !== 0 && (
          <span className="ml-2 text-sm font-semibold text-[#666666]">
            {fee > 0 ? `(+$${fee})` : `(-$${Math.abs(fee)})`}
          </span>
        )}
      </Label>
    </div>
  )
}
