"use client"

import {CalendarIcon, Command, Package, Users, Building, DollarSign} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardBottomBarProps {
  dictionary: any
  currentSection: string
  onNavigate: (path: string) => void
}

export function DashboardBottomBar({ dictionary, currentSection, onNavigate }: DashboardBottomBarProps) {
  const navItems = [
    {
      id: "dashboard",
      label: dictionary.nav?.dashboard || "Dashboard",
      icon: Command,
      path: "/dashboard",
    },
    {
      id: "projects",
      label: dictionary.nav?.projects || "Projects",
      icon: Building,
      path: "/dashboard/projects",
    },
    {
      id: "calendar",
      label: dictionary.nav?.calendar || "Calendar",
      icon: CalendarIcon,
      path: "/dashboard/calendar",
    },
    {
      id: "workers",
      label: dictionary.nav?.workers || "Workers",
      icon: Users,
      path: "/dashboard/workers",
    },
    {
      id: "materials",
      label: dictionary.nav?.materials || "Materials",
      icon: Package,
      path: "/dashboard/materials",
    },
    {
      id: "expenses",
      label: dictionary.nav?.expenses || "Expenses",
      icon: DollarSign,
      path: "/dashboard/expenses",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/50 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center px-2 py-1 h-auto ${
                currentSection === item.id ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => onNavigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

