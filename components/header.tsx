import { Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[#3b99fc] text-white px-4 py-2 z-50"
      >
        Skip to main content
      </a>

      {/* Main header */}
      <div className="border-b-4 border-[#af3c43]">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Canadian Flag and Government branding */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img
                  src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg"
                  alt="Government of Canada"
                  className="h-5 sm:h-6 md:h-8"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="relative">
                <label htmlFor="search-canada-ca" className="sr-only">
                  Search Canada.ca
                </label>
                <Input
                  id="search-canada-ca"
                  placeholder="Search Canada.ca"
                  className="w-32 sm:w-48 md:w-64 pr-10 sm:pr-12 gc-input border-gray-400 focus:border-[#3b99fc] text-sm"
                />
                <Button
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2 sm:px-3 bg-[#26374a] hover:bg-[#1c2b3a] border-0"
                  aria-label="Search"
                >
                  <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <button className="text-xs sm:text-sm text-[#26374a] hover:text-[#af3c43] font-semibold underline whitespace-nowrap">
                Français
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="bg-[#26374a]">
        <div className="container mx-auto px-2 sm:px-4">
          <button
            className="flex items-center space-x-2 text-white py-2 sm:py-3 px-2 sm:px-4 hover:bg-[#1c2b3a] transition-colors"
            aria-label="Open main menu"
          >
            <Menu className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="font-semibold text-sm sm:text-base">MENU</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#f5f5f5] border-b border-gray-200">
        <div className="container mx-auto px-2 sm:px-4 py-2">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm">
            <ol className="flex items-center space-x-1 sm:space-x-2">
              <li>
                <a href="/" className="text-[#26374a] hover:text-[#af3c43] underline">
                  Canada.ca
                </a>
              </li>
              <li aria-hidden="true" className="text-gray-500">
                {">"}
              </li>
              <li>
                <span aria-current="page" className="text-gray-700">
                  Adult Passport
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </header>
  )
}