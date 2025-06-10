import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import { ThemeProvider } from "@/contexts/theme-provider"
import ClientLayout from "@/app/client-layout";

export const metadata: Metadata = {
  title: "Construction Management Dashboard",
  description: "A modern dashboard for construction project management",
}
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  return (
    <div>
      <ClientLayout>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </ClientLayout>
    </div>
  )
}

