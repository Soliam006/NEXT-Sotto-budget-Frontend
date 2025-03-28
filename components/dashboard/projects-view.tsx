"use client"

import { useState } from "react"
import { Building, ClipboardList, Package, Users, Search, Filter, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer } from "@/components/ui/chat"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for projects
const PROJECTS = [
  {
    id: 1,
    title: "Kitchen Renovation",
    description: "Complete kitchen remodeling with new cabinets and appliances",
    admin: "John Doe",
    adminAvatar: "/placeholder.svg?height=40&width=40&text=JD",
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
    status: "In Progress",
    team: [
      { id: 1, name: "Mike Johnson", role: "Lead Carpenter", avatar: "/placeholder.svg?height=40&width=40&text=MJ" },
      { id: 2, name: "Sarah Williams", role: "Electrician", avatar: "/placeholder.svg?height=40&width=40&text=SW" },
      { id: 3, name: "David Smith", role: "Plumber", avatar: "/placeholder.svg?height=40&width=40&text=DS" },
    ],
    tasks: [
      {
        id: 101,
        title: "Install kitchen cabinets",
        assignee: "Mike Johnson",
        status: "COMPLETED",
        dueDate: "2024-01-15",
      },
      { id: 102, title: "Electrical wiring", assignee: "Sarah Williams", status: "IN_PROGRESS", dueDate: "2024-01-20" },
      {
        id: 103,
        title: "Plumbing installation",
        assignee: "David Smith",
        status: "IN_PROGRESS",
        dueDate: "2024-01-22",
      },
      { id: 104, title: "Countertop installation", assignee: "Mike Johnson", status: "PENDING", dueDate: "2024-01-28" },
      {
        id: 105,
        title: "Appliance installation",
        assignee: "Sarah Williams",
        status: "PENDING",
        dueDate: "2024-02-05",
      },
    ],
    materials: [
      { id: 201, name: "Kitchen Cabinets", quantity: 1, unit: "set", cost: 3500, status: "Delivered" },
      { id: 202, name: "Granite Countertops", quantity: 30, unit: "sq ft", cost: 2200, status: "Ordered" },
      { id: 203, name: "Sink and Fixtures", quantity: 1, unit: "set", cost: 850, status: "Delivered" },
      { id: 204, name: "Stainless Steel Appliances", quantity: 1, unit: "set", cost: 4200, status: "Pending" },
      { id: 205, name: "Flooring", quantity: 150, unit: "sq ft", cost: 1800, status: "Partially Delivered" },
    ],
  },
  {
    id: 2,
    title: "Bathroom Remodel",
    description: "Master bathroom renovation with new fixtures and tiling",
    admin: "Jane Smith",
    adminAvatar: "/placeholder.svg?height=40&width=40&text=JS",
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
    status: "In Progress",
    team: [
      { id: 2, name: "Sarah Williams", role: "Electrician", avatar: "/placeholder.svg?height=40&width=40&text=SW" },
      { id: 3, name: "David Smith", role: "Plumber", avatar: "/placeholder.svg?height=40&width=40&text=DS" },
      { id: 4, name: "Lisa Brown", role: "Interior Designer", avatar: "/placeholder.svg?height=40&width=40&text=LB" },
    ],
    tasks: [
      { id: 201, title: "Demolition", assignee: "David Smith", status: "COMPLETED", dueDate: "2023-11-10" },
      { id: 202, title: "Plumbing rough-in", assignee: "David Smith", status: "COMPLETED", dueDate: "2023-11-20" },
      { id: 203, title: "Electrical work", assignee: "Sarah Williams", status: "COMPLETED", dueDate: "2023-11-25" },
      { id: 204, title: "Tiling", assignee: "Lisa Brown", status: "IN_PROGRESS", dueDate: "2024-01-15" },
      { id: 205, title: "Fixture installation", assignee: "David Smith", status: "PENDING", dueDate: "2024-01-30" },
    ],
    materials: [
      { id: 301, name: "Bathroom Tiles", quantity: 120, unit: "sq ft", cost: 960, status: "Delivered" },
      { id: 302, name: "Shower Enclosure", quantity: 1, unit: "unit", cost: 1200, status: "Ordered" },
      { id: 303, name: "Vanity and Sink", quantity: 1, unit: "set", cost: 850, status: "Delivered" },
      { id: 304, name: "Toilet", quantity: 1, unit: "unit", cost: 350, status: "Delivered" },
      { id: 305, name: "Fixtures", quantity: 1, unit: "set", cost: 750, status: "Partially Delivered" },
    ],
  },
  {
    id: 3,
    title: "Basement Finishing",
    description: "Converting unfinished basement into living space",
    admin: "Mike Johnson",
    adminAvatar: "/placeholder.svg?height=40&width=40&text=MJ",
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
    status: "In Progress",
    team: [
      { id: 1, name: "Mike Johnson", role: "Lead Carpenter", avatar: "/placeholder.svg?height=40&width=40&text=MJ" },
      { id: 2, name: "Sarah Williams", role: "Electrician", avatar: "/placeholder.svg?height=40&width=40&text=SW" },
      {
        id: 5,
        name: "Robert Davis",
        role: "General Contractor",
        avatar: "/placeholder.svg?height=40&width=40&text=RD",
      },
    ],
    tasks: [
      { id: 301, title: "Framing", assignee: "Mike Johnson", status: "COMPLETED", dueDate: "2023-10-15" },
      { id: 302, title: "Electrical rough-in", assignee: "Sarah Williams", status: "COMPLETED", dueDate: "2023-11-01" },
      { id: 303, title: "Insulation", assignee: "Robert Davis", status: "COMPLETED", dueDate: "2023-11-15" },
      {
        id: 304,
        title: "Drywall installation",
        assignee: "Mike Johnson",
        status: "IN_PROGRESS",
        dueDate: "2024-01-30",
      },
      { id: 305, title: "Flooring", assignee: "Robert Davis", status: "PENDING", dueDate: "2024-02-28" },
      { id: 306, title: "Painting", assignee: "Mike Johnson", status: "PENDING", dueDate: "2024-03-15" },
    ],
    materials: [
      { id: 401, name: "Lumber", quantity: 1, unit: "lot", cost: 3500, status: "Delivered" },
      { id: 402, name: "Drywall", quantity: 50, unit: "sheets", cost: 750, status: "Delivered" },
      { id: 403, name: "Insulation", quantity: 1, unit: "lot", cost: 1200, status: "Delivered" },
      { id: 404, name: "Flooring", quantity: 800, unit: "sq ft", cost: 4800, status: "Ordered" },
      { id: 405, name: "Paint", quantity: 10, unit: "gallons", cost: 450, status: "Pending" },
      { id: 406, name: "Electrical Supplies", quantity: 1, unit: "lot", cost: 2500, status: "Partially Delivered" },
    ],
  },
]

interface ProjectsViewProps {
  dict: any
  lang: string
}

export function ProjectsView({ dict, lang }: ProjectsViewProps) {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // Filter projects based on search term
  const filteredProjects = PROJECTS.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-success/20 text-success border-success/50"
      case "IN_PROGRESS":
        return "bg-info/20 text-info border-info/50"
      case "PENDING":
        return "bg-warning/20 text-warning border-warning/50"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50"
    }
  }

  // Get material status color
  const getMaterialStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success/20 text-success border-success/50"
      case "Partially Delivered":
        return "bg-info/20 text-info border-info/50"
      case "Ordered":
        return "bg-primary/20 text-primary border-primary/50"
      case "Pending":
        return "bg-warning/20 text-warning border-warning/50"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">{dict.projects?.title || "Project Management"}</h1>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="bg-muted/50 border-border pl-10"
              placeholder={dict.projects?.searchProjects || "Search projects..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="bg-muted/50 border-border text-muted-foreground">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-muted/50 border-border text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Project list - 4 columns on large screens */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className={`bg-card/50 border-border/50 backdrop-blur-sm cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedProject.id === project.id ? "border-primary/50" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <Badge
                    variant="outline"
                    className={
                      project.status === "Completed"
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-info/10 text-info border-info/30"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{dict.projects?.progress || "Progress"}</span>
                  <span>
                    {Math.round(
                      (project.progress.done /
                        (project.progress.done + project.progress.inProgress + project.progress.todo)) *
                      100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (project.progress.done /
                      (project.progress.done + project.progress.inProgress + project.progress.todo)) *
                    100
                  }
                  className="h-1.5 mb-3"
                >
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    style={{
                      width: `${
                        (project.progress.done /
                          (project.progress.done + project.progress.inProgress + project.progress.todo)) *
                        100
                      }%`,
                    }}
                  />
                </Progress>

                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-muted text-primary text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {project.startDate} - {project.endDate}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProjects.length === 0 && (
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {dict.projects?.noResults || "No projects found matching your search."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Project details - 8 columns on large screens */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5 text-primary" />
                  {selectedProject.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    selectedProject.status === "Completed"
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-info/10 text-info border-info/30"
                  }
                >
                  {selectedProject.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent p-0">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.overview || "Overview"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.tasks || "Tasks"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.team || "Team"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="materials"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.materials || "Materials"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{dict.projects?.projectInfo || "Project Information"}</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{dict.projects?.manager || "Manager"}:</span>
                          <div className="flex items-center">
                            <Avatar className="h-5 w-5 mr-2">
                              <AvatarImage src={selectedProject.adminAvatar} alt={selectedProject.admin} />
                              <AvatarFallback className="bg-muted text-primary text-xs">
                                {selectedProject.admin
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{selectedProject.admin}</span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{dict.projects?.location || "Location"}:</span>
                          <span>{selectedProject.location}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{dict.projects?.startDate || "Start Date"}:</span>
                          <span>{selectedProject.startDate}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{dict.projects?.endDate || "End Date"}:</span>
                          <span>{selectedProject.endDate}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{dict.projects?.budget || "Budget"}:</span>
                          <span>${selectedProject.limitBudget.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{dict.projects?.spent || "Spent"}:</span>
                          <span>${selectedProject.currentSpent.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{dict.projects?.remaining || "Remaining"}:</span>
                          <span>${(selectedProject.limitBudget - selectedProject.currentSpent).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{dict.projects?.progressOverview || "Progress Overview"}</h3>

                      <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: dict.projects?.done || "Done",
                                  value: selectedProject.progress.done,
                                  fill: "#10b981",
                                },
                                {
                                  name: dict.projects?.inProgress || "In Progress",
                                  value: selectedProject.progress.inProgress,
                                  fill: "#3b82f6",
                                },
                                {
                                  name: dict.projects?.todo || "To Do",
                                  value: selectedProject.progress.todo,
                                  fill: "#f59e0b",
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, percent }:any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {[{ color: "#10b981" }, { color: "#3b82f6" }, { color: "#f59e0b" }].map(
                                (entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ),
                              )}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-success mr-2"></div>
                          <span className="text-sm">
                            {dict.projects?.done || "Done"}: {selectedProject.progress.done}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-info mr-2"></div>
                          <span className="text-sm">
                            {dict.projects?.inProgress || "In Progress"}: {selectedProject.progress.inProgress}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-warning mr-2"></div>
                          <span className="text-sm">
                            {dict.projects?.todo || "To Do"}: {selectedProject.progress.todo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{dict.projects?.description || "Description"}</h3>
                    <p>{selectedProject.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{dict.projects?.taskList || "Task List"}</h3>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        {/*<ClipboardList className="h-4 w-4 mr-2" />*/}
                        {dict.projects?.addTask || "Add Task"}
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">{dict.projects?.taskName || "Task"}</TableHead>
                          <TableHead className="text-muted-foreground">
                            {dict.projects?.assignee || "Assignee"}
                          </TableHead>
                          <TableHead className="text-muted-foreground">{dict.projects?.status || "Status"}</TableHead>
                          <TableHead className="text-muted-foreground">
                            {dict.projects?.dueDate || "Due Date"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProject.tasks.map((task):any => (
                          <TableRow key={task.id} className="border-border">
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.assignee}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            </TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{dict.projects?.teamMembers || "Team Members"}</h3>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Users className="h-4 w-4 mr-2" />
                        {dict.projects?.addMember || "Add Member"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProject.team.map((member):any => (
                        <div
                          key={member.id}
                          className="bg-muted/50 rounded-lg border border-border/50 p-4 flex items-center"
                        >
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-muted text-primary">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-muted-foreground text-sm">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{dict.projects?.materialsList || "Materials List"}</h3>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Package className="h-4 w-4 mr-2" />
                        {dict.projects?.addMaterial || "Add Material"}
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">
                            {dict.projects?.materialName || "Material"}
                          </TableHead>
                          <TableHead className="text-muted-foreground">
                            {dict.projects?.quantity || "Quantity"}
                          </TableHead>
                          <TableHead className="text-muted-foreground">{dict.projects?.cost || "Cost"}</TableHead>
                          <TableHead className="text-muted-foreground">{dict.projects?.status || "Status"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProject.materials.map((material):any => (
                          <TableRow key={material.id} className="border-border">
                            <TableCell>{material.name}</TableCell>
                            <TableCell>
                              {material.quantity} {material.unit}
                            </TableCell>
                            <TableCell>${material.cost.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={getMaterialStatusColor(material.status)}>{material.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

