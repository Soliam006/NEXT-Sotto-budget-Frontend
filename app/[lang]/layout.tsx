import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import { ThemeProvider } from "@/contexts/theme-provider"
import { ProjectProvider} from "@/contexts/project-context";

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
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

