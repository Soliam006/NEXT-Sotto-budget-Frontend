"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity, AlertCircle, BarChart3, Bell,
  CalendarIcon, CheckCircle2, ClipboardList,
  Command, Construction, DollarSign,
  Download, Home, LineChart, type LucideIcon,
  MessageSquare, Moon, Package, RefreshCw,
  Search, Settings, Shield, Sun, Timer, Truck, Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
dynamic(() => import("@/components/custom-pie-chart"), { ssr: false })

import dynamic from "next/dynamic";
import CustomPieChart from "@/components/custom-pie-chart";
import useAuthMiddleware from "@/lib/token-verification";

// Mock data for projects
const PROJECTS = [
  {
    id: 1,
    title: "Kitchen Renovation",
    description: "Complete kitchen remodeling with new cabinets and appliances",
    admin: "John Doe",
    limitBudget: 15000,
    currentSpent: 12450,
    progress: {
      done: 12,
      inProgress: 8,
      todo: 5,
    },
    location: "123 Main St, Anytown",
    startDate: "2023-10-15",
    endDate: "2024-04-30",
  },
  {
    id: 2,
    title: "Bathroom Remodel",
    description: "Master bathroom renovation with new fixtures and tiling",
    admin: "Jane Smith",
    limitBudget: 8000,
    currentSpent: 5200,
    progress: {
      done: 8,
      inProgress: 4,
      todo: 3,
    },
    location: "456 Oak Ave, Somewhere",
    startDate: "2023-11-01",
    endDate: "2024-02-28",
  },
  {
    id: 3,
    title: "Basement Finishing",
    description: "Converting unfinished basement into living space",
    admin: "Mike Johnson",
    limitBudget: 25000,
    currentSpent: 18750,
    progress: {
      done: 15,
      inProgress: 12,
      todo: 8,
    },
    location: "789 Pine Rd, Elsewhere",
    startDate: "2023-09-01",
    endDate: "2024-06-15",
  },
]

// Mock data for daily expenses
const generateDailyExpenses = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dailyExpenses = {}

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    if (date > today) continue

    const dailyLimit = 500 // Default daily budget limit
    const spent = Math.floor(1000)
    const dailyExpenses: { [key: string]: {
      date: string;
      spent: number;
      limit: number;
      tasks: { id: number; title: string; status: string; worker: string }[],
      materials: { id: number; name: string; cost: number; quantity: number }[]
    }
    } = {}

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
      materials: [
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

export default function Dashboard() {

  useAuthMiddleware(false); // Redirige al login si no hay token

  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dailyBudgetLimit, setDailyBudgetLimit] = useState(500)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setDailyExpenses(generateDailyExpenses())
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    console.log(canvas)
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number = 0
      y: number = 0
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        if (canvas) {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
        }
        this.size = Math.random() * 10 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if(canvas) {
          if (this.x > canvas.width) this.x = 0
          if (this.x < 0) this.x = canvas.width
          if (this.y > canvas.height) this.y = 0
          if (this.y < 0) this.y = canvas.height
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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
  const [dailyExpenses, setDailyExpenses] = useState<{ [key: string]: any }>({})
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
    const updatedExpenses = { ...dailyExpenses }
    Object.keys(updatedExpenses).forEach((date) => {
      updatedExpenses[date].limit = dailyBudgetLimit
    })
    setDailyExpenses(updatedExpenses)
  }

  // Calculate total spent for selected date
  const calculateTotalSpent = (date: string) => {
    if (!dailyExpenses[date]) return 0

    return dailyExpenses[date].materials.reduce((total: number, material: any) => {
      return total + material.cost * material.quantity
    }, 0)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "PENDING":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
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
      days.push(<div key={`empty-${i}`} className="h-14 border border-slate-700/30 bg-slate-800/20"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split("T")[0]
      const dayData = dailyExpenses[dateString]

      let bgColor = "bg-slate-800/50"
      if (dayData) {
        bgColor =
          dayData.spent > dayData.limit ? "bg-red-900/30 hover:bg-red-900/50" : "bg-green-900/30 hover:bg-green-900/50"
      }

      days.push(
        <div
          key={day}
          className={`h-14 border border-slate-700/30 ${bgColor} relative cursor-pointer transition-colors`}
          onClick={() => handleDayClick(dateString)}
        >
          <div className="absolute top-1 left-1 text-xs">{day}</div>
          {dayData && <div className="absolute bottom-1 right-1 text-xs font-mono">${dayData.spent}</div>}
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-slate-400 py-1">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute insert-0 h-full w-full bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">SYSTEM INITIALIZING</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Construction className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SottoBudget
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/favicon.ico" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={Command} label="Dashboard" active />
                  <NavItem icon={Home} label="Projects" />
                  <NavItem icon={Users} label="Workers" />
                  <NavItem icon={Package} label="Materials" />
                  <NavItem icon={DollarSign} label="Expenses" />
                  <NavItem icon={ClipboardList} label="Tasks" />
                  <NavItem icon={CalendarIcon} label="Schedule" />
                  <NavItem icon={Settings} label="Settings" />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">PROJECT STATUS</div>
                  <div className="space-y-3">
                    <StatusItem
                      label="Budget Utilization"
                      value={Math.round((selectedProject.currentSpent / selectedProject.limitBudget) * 100)}
                      color="cyan"
                    />
                    <StatusItem
                      label="Task Completion"
                      value={Math.round(
                        (selectedProject.progress.done /
                          (selectedProject.progress.done +
                            selectedProject.progress.inProgress +
                            selectedProject.progress.todo)) *
                        100,
                      )}
                      color="green"
                    />
                    <StatusItem label="Timeline Progress" value={75} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
<div className="col-span-12 md:col-span-9 lg:col-span-7 overflow-y-auto">
            <div className="grid gap-6">
              {/* Project selector */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100">Select Project</CardTitle>
                    <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50">
                      {PROJECTS.length} Projects
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PROJECTS.map((project) => (
                      <Button
                        key={project.id}
                        variant="outline"
                        className={`h-auto py-3 px-4 border-slate-700 ${selectedProject.id === project.id ? "bg-slate-700/70 border-cyan-500/50" : "bg-slate-800/50 hover:bg-slate-700/50"} flex flex-col items-start justify-center space-y-2 w-full`}
                        onClick={() => setSelectedProject(project)}
                      >
                        <div className="flex items-center w-full">
                          <Home className="h-4 w-4 text-cyan-500 mr-2" />
                          <span className="text-sm font-medium truncate">{project.title}</span>
                        </div>
                        <div className="w-full">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Budget: ${project.limitBudget}</span>
                            <span>Spent: ${project.currentSpent}</span>
                          </div>
                          <Progress value={(project.currentSpent / project.limitBudget) * 100} className="h-1 mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${(project.currentSpent / project.limitBudget) * 100}%` }}
                            />
                          </Progress>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project overview */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                      Project Overview: {selectedProject.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                        ACTIVE
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                      title="Budget"
                      value={Math.round((selectedProject.currentSpent / selectedProject.limitBudget) * 100)}
                      icon={DollarSign}
                      trend={selectedProject.currentSpent > selectedProject.limitBudget * 0.8 ? "up" : "stable"}
                      color="cyan"
                      detail={`$${selectedProject.currentSpent} / $${selectedProject.limitBudget}`}
                    />
                    <MetricCard
                      title="Tasks"
                      value={Math.round(
                        (selectedProject.progress.done /
                          (selectedProject.progress.done +
                            selectedProject.progress.inProgress +
                            selectedProject.progress.todo)) *
                        100,
                      )}
                      icon={ClipboardList}
                      trend="stable"
                      color="purple"
                      detail={`${selectedProject.progress.done} / ${selectedProject.progress.done + selectedProject.progress.inProgress + selectedProject.progress.todo} Complete`}
                    />
                    <MetricCard
                      title="Timeline"
                      value={75}
                      icon={Timer}
                      trend="stable"
                      color="blue"
                      detail={`${selectedProject.startDate} - ${selectedProject.endDate}`}
                    />
                  </div>

                  <div className="mt-8" id="project-details">
                    <Tabs defaultValue="progress" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-slate-800/50 p-1">
                          <TabsTrigger
                            value="progress"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Progress
                          </TabsTrigger>
                          <TabsTrigger
                            value="tasks"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Tasks
                          </TabsTrigger>
                          <TabsTrigger
                            value="materials"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Materials
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="progress" className="mt-0">
                        <div className="h-80 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <div className="h-full w-full flex items-center justify-center z-9999" id="project-pie-chart">
                            <CustomPieChart selectedProject={selectedProject} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="tasks" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-5">Task</div>
                            <div className="col-span-2">Worker</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Due Date</div>
                          </div>

                          <div className="divide-y divide-slate-700/30">
                            <TaskRow
                              id="T-1001"
                              name="Install kitchen cabinets"
                              worker="Mike Johnson"
                              status="COMPLETED"
                              dueDate="2024-01-15"
                            />
                            <TaskRow
                              id="T-1002"
                              name="Electrical wiring"
                              worker="Sarah Williams"
                              status="IN_PROGRESS"
                              dueDate="2024-01-20"
                            />
                            <TaskRow
                              id="T-1003"
                              name="Plumbing installation"
                              worker="David Smith"
                              status="IN_PROGRESS"
                              dueDate="2024-01-22"
                            />
                            <TaskRow
                              id="T-1004"
                              name="Countertop installation"
                              worker="Lisa Brown"
                              status="PENDING"
                              dueDate="2024-01-28"
                            />
                            <TaskRow
                              id="T-1005"
                              name="Appliance installation"
                              worker="Robert Davis"
                              status="PENDING"
                              dueDate="2024-02-05"
                            />
                            <TaskRow
                              id="T-1006"
                              name="Final inspection"
                              worker="John Doe"
                              status="PENDING"
                              dueDate="2024-02-10"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="materials" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <div className="grid grid-cols-1 gap-4">
                            <MaterialItem name="Kitchen Cabinets" total={3500} used={3500} type="Installed" />
                            <MaterialItem name="Countertops" total={2200} used={0} type="Pending" />
                            <MaterialItem name="Sink and Fixtures" total={850} used={850} type="Installed" />
                            <MaterialItem name="Appliances" total={4200} used={0} type="Ordered" />
                            <MaterialItem name="Flooring" total={1800} used={1200} type="In Progress" />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Calendar */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <CalendarIcon className="mr-2 h-5 w-5 text-cyan-500" />
                      Budget Calendar
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="h-3 w-3 rounded-full bg-green-500/70"></div>
                        <span className="text-xs text-slate-400">Under Budget</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="h-3 w-3 rounded-full bg-red-500/70"></div>
                        <span className="text-xs text-slate-400">Over Budget</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center space-x-2">
                    <div className="text-sm text-slate-400">Daily Budget Limit:</div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={dailyBudgetLimit}
                        onChange={(e) => setDailyBudgetLimit(Number(e.target.value))}
                        className="h-8 bg-slate-800/50 border-slate-700"
                      />
                    </div>
                    <Button size="sm" onClick={handleUpdateDailyLimit} className="bg-cyan-600 hover:bg-cyan-700">
                      Update
                    </Button>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">{renderCalendar()}</div>

                  <div className="mt-4 text-xs text-slate-500 italic">
                    Click on a day to view detailed expenses and tasks
                  </div>
                </CardContent>
              </Card>

              {/* Worker Performance */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Worker Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <WorkerPerformance
                      name="Mike Johnson"
                      role="Lead Carpenter"
                      tasksCompleted={12}
                      tasksInProgress={2}
                      efficiency={92}
                    />
                    <WorkerPerformance
                      name="Sarah Williams"
                      role="Electrician"
                      tasksCompleted={8}
                      tasksInProgress={3}
                      efficiency={85}
                    />
                    <WorkerPerformance
                      name="David Smith"
                      role="Plumber"
                      tasksCompleted={6}
                      tasksInProgress={1}
                      efficiency={88}
                    />
                    <WorkerPerformance
                      name="Lisa Brown"
                      role="Interior Designer"
                      tasksCompleted={5}
                      tasksInProgress={4}
                      efficiency={79}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
<div className="col-span-12 lg:col-span-3 overflow-y-auto ">
            <div className="grid gap-6">
              {/* System time */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                      <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Project Start</div>
                        <div className="text-sm font-mono text-slate-200">{selectedProject.startDate}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Project End</div>
                        <div className="text-sm font-mono text-slate-200">{selectedProject.endDate}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Summary */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Project Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1">Location</div>
                      <div className="text-sm text-slate-200">{selectedProject.location}</div>
                    </div>

                    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1">Description</div>
                      <div className="text-sm text-slate-200">{selectedProject.description}</div>
                    </div>

                    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1">Project Manager</div>
                      <div className="text-sm text-slate-200">{selectedProject.admin}</div>
                    </div>

                    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-1">Task Status</div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-green-400">Done: {selectedProject.progress.done}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-amber-500 mr-1"></div>
                          <span className="text-amber-400">In Progress: {selectedProject.progress.inProgress}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                          <span className="text-blue-400">To Do: {selectedProject.progress.todo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={ClipboardList} label="Add Task" />
                    <ActionButton icon={Truck} label="Order Materials" />
                    <ActionButton icon={Download} label="Export Report" />
                    <ActionButton icon={MessageSquare} label="Team Chat" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[220px] pr-4">
                    <div className="space-y-4">
                      <ActivityItem
                        title="Material Delivered"
                        time="14:32:12"
                        description="Kitchen cabinets delivered to site"
                        type="info"
                      />
                      <ActivityItem
                        title="Task Completed"
                        time="13:45:06"
                        description="Mike completed electrical wiring"
                        type="success"
                      />
                      <ActivityItem
                        title="Budget Warning"
                        time="09:12:45"
                        description="Approaching 80% of budget limit"
                        type="warning"
                      />
                      <ActivityItem
                        title="New Task Assigned"
                        time="Yesterday"
                        description="Countertop installation assigned to Lisa"
                        type="update"
                      />
                      <ActivityItem
                        title="Client Feedback"
                        time="2 days ago"
                        description="Client approved cabinet design"
                        type="success"
                      />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Day details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-cyan-500" />
              Expenses for {selectedDate}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Detailed breakdown of tasks, materials, and expenses
            </DialogDescription>
          </DialogHeader>

          {selectedDate && dailyExpenses[selectedDate] && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-md border border-slate-700/50">
                <div>
                  <div className="text-sm text-slate-400">Daily Budget Limit</div>
                  <div className="text-xl font-mono text-slate-200">${dailyExpenses[selectedDate].limit}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Total Spent</div>
                  <div
                    className={`text-xl font-mono ${dailyExpenses[selectedDate].spent > dailyExpenses[selectedDate].limit ? "text-red-400" : "text-green-400"}`}
                  >
                    ${dailyExpenses[selectedDate].spent}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Status</div>
                  <Badge
                    className={
                      dailyExpenses[selectedDate].spent > dailyExpenses[selectedDate].limit
                        ? "bg-red-500/20 text-red-400 border-red-500/50"
                        : "bg-green-500/20 text-green-400 border-green-500/50"
                    }
                  >
                    {dailyExpenses[selectedDate].spent > dailyExpenses[selectedDate].limit
                      ? "Over Budget"
                      : "Under Budget"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Tasks</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">Task</TableHead>
                      <TableHead className="text-slate-400">Worker</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyExpenses[selectedDate].tasks.map((task:any) => (
                      <TableRow key={task.id} className="border-slate-700">
                        <TableCell className="text-slate-300">{task.title}</TableCell>
                        <TableCell className="text-slate-300">{task.worker}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Materials</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">Material</TableHead>
                      <TableHead className="text-slate-400">Quantity</TableHead>
                      <TableHead className="text-slate-400">Unit Cost</TableHead>
                      <TableHead className="text-slate-400">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyExpenses[selectedDate].materials.map((material:any) => (
                      <TableRow key={material.id} className="border-slate-700">
                        <TableCell className="text-slate-300">{material.name}</TableCell>
                        <TableCell className="text-slate-300">{material.quantity}</TableCell>
                        <TableCell className="text-slate-300">${material.cost}</TableCell>
                        <TableCell className="text-slate-300">${material.cost * material.quantity}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-slate-700 bg-slate-800/50">
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="font-medium text-cyan-400">${calculateTotalSpent(selectedDate)}</TableCell>
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

// Component for nav items
function NavItem({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-cyan-500 to-blue-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Component for metric cards
function MetricCard({
                      title,
                      value,
                      icon: Icon,
                      trend,
                      color,
                      detail,
                    }: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value}%
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  )
}

// Task row component
function TaskRow({
                   id,
                   name,
                   worker,
                   status,
                   dueDate,
                 }: {
  id: string
  name: string
  worker: string
  status: string
  dueDate: string
}) {
  const getStatusBadge = () => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
            COMPLETED
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
            IN PROGRESS
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
            PENDING
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/30 text-xs">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-slate-500">{id}</div>
      <div className="col-span-5 text-slate-300">{name}</div>
      <div className="col-span-2 text-slate-400">{worker}</div>
      <div className="col-span-2">{getStatusBadge()}</div>
      <div className="col-span-2 text-slate-400">{dueDate}</div>
    </div>
  )
}

// Material item component
function MaterialItem({
                        name,
                        total,
                        used,
                        type,
                      }: {
  name: string
  total: number
  used: number
  type: string
}) {
  const percentage = Math.round((used / total) * 100) || 0

  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">{name}</div>
        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs">
          {type}
        </Badge>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-slate-500">
            ${used} / ${total}
          </div>
          <div className="text-xs text-slate-400">{percentage}%</div>
        </div>
        <Progress value={percentage} className="h-1.5 bg-slate-700">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </Progress>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="text-slate-500">Remaining: ${total - used}</div>
        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-slate-400 hover:text-slate-100">
          Details
        </Button>
      </div>
    </div>
  )
}

// Activity item component
function ActivityItem({
                        title,
                        time,
                        description,
                        type,
                      }: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "warning":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "error":
        return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      case "success":
        return { icon: CheckCircle2, color: "text-green-500 bg-green-500/10 border-green-500/30" }
      case "update":
        return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
      default:
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// Worker performance component
function WorkerPerformance({
                             name,
                             role,
                             tasksCompleted,
                             tasksInProgress,
                             efficiency,
                           }: {
  name: string
  role: string
  tasksCompleted: number
  tasksInProgress: number
  efficiency: number
}) {
  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={name} />
            <AvatarFallback className="bg-slate-700 text-cyan-500">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-slate-200">{name}</div>
            <div className="text-xs text-slate-500">{role}</div>
          </div>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">{efficiency}% Efficient</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-slate-700/30 rounded p-2 text-center">
          <div className="text-xs text-slate-400">Completed</div>
          <div className="text-lg font-medium text-green-400">{tasksCompleted}</div>
        </div>
        <div className="bg-slate-700/30 rounded p-2 text-center">
          <div className="text-xs text-slate-400">In Progress</div>
          <div className="text-lg font-medium text-blue-400">{tasksInProgress}</div>
        </div>
      </div>
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-cyan-500" />
      <span className="text-xs">{label}</span>
    </Button>
  )
}

// Add missing imports
function Info(props:any) {
  return <AlertCircle {...props} />
}

function Check(props:any) {
  return <Shield {...props} />
}

