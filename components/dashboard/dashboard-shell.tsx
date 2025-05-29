"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardBottomBar } from "@/components/dashboard/dashboard-bottom-bar"
import { useTheme } from "next-themes"
import type { User as UserType } from "@/contexts/user.types"
import {TopBarWrapper} from "@/components/top-bar-wrapper";
import useAuthMiddleware from "@/lib/token-verification";
import LoadingView from "@/components/loading-view";

interface DashboardShellProps {
  children: React.ReactNode
  dictionary: any
  lang: string
}

export function DashboardShell({ children, dictionary, lang }: DashboardShellProps) {

  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Handle navigation
  const handleNavigate = (path: string) => {
    console.log(path)
    router.push(`/${lang}${path}`)
  }

  // Get current section from pathname
  const getCurrentSection = () => {
    if (pathname?.includes("/dashboard/calendar")) return "calendar"
    if (pathname?.includes("/dashboard/workers")) return "workers"
    if (pathname?.includes("/dashboard/inventory")) return "inventory"
    if (pathname?.includes("/dashboard/projects")) return "projects"
    if (pathname?.includes("/dashboard/expenses")) return "expenses"
    return "dashboard"
  }

  if (!dictionary ) return <LoadingView/>; // Muestra un estado de carga mientras se obtiene el diccionario


  return (
    <div className="min-h-screen w-screen bg-background text-foreground">
      {/* Top bar */}
      <TopBarWrapper dictionary={dictionary} lang={lang} onNavigate={handleNavigate} />

      <div className="w-full px-2 py-6 pt-20">

        <div className="flex flex-col md:flex-row mt-6">
          {/* Sidebar - visible en pantallas md y mayores */}
          <div className="hidden md:block w-54">
            <DashboardSidebar
              dictionary={dictionary}
              currentSection={getCurrentSection()}
              onNavigate={handleNavigate}
            />
          </div>

          {/* Contenido principal */}
          <div className="flex-1 pb-20 p-4 lg:p-8 min-h-full">
            {children}
          </div>
        </div>

          {/* Bottom bar - visible only on mobile */}
          {isMobile && (
            <DashboardBottomBar
              dictionary={dictionary}
              currentSection={getCurrentSection()}
              onNavigate={handleNavigate}
            />
          )}
        </div>
    </div>
  )
}

