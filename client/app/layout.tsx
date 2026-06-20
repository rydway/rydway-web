import type { Metadata } from "next"
import { Outfit, DM_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { QueryProvider } from "@/providers/QueryProvider"
import { Toaster } from "@/components/ui/sonner"
import CookieBanner from "@/components/features/CookieBanner"

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-primary",
})

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-secondary",
})

export const metadata: Metadata = {
  title: {
    default: "Rydway",
    template: "%s • Rydway",
  },
  description: "Premium car rentals and mobility experiences with Rydway",
  applicationName: "Rydway",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmSans.variable}`}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
        <Toaster position="top-center" />
        <CookieBanner />
      </body>
    </html>
  )
}