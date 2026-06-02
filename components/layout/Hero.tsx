"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import SearchBar from "../pages/search/Search"

export default function Hero() {
  const [location, setLocation] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [carType, setCarType] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const locations = [
    { name: "Abuja", disabled: false },
    { name: "Lagos", disabled: true },
    { name: "Port Harcourt", disabled: true },
    { name: "Calabar", disabled: true },
  ]

  const carTypes = [
    { value: "luxury", label: "Luxury" },
    { value: "casual", label: "Casual" },
    { value: "family", label: "Family" },
  ]

  const handleSearch = () => {
    alert(`Searching: ${location || "Any location"}, ${dateRange.from?.toDateString()} → ${dateRange.to?.toDateString()}, ${carType || "Any car type"}`)
  }

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center justify-center bg-white overflow-hidden pt-16 sm:pt-20 md:pt-0">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg0.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient balls/effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 left-4 sm:left-10 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-[#0074D1] to-white rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 left-4 sm:left-10 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#0074D1] to-white rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute top-20 right-4 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-[#0074D1] to-white rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-4 sm:right-20 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-tr from-[#0074D1] to-white rounded-full opacity-25 blur-3xl"></div>
        <div className="hidden sm:block absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-[#0074D1] to-white rounded-full opacity-20 blur-3xl"></div>
        <div className="hidden sm:block absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-l from-[#0074D1] to-white rounded-full opacity-15 blur-3xl"></div>
      </div>

      {/* Main content container */}
      <div className="relative font-primary z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-8 sm:py-0">
        {/* Search form */}
  

        {/* Main content - Car image and copy */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-12">
          {/* Copy - Left side on large screens */}
          <div className="lg:w-1/2 flex flex-col items-start px-4 lg:px-0 order-2 lg:order-1">
            <h1 className="max-w-6xl text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-primary text-foreground leading-tight sm:leading-snug lg:leading-tight">
              You&apos;ve been renting cars wrong.
              <span className="mt-2 sm:mt-3 lg:mt-4 block font-bold text-primary">
                Do it the Rydway.
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 lg:mt-8 max-w-lg text-lg sm:text-xl lg:text-2xl text-foreground/85 leading-relaxed">
              Premium cars, trusted partners, and transparent pricing.
              No stress. No guesswork.
            </p>
          </div>

          {/* Car image - Hidden on mobile, centered and larger on desktop */}
          <div className="hidden lg:flex lg:w-1/2 justify-center items-center order-1 lg:order-2">
            <div className="relative w-full h-[400px] xl:h-[500px] 2xl:h-[600px] flex items-center justify-center">
              <Image
                src="/car2.png"
                alt="Car"
                width={800}
                height={400}
                className="object-contain w-full h-full max-h-full"
                priority
                sizes="(min-width: 1024px) 50vw, 0px"
              />
            </div>
          </div>
        </div>
              <div className="w-full   mb-8 sm:mb-12 pt-6 lg:mb-16  flex items-center justify-center">
      <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </section>
  )
}