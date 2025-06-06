"use client"

import {CalendarIcon, Command, Package, Users, DollarSign, BookType} from "lucide-react"
import {cn} from "@/lib/utils";
import React from "react";
import {useUser} from "@/contexts/UserProvider";
import {UserRole} from "@/lib/types/user.types";

interface DashboardBottomBarProps {
  dictionary: any
  currentSection: string
  onNavigate: (path: string) => void
}

export function DashboardBottomBar({ dictionary, currentSection, onNavigate }: DashboardBottomBarProps) {
  const {user} = useUser()

  const allNavs = [
    {
      id: "dashboard",
      label: dictionary.nav?.dashboard || "Dashboard",
      icon: Command,
      path: "/dashboard",
      active: currentSection === "dashboard",
      roles: ['admin'] // Roles que pueden ver este item
    },
    {
      id: "tasks",
      label: dictionary.nav?.tasks || "Tasks",
      icon: BookType,
      path: "/dashboard/tasks",
      active: currentSection === "tasks",
        roles: ['client', 'worker'] // Admin no puede ver tasks
    },
    {
      id: "calendar",
      label: dictionary.nav?.calendar || "Calendar",
      icon: CalendarIcon,
      path: "/dashboard/calendar",
        active: currentSection === "calendar",
        roles: ['admin'] // Admin puede ver calendar
    },
    {
      id: "workers",
      label: dictionary.nav?.workers || "Workers",
      icon: Users,
      path: "/dashboard/workers",
      active: currentSection === "workers",
      roles: ['admin'] // Admin puede ver workers
    },
    {
      id: "materials",
      label: dictionary.nav?.materials || "Inventory",
      icon: Package,
      path: "/dashboard/inventory",
      active:  currentSection === "inventory",
      roles: ['admin', 'client'] // Todos pueden ver inventory
    },
    {
      id: "expenses",
      label: dictionary.nav?.expenses || "Expenses",
      icon: DollarSign,
      path: "/dashboard/expenses",
      active: currentSection === "expenses",
      roles: ['admin'] // Solo admin puede ver expenses
    },
  ]

  const navItems = allNavs.filter(item => {
    // Filtrar los items según el rol del usuario
    const userRole : UserRole | undefined = user?.role
    return item.roles ? item.roles.includes(userRole as UserRole) : true;
  });

  return (
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            {navItems.map((item) => (
                <button
                    key={item.path}
                    className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                        item.active ? "text-cyan-500" : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => onNavigate(item.path)}
                >
                    {React.createElement(item.icon, { size: 24 })}
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
            ))}
          </div>
        </div>
      </div>
  )
}

