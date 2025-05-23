"use client"

import { useState } from "react"
import { CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {DailyExpense} from "@/lib/types/day-expenses";

// Mock data for daily expenses
const generateDailyExpenses = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dailyExpenses: { [key: string]: DailyExpense } = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    if (date > today) continue

    const dailyLimit = 500 // Default daily budget limit
    const spent = Math.floor(Math.random() * 1000)

    dailyExpenses[date.toISOString().split("T")[0]] = {
      date: date.toISOString().split("T")[0],
      spent: spent,
      limit: dailyLimit,
      tasks: [
        {
          id: day * 100 + 1,
          title: `Task ${day}-1`,
          status: Math.random() > 0.5 ? "COMPLETED" : Math.random() > 0.5 ? "IN_PROGRESS" : "PENDING",
          worker: "Worker " + ((day % 5) + 1),
        },
        {
          id: day * 100 + 2,
          title: `Task ${day}-2`,
          status: Math.random() > 0.5 ? "COMPLETED" : Math.random() > 0.5 ? "IN_PROGRESS" : "PENDING",
          worker: "Worker " + ((day % 3) + 1),
        },
      ],
      inventory: [
        {
          id: day * 100 + 1,
          name: "Material A",
          cost: Math.floor(Math.random() * 200) + 50,
          quantity: Math.floor(Math.random() * 10) + 1,
        },
        {
          id: day * 100 + 2,
          name: "Material B",
          cost: Math.floor(Math.random() * 150) + 30,
          quantity: Math.floor(Math.random() * 5) + 1,
        },
        {
          id: day * 100 + 3,
          name: "Material C",
          cost: Math.floor(Math.random() * 100) + 20,
          quantity: Math.floor(Math.random() * 8) + 1,
        },
      ],
    }
  }

  return dailyExpenses
}

interface DashboardCalendarProps {
  dict: any
  lang: string
}

export function DashboardCalendar({ dict, lang }: DashboardCalendarProps) {
  const [dailyExpenses] = useState(generateDailyExpenses())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dailyBudgetLimit, setDailyBudgetLimit] = useState(500)

  // Handle day click in calendar
  const handleDayClick = (date: string) => {
    if (dailyExpenses[date]) {
      setSelectedDate(date)
      setIsDialogOpen(true)
    }
  }

  // Update daily budget limit
  const handleUpdateDailyLimit = () => {
    // In a real app, this would update the database
    // For now, we'll just update our local state
    console.log("Updated daily budget limit to:", dailyBudgetLimit)
  }

  // Calculate total spent for selected date
  const calculateTotalSpent = (date: string) => {
    if (!dailyExpenses[date]) return 0

    return dailyExpenses[date].inventory.reduce((total: number, material: any) => {
      return total + material.cost * material.quantity
    }, 0)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800  text-success border-success/50"
      case "IN_PROGRESS":
        return "bg-info/20 text-info border-info/50"
      case "PENDING":
        return "bg-warning/20 text-warning border-warning/50"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50"
    }
  }

  // Render calendar
  const renderCalendar = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 border border-border/30 bg-muted/20"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split("T")[0]
      const dayData = dailyExpenses[dateString]

      let bgColor = "bg-muted/50"
      if (dayData) {
        bgColor =
          dayData.spent > dayData.limit ? "bg-destructive/30 hover:bg-destructive/50" : "bg-green-100 text-green-800  hover:bg-green-100 text-green-800 "
      }

      days.push(
        <div
          key={day}
          className={`h-14 border border-border/30 ${bgColor} relative cursor-pointer transition-colors`}
          onClick={() => handleDayClick(dateString)}
        >
          <div className="absolute top-1 left-1 text-xs">{day}</div>
          {dayData && <div className="absolute bottom-1 right-1 text-xs font-mono">${dayData.spent}</div>}
        </div>,
      )
    }

    function getDaysTraduction(){
      if (lang === "es") {
        return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      }
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {getDaysTraduction().map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground py-1">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{dict.calendar?.title || "Budget Calendar"}</h1>

      {/* Budget Calendar */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-base">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              {dict.calendar?.monthView || "Month View"}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-green-100 text-green-800 "></div>
                <span className="text-xs text-muted-foreground">{dict.calendar?.underBudget || "Under Budget"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-destructive/70"></div>
                <span className="text-xs text-muted-foreground">{dict.calendar?.overBudget || "Over Budget"}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">{dict.calendar?.dailyBudgetLimit || "Daily Budget Limit"}:</div>
            <div className="flex-1">
              <Input
                type="number"
                value={dailyBudgetLimit}
                onChange={(e) => setDailyBudgetLimit(Number(e.target.value))}
                className="h-8 bg-muted/50 border-border"
              />
            </div>
            <Button size="sm" onClick={handleUpdateDailyLimit} className="bg-primary hover:bg-primary/90">
              {dict.calendar?.update || "Update"}
            </Button>
          </div>

          <div className="bg-muted/30 rounded-lg border border-border/50 p-4">{renderCalendar()}</div>

          <div className="mt-4 text-xs text-muted-foreground italic">
            {dict.calendar?.clickDay || "Click on a day to view detailed expenses and tasks"}
          </div>
        </CardContent>
      </Card>

      {/* Day details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              {dict.calendar?.expensesFor || "Expenses for"} {selectedDate}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {dict.calendar?.detailedBreakdown || "Detailed breakdown of tasks, inventory, and expenses"}
            </DialogDescription>
          </DialogHeader>

          {selectedDate && dailyExpenses[selectedDate] && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md border border-border/50">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {dict.calendar?.dailyBudgetLimit || "Daily Budget Limit"}
                  </div>
                  <div className="text-xl font-mono">${dailyExpenses[selectedDate].limit}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{dict.calendar?.totalSpent || "Total Spent"}</div>
                  <div
                    className={`text-xl font-mono ${dailyExpenses[selectedDate].spent > dailyExpenses[selectedDate].limit ? "text-destructive" : "text-success"}`}
                  >
                    ${dailyExpenses[selectedDate].spent}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{dict.calendar?.status || "Status"}</div>
                  <Badge
                    className={
                      dailyExpenses[selectedDate].spent > dailyExpenses[selectedDate].limit
                        ? "bg-destructive/20 text-destructive border-destructive/50"
                        : "bg-green-100 text-green-800  text-success border-success/50"
                    }
                  >
                    {dailyExpenses[selectedDate].spent > dailyExpenses[selectedDate].limit
                      ? dict.calendar?.overBudget || "Over Budget"
                      : dict.calendar?.underBudget || "Under Budget"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{dict.calendar?.tasks || "Tasks"}</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">{dict.calendar?.task || "Task"}</TableHead>
                      <TableHead className="text-muted-foreground">{dict.calendar?.worker || "Worker"}</TableHead>
                      <TableHead className="text-muted-foreground">{dict.calendar?.status || "Status"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyExpenses[selectedDate].tasks.map((task) => (
                      <TableRow key={task.id} className="border-border">
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.worker}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{dict.calendar?.inventory || "Inventory"}</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">{dict.calendar?.material || "Material"}</TableHead>
                      <TableHead className="text-muted-foreground">{dict.calendar?.quantity || "Quantity"}</TableHead>
                      <TableHead className="text-muted-foreground">{dict.calendar?.unitCost || "Unit Cost"}</TableHead>
                      <TableHead className="text-muted-foreground">{dict.calendar?.total || "Total"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyExpenses[selectedDate].inventory.map((material) => (
                      <TableRow key={material.id} className="border-border">
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>${material.cost}</TableCell>
                        <TableCell>${material.cost * material.quantity}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-border bg-muted/50">
                      <TableCell colSpan={3} className="text-right font-medium">
                        {dict.calendar?.total || "Total"}
                      </TableCell>
                      <TableCell className="font-medium text-primary">${calculateTotalSpent(selectedDate)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
