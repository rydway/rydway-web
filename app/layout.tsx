import type { Metadata } from "next"
import { Montserrat, Nunito } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { QueryProvider } from "@/providers/QueryProvider"

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
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}