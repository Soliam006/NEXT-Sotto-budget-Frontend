"use client"

import {Card, CardContent} from "@/components/ui/card"
import {useEffect, useState} from "react";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {LayoutDashboard, Calendar, Users, Package, DollarSign, Settings,} from "lucide-react"


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
      icon: LayoutDashboard,
      path: "/dashboard",
      active: currentSection === "dashboard",
    },
    {
      id: "calendar",
      label: dictionary.nav?.calendar || "Calendar",
      icon: Calendar,
      path: "/dashboard/calendar",
      active: currentSection === "calendar",
    },
    {
      id: "workers",
      label: dictionary.nav?.workers || "Workers",
      icon: Users,
      path: "/dashboard/workers",
      active: currentSection === "workers",
    },
    {
      id: "materials",
      label: dictionary.nav?.materials || "Inventory",
      icon: Package,
      path: "/dashboard/inventory",
      active: currentSection === "inventory",
    },
    {
      id: "expenses",
      label: dictionary.nav?.expenses || "Expenses",
      icon: DollarSign,
      path: "/dashboard/expenses",
      active: currentSection === "expenses",
    }
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
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => (
              <Button
                  key={item.path}
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                      "justify-start",
                      item.active
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                          : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => onNavigate(item.path)}
              >
                {<item.icon className="w-5 h-5" />}
                <span className="ml-2">{item.label}</span>
              </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}

