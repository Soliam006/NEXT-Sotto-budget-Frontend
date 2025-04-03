"use client"

import { CalendarIcon, Command, DollarSign, Package, Settings, Users, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {useEffect, useState} from "react";

interface DashboardSidebarProps {
  dictionary: any
  currentSection: string
  onNavigate: (path: string) => void
}

export function DashboardSidebar({ dictionary, currentSection, onNavigate }: DashboardSidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const navItems = [
    {
      id: "dashboard",
      label: dictionary.nav?.dashboard || "Dashboard",
      icon: Command,
      path: "/dashboard",
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
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  // Right sidebar content
  const TimeView = () => (
    <div>
      {/* System time */}
      <Card className="bg-card/50 border border-border/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-muted to-card p-6 border-b border-border/50">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1 font-mono">SYSTEM TIME</div>
              <div className="text-3xl font-mono text-primary mb-1">{formatTime(currentTime)}</div>
              <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm h-full">
      <div className="px-4">
        {/* Top Time View - only visible on larger screens */}
        <div className="pb-2">
          <TimeView />
        </div>
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

