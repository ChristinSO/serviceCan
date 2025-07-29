"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"

export function SubFooterBand() {
  return (
    <div className="bg-[#f5f5f5] py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <label htmlFor="email-newsletter" className="sr-only">
              Email for newsletter
            </label>
            <Input
              id="email-newsletter"
              type="email"
              placeholder="Email for newsletter"
              className="w-full sm:w-64 bg-white border border-gray-300 text-[#333333] placeholder:text-[#666666] focus:border-[#3b99fc]"
            />
            <Button className="bg-[#26374a] text-white hover:bg-[#3b99fc] focus:ring-2 focus:ring-[#3b99fc] focus:ring-offset-2">
              Sign up
            </Button>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-[#666666] hover:text-[#26374a]" aria-label="Facebook">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#666666] hover:text-[#26374a]" aria-label="Twitter">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#666666] hover:text-[#26374a]" aria-label="Instagram">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#666666] hover:text-[#26374a]" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-[#666666] hover:text-[#26374a]" aria-label="Youtube">
              <Youtube className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <Link href="/" className="cursor-pointer">
            <img
              src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg"
              alt="Government of Canada logo"
              className="h-10 object-contain cursor-pointer"
            />
          </Link>
          <p className="text-sm text-[#666666] mt-2">© 2023 Government of Canada</p>
        </div>
      </div>
    </div>
  )
}