"use client"

import { CalendarIcon, Command, DollarSign, Package, Settings, Users, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DashboardSidebarProps {
  dictionary: any
  currentSection: string
  onNavigate: (path: string) => void
}

export function DashboardSidebar({ dictionary, currentSection, onNavigate }: DashboardSidebarProps) {
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
    {
      id: "settings",
      label: dictionary.nav?.settings || "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ]

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start ${
                currentSection === item.id ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onNavigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </Card>
  )
}

