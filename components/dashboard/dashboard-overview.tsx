"use client"

import {
  Activity,
  ClipboardList,
  Package,
  Timer,
  Users,
  DollarSign,
  CheckCircle2,
  BarChart3,
  LineChart,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomPieChart  from "@/components/custom-pie-chart"
import { ProjectsSelector } from "@/components/dashboard/projects-selector"
import { TaskBoard } from "@/components/tasks/task-board"
import {Project} from "@/components/dashboard/projects-selector"

interface DashboardOverviewProps {
  dict: any // Replace 'any' with the actual type of your dictionary
  lang: string
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Project A",
    description: "Renovation of a residential building",
    location: "New York",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    admin: "John Doe",
    limitBudget: 100000,
    currentSpent: 75000,
    status: "Active",
    progress: {
      done: 50,
      inProgress: 30,
      todo: 20,
    },
    tasks: [
      {
        id: "1",
        title: "Task 1",
        assignee: "Jane Smith",
        dueDate: "2023-03-15",
        status: "COMPLETED",
      },
      {
        id: "2",
        title: "Task 2",
        assignee: "Peter Jones",
        dueDate: "2023-04-01",
        status: "IN_PROGRESS",
      },
      {
        id: "3",
        title: "Task 3",
        assignee: "Jane Smith",
        dueDate: "2023-05-01",
        status: "PENDING",
      },
    ],
    team: [
      {
        id: "1",
        name: "John Doe",
        role: "Project Manager",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: "2",
        name: "Jane Smith",
        role: "Engineer",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        id: "3",
        name: "Peter Jones",
        role: "Designer",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
    ],
    materials: [
      {
        id: "1",
        name: "Wood",
        quantity: 100,
        unit: "pieces",
        cost: 500,
        status: "Delivered",
      },
      {
        id: "2",
        name: "Nails",
        quantity: 500,
        unit: "pieces",
        cost: 50,
        status: "Ordered",
      },
      {
        id: "3",
        name: "Bricks",
        quantity: 200,
        unit: "pieces",
        cost: 200,
        status: "Partially Delivered",
      },
    ],
  },
  {
    id: 2,
    title: "Project B",
    description: "Construction of a commercial building",
    location: "Los Angeles",
    startDate: "2023-02-15",
    endDate: "2024-01-31",
    admin: "Alice Brown",
    limitBudget: 120000,
    currentSpent: 90000,
    status: "Active",
    progress: {
      done: 60,
      inProgress: 25,
      todo: 15,
    },
    tasks: [
      {
        id: "4",
        title: "Task 4",
        assignee: "Bob Williams",
        dueDate: "2023-04-15",
        status: "COMPLETED",
      },
      {
        id: "5",
        title: "Task 5",
        assignee: "Alice Brown",
        dueDate: "2023-05-01",
        status: "IN_PROGRESS",
      },
      {
        id: "6",
        title: "Task 6",
        assignee: "Bob Williams",
        dueDate: "2023-06-01",
        status: "PENDING",
      },
    ],
    team: [
      {
        id: "4",
        name: "Alice Brown",
        role: "Project Manager",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      },
      {
        id: "5",
        name: "Bob Williams",
        role: "Architect",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      {
        id: "6",
        name: "Cathy Davis",
        role: "Interior Designer",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      },
    ],
    materials: [
      {
        id: "4",
        name: "Cement",
        quantity: 50,
        unit: "bags",
        cost: 250,
        status: "Delivered",
      },
      {
        id: "5",
        name: "Sand",
        quantity: 100,
        unit: "bags",
        cost: 100,
        status: "Ordered",
      },
      {
        id: "6",
        name: "Steel",
        quantity: 30,
        unit: "bars",
        cost: 600,
        status: "Partially Delivered",
      },
    ],
  },
]

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

export function DashboardOverview({ dict, lang }: DashboardOverviewProps) {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

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

  const filteredProjects = PROJECTS.filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase()))

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

  // Right sidebar content
  const RightSidebar = () => (
      <div className="space-y-6">
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
                  <div className="text-xs text-muted-foreground mb-1">{dict.dashboard?.projectEnd || "Project End"}</div>
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
                <div className="text-2xl font-bold text-info">{PROJECTS.filter((p) => p.status === "Active").length}</div>
              </div>
              <div className="bg-muted/50 rounded-md p-3 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">{dict.dashboard?.totalBudget || "Total Budget"}</div>
                <div className="text-2xl font-bold text-success">
                  ${PROJECTS.reduce((sum, p) => sum + p.limitBudget, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )

  return (
      <div>
        {/* Background particle effect */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 -z-10" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{dict.dashboard?.overview || "Dashboard Overview"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {dict.dashboard?.description || "Manage your projects and activities"}
            </p>
          </div>
        </div>

        {/* Project selector */}
        <ProjectsSelector
            projects={filteredProjects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            dict={dict}
        />

        {/* Main content with right sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1">
            {/* Tabs for different views */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full border-b rounded-none p-0 h-auto flex space-x-2">
                <TabsTrigger
                    value="overview"
                    className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  {dict.dashboard?.overview || "Overview"}
                </TabsTrigger>
                <TabsTrigger
                    value="tasks"
                    className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  {dict.dashboard?.tasks || "Tasks"}
                </TabsTrigger>
                <TabsTrigger
                    value="team"
                    className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {dict.dashboard?.team || "Team"}
                </TabsTrigger>
                <TabsTrigger
                    value="materials"
                    className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
                >
                  <Package className="h-4 w-4 mr-2" />
                  {dict.dashboard?.materials || "Materials"}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab Content */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                      title={dict.dashboard?.budget || "Budget"}
                      value={Math.round((selectedProject.currentSpent / selectedProject.limitBudget) * 100)}
                      icon={DollarSign}
                      trend={selectedProject.currentSpent > selectedProject.limitBudget * 0.8 ? "up" : "stable"}
                      color="primary"
                      detail={`$${selectedProject.currentSpent.toLocaleString()} / $${selectedProject.limitBudget.toLocaleString()}`}
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

                <div className="grid grid-cols-1 gap-6">
                  {/* Progress Pie Chart */}
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle>{dict.dashboard?.progressOverview || "Progress Overview"}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <CustomPieChart selectedProject={selectedProject} />
                    </CardContent>
                  </Card>

                  {/* Project Details */}
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle>{dict.dashboard?.projectDetails || "Project Details"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <h4 className="text-sm font-medium mb-2">
                            {dict.dashboard?.taskBreakdown || "Task Breakdown"}
                          </h4>
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
              </TabsContent>

              {/* Tasks Tab Content */}
              <TabsContent value="tasks" className="mt-6">
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <TaskBoard
                        dict={dict}
                        lang={lang}
                        projectId={selectedProject.id}
                        initialTasks={[
                          {
                            id: "task-1",
                            title: "Install kitchen cabinets",
                            assignee: "Mike Johnson",
                            dueDate: "2024-01-15",
                            status: "COMPLETED",
                            created_at: "2024-01-01",
                            updated_at: "2024-01-02",
                          },
                          {
                            id: "task-2",
                            title: "Electrical wiring",
                            description: "Complete all electrical wiring in the kitchen area",
                            assignee: "Sarah Williams",
                            dueDate: "2024-01-20",
                            status: "IN_PROGRESS",
                            created_at: "2024-01-02",
                            updated_at: "2024-01-03",
                          },
                            {
                                id: "task-3",
                                title: "Plumbing installation",
                                description: "Install all plumbing fixtures and connections",
                                assignee: "John Smith",
                                dueDate: "2024-01-25",
                                status: "PENDING",
                                created_at: "2024-01-03",
                                updated_at: "2024-01-04",
                            },
                        ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Team Tab Content */}
              <TabsContent value="team" className="mt-6">
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{dict.dashboard?.projectTeam || "Project Team"}</CardTitle>
                      <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
                        {selectedProject.team.length} {dict.dashboard?.members || "Members"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProject.team.map((member:any) => (
                          <div
                              key={member.id}
                              className="flex items-center p-4 rounded-lg border border-border/50 bg-muted/30"
                          >
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>
                                {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Materials Tab Content */}
              <TabsContent value="materials" className="mt-6">
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{dict.dashboard?.projectMaterials || "Project Materials"}</CardTitle>
                      <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
                        {selectedProject.materials.length} {dict.dashboard?.items || "Items"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">{dict.dashboard?.materialName || "Material"}</TableHead>
                            <TableHead>{dict.dashboard?.quantity || "Quantity"}</TableHead>
                            <TableHead>{dict.dashboard?.cost || "Cost"}</TableHead>
                            <TableHead>{dict.dashboard?.status || "Status"}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject.materials.map((material:any) => (
                              <TableRow key={material.id}>
                                <TableCell className="font-medium">{material.name}</TableCell>
                                <TableCell>
                                  {material.quantity} {material.unit}
                                </TableCell>
                                <TableCell>${material.cost.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge
                                      variant="outline"
                                      className={
                                        material.status === "Delivered"
                                            ? "bg-success/10 text-success border-success/30"
                                            : material.status === "Ordered"
                                                ? "bg-info/10 text-info border-info/30"
                                                : material.status === "Partially Delivered"
                                                    ? "bg-warning/10 text-warning border-warning/30"
                                                    : "bg-muted/50 text-muted-foreground border-muted/30"
                                      }
                                  >
                                    {material.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right sidebar - only visible on larger screens */}
          <div className="w-full hidden lg:block lg:w-80 flex-shrink-0">
            <RightSidebar />
          </div>
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

