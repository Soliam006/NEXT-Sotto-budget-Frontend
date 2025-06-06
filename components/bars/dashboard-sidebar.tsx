"use client"

import {Card, CardContent} from "@/components/ui/card"
import {useEffect, useState} from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {LayoutDashboard, Calendar, Users, Package, DollarSign, Settings, BookType,} from "lucide-react"
import { UserRole } from "@/lib/types/user.types"
import {useUser} from "@/contexts/UserProvider";

interface DashboardSidebarProps {
  dictionary: any
  currentSection: string
  onNavigate: (path: string) => void
}

export function DashboardSidebar({ dictionary, currentSection, onNavigate }: DashboardSidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const {user} = useUser()
  const userRole: UserRole|undefined = user?.role

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Definir todos los posibles items de navegación
  const allNavItems = [
    {
      id: "dashboard",
      label: dictionary.nav?.dashboard || "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      active: currentSection === "dashboard",
      roles: ['admin'] as UserRole[] // Roles que pueden ver este item
    },
    {
      id: "tasks",
      label: dictionary.nav?.tasks || "Tasks",
      icon: BookType,
      path: "/dashboard/tasks",
      active: currentSection === "tasks",
      roles: ['client', 'worker'] as UserRole[] // Admin no puede ver tasks
    },
    {
      id: "calendar",
      label: dictionary.nav?.calendar || "Calendar",
      icon: Calendar,
      path: "/dashboard/calendar",
      active: currentSection === "calendar",
      roles: ['admin'] as UserRole[]
    },
    {
      id: "workers",
      label: dictionary.nav?.workers || "Workers",
      icon: Users,
      path: "/dashboard/workers",
      active: currentSection === "workers",
      roles: ['admin'] as UserRole[] // Solo admin puede ver workers
    },
    {
      id: "materials",
      label: dictionary.nav?.materials || "Inventory",
      icon: Package,
      path: "/dashboard/inventory",
      active: currentSection === "inventory",
      roles: ['admin', 'client'] as UserRole[] // Admin y client pueden ver inventory
    },
    {
      id: "expenses",
      label: dictionary.nav?.expenses || "Expenses",
      icon: DollarSign,
      path: "/dashboard/expenses",
      active: currentSection === "expenses",
      roles: ['admin'] as UserRole[] // Solo admin puede ver expenses
    }
  ]

  // Filtrar los items basados en el rol del usuario
  const navItems = allNavItems.filter(item => item.roles.includes(userRole as UserRole))

  // Resto del componente permanece igual...
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const TimeView = () => (
      <div>
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
          <div className="pb-2">
            <TimeView />
          </div>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
                <Button
                    key={item.path}
                    variant={item.active ? "default" : "ghost"}
                    className={cn(
                        "justify-start cursor-pointer",
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