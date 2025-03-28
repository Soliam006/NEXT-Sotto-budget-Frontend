"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardBottomBar } from "@/components/dashboard/dashboard-bottom-bar"
import { useTheme } from "next-themes"
import type { User as UserType } from "@/app/context/user.types"
import {TopBarWrapper} from "@/components/top-bar-wrapper";
import useAuthMiddleware from "@/lib/token-verification";
import {useUser} from "@/app/context/UserProvider";
import LoadingView from "@/components/loading-view";

interface DashboardShellProps {
  children: React.ReactNode
  user: UserType | null
  dictionary: any
  lang: string
}

export function DashboardShell({ children, user, dictionary, lang }: DashboardShellProps) {
  const { theme, setTheme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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
    if (pathname?.includes("/dashboard/materials")) return "materials"
    if (pathname?.includes("/dashboard/projects")) return "projects"
    return "dashboard"
  }
  const [isLoadding, setIsLoadding]= useState(true);
  // Redirige al login si no hay token
  useAuthMiddleware(false, setIsLoadding);

  if (!dictionary || isLoadding) return <LoadingView/>; // Muestra un estado de carga mientras se obtiene el diccionario


  return (
    <div className="min-h-screen bg-background text-foreground">
        <TopBarWrapper user={user} dictionary={dictionary} lang={lang}
                       onNavigate={handleNavigate} />
      <div className="container mx-auto px-4 py-6 md:pt-16">
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Sidebar - visible on md screens and up */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar
              dictionary={dictionary}
              currentSection={getCurrentSection()}
              onNavigate={handleNavigate}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 pb-20 md:pb-0">{children}</div>
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

