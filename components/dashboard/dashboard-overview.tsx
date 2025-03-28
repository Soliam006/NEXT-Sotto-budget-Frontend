"use client"

import { useState, useEffect, useRef } from "react"
import { Activity, BarChart3, CheckCircle2, DollarSign, LineChart, RefreshCw, Timer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import CustomPieChart from "@/components/custom-pie-chart";
import {ProjectsSelector} from "@/components/projects-selector";

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
    status: "Active",
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
    status: "Active",
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
    status: "Active",
    location: "789 Pine Rd, Elsewhere",
    startDate: "2023-09-01",
    endDate: "2024-06-15",
  },
]

interface DashboardOverviewProps {
  dict: any
  lang: string
}

export function DashboardOverview({dict, lang}: { dict: any; lang: string }) {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  const canvasRef = useRef<HTMLCanvasElement  | null>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

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
      size: number = 5
      speedX: number = 0
      speedY: number = 0
      color: string = ""

      constructor() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (canvas) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-primary font-mono text-sm tracking-wider">
            {dict.dashboard?.loading || "LOADING"}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 -z-10" />

      {/* Main content - 9 columns on large screens */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <h1 className="text-2xl font-bold">{dict.dashboard?.overview || "Dashboard Overview"}</h1>


        {/* Project selector component */}
        <ProjectsSelector
          projects={PROJECTS}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          dict={dict}
        />

        {/* Project overview */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                {dict.dashboard?.projectOverview || "Project Overview"}: {selectedProject.title}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-1 animate-pulse"></div>
                  {dict.dashboard?.active || "ACTIVE"}
                </Badge>
                <button className="text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title={dict.dashboard?.budget || "Budget"}
                value={Math.round((selectedProject.currentSpent / selectedProject.limitBudget) * 100)}
                icon={DollarSign}
                trend={selectedProject.currentSpent > selectedProject.limitBudget * 0.8 ? "up" : "stable"}
                color="primary"
                detail={`$${selectedProject.currentSpent} / $${selectedProject.limitBudget}`}
              />
              <MetricCard
                title={dict.dashboard?.tasks || "Tasks"}
                value={Math.round(
                  (selectedProject.progress.done /
                    (selectedProject.progress.done +
                      selectedProject.progress.inProgress +
                      selectedProject.progress.todo)) *
                    100,
                )}
                icon={CheckCircle2}
                trend="stable"
                color="accent"
                detail={`${selectedProject.progress.done} / ${
                  selectedProject.progress.done + selectedProject.progress.inProgress + selectedProject.progress.todo
                } ${dict.dashboard?.complete || "Complete"}`}
              />
              <MetricCard
                title={dict.dashboard?.timeline || "Timeline"}
                value={75}
                icon={Timer}
                trend="stable"
                color="secondary"
                detail={`${selectedProject.startDate} - ${selectedProject.endDate}`}
              />
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress Pie Chart */}
              <div className="bg-muted/30 rounded-lg border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-lg font-medium">{dict.dashboard?.progressOverview || "Progress Overview"}</h3>
                </div>
                <div className="h-80 w-full relative overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center">
                    <CustomPieChart selectedProject={selectedProject} />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-muted/30 rounded-lg border border-border/50 p-4">
                <h3 className="text-lg font-medium mb-4">{dict.dashboard?.projectDetails || "Project Details"}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{dict.dashboard?.location || "Location"}:</span>
                        <span>{selectedProject.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{dict.dashboard?.startDate || "Start Date"}:</span>
                        <span>{selectedProject.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{dict.dashboard?.endDate || "End Date"}:</span>
                        <span>{selectedProject.endDate}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{dict.dashboard?.manager || "Manager"}:</span>
                        <span>{selectedProject.admin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {dict.dashboard?.tasksCompleted || "Tasks Completed"}:
                        </span>
                        <span className="text-success">{selectedProject.progress.done}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {dict.dashboard?.tasksRemaining || "Tasks Remaining"}:
                        </span>
                        <span className="text-warning">
                          {selectedProject.progress.inProgress + selectedProject.progress.todo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <h4 className="text-sm font-medium mb-2">{dict.dashboard?.taskBreakdown || "Task Breakdown"}</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-success">{dict.dashboard?.done || "Done"}</span>
                          <span className="text-muted-foreground">{selectedProject.progress.done} tasks</span>
                        </div>
                        <Progress
                          value={
                            (selectedProject.progress.done /
                              (selectedProject.progress.done +
                                selectedProject.progress.inProgress +
                                selectedProject.progress.todo)) *
                            100
                          }
                          className="h-1.5 bg-muted"
                        >
                          <div className="h-full bg-success rounded-full" />
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-info">{dict.dashboard?.inProgress || "In Progress"}</span>
                          <span className="text-muted-foreground">{selectedProject.progress.inProgress} tasks</span>
                        </div>
                        <Progress
                          value={
                            (selectedProject.progress.inProgress /
                              (selectedProject.progress.done +
                                selectedProject.progress.inProgress +
                                selectedProject.progress.todo)) *
                            100
                          }
                          className="h-1.5 bg-muted"
                        >
                          <div className="h-full bg-info rounded-full" />
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-warning">{dict.dashboard?.todo || "To Do"}</span>
                          <span className="text-muted-foreground">{selectedProject.progress.todo} tasks</span>
                        </div>
                        <Progress
                          value={
                            (selectedProject.progress.todo /
                              (selectedProject.progress.done +
                                selectedProject.progress.inProgress +
                                selectedProject.progress.todo)) *
                            100
                          }
                          className="h-1.5 bg-muted"
                        >
                          <div className="h-full bg-warning rounded-full" />
                        </Progress>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle>{dict.dashboard?.recentActivity || "Recent Activity"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title={dict.dashboard?.materialDelivered || "Material Delivered"}
                time="14:32:12"
                description={dict.dashboard?.cabinetsDelivered || "Kitchen cabinets delivered to site"}
                type="info"
              />
              <ActivityItem
                title={dict.dashboard?.taskCompleted || "Task Completed"}
                time="13:45:06"
                description={dict.dashboard?.electricalCompleted || "Mike completed electrical wiring"}
                type="success"
              />
              <ActivityItem
                title={dict.dashboard?.budgetWarning || "Budget Warning"}
                time="09:12:45"
                description={dict.dashboard?.approachingBudget || "Approaching 80% of budget limit"}
                type="warning"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right sidebar - 3 columns on large screens */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        {/* System time */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-muted to-card p-6 border-b border-border/50">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1 font-mono">SYSTEM TIME</div>
                <div className="text-3xl font-mono text-primary mb-1">{formatTime(currentTime)}</div>
                <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-md p-3 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">
                    {dict.dashboard?.projectStart || "Project Start"}
                  </div>
                  <div className="text-sm font-mono">{selectedProject.startDate}</div>
                </div>
                <div className="bg-muted/50 rounded-md p-3 border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">
                    {dict.dashboard?.projectEnd || "Project End"}
                  </div>
                  <div className="text-sm font-mono">{selectedProject.endDate}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{dict.dashboard?.quickStats || "Quick Stats"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-md p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  {dict.dashboard?.totalProjects || "Total Projects"}
                </div>
                <div className="text-2xl font-bold text-primary">{PROJECTS.length}</div>
              </div>
              <div className="bg-muted/50 rounded-md p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  {dict.dashboard?.activeProjects || "Active Projects"}
                </div>
                <div className="text-2xl font-bold text-info">
                  {PROJECTS.filter((p) => p.status !== "Completed").length}
                </div>
              </div>
              <div className="bg-muted/50 rounded-md p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">
                  {dict.dashboard?.totalBudget || "Total Budget"}
                </div>
                <div className="text-2xl font-bold text-success">
                  ${PROJECTS.reduce((sum, p) => sum + p.limitBudget, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "primary":
        return "from-primary to-primary/70"
      case "success":
        return "from-success to-success/70"
      case "info":
        return "from-info to-info/70"
      case "accent":
        return "from-accent to-accent/70"
      default:
        return "from-primary to-primary/70"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{value}%</div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
  icon: any
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "primary":
        return "from-primary to-primary/70 border-primary/30"
      case "secondary":
        return "from-secondary to-secondary/70 border-secondary/30"
      case "accent":
        return "from-accent to-accent/70 border-accent/30"
      default:
        return "from-primary to-primary/70 border-primary/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-warning" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-success" />
      case "stable":
        return <LineChart className="h-4 w-4 text-info" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-muted/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">{title}</div>
        <Icon className={`h-5 w-5 text-${color}`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-foreground to-foreground/80">
        {value}%
      </div>
      <div className="text-xs text-muted-foreground">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-primary to-primary/70"></div>
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
        return { color: "text-info bg-info/10 border-info/30" }
      case "warning":
        return { color: "text-warning bg-warning/10 border-warning/30" }
      case "error":
        return { color: "text-destructive bg-destructive/10 border-destructive/30" }
      case "success":
        return { color: "text-success bg-success/10 border-success/30" }
      case "update":
        return { color: "text-primary bg-primary/10 border-primary/30" }
      default:
        return { color: "text-info bg-info/10 border-info/30" }
    }
  }

  const { color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <CheckCircle2 className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium">{title}</div>
          <div className="ml-2 text-xs text-muted-foreground">{time}</div>
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

