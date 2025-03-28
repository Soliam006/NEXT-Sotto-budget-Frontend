"use client";

import { useState } from "react"
import { Building, ClipboardList, Package, Users, Search, Filter, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CustomPieChart from "@/components/custom-pie-chart";

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
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "PENDING":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  // Get material status color
  const getMaterialStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "Partially Delivered":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "Ordered":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50"
      case "Pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-100">{dict.projects?.title || "Project Management"}</h1>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="bg-slate-800/50 border-slate-700 pl-10"
              placeholder={dict.projects?.searchProjects || "Search projects..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="bg-slate-800/50 border-slate-700 text-slate-400">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-slate-800/50 border-slate-700 text-slate-400">
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
              className={`bg-slate-900/50 border-slate-700/50 backdrop-blur-sm cursor-pointer transition-colors hover:bg-slate-800/50 ${
                selectedProject.id === project.id ? "border-cyan-500/50" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-slate-100">{project.title}</h3>
                  <Badge
                    variant="outline"
                    className={
                      project.status === "Completed"
                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>

                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{project.description}</p>

                <div className="flex justify-between text-xs text-slate-500 mb-1">
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
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
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
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-slate-900">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-slate-700 text-cyan-500 text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-300">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-400">
                    {project.startDate} - {project.endDate}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProjects.length === 0 && (
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400">
                  {dict.projects?.noResults || "No projects found matching your search."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Project details - 8 columns on large screens */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/50 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-100 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-cyan-500" />
                  {selectedProject.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    selectedProject.status === "Completed"
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  }
                >
                  {selectedProject.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b border-slate-700/50 bg-transparent p-0">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.overview || "Overview"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.tasks || "Tasks"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.team || "Team"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="materials"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {dict.projects?.materials || "Materials"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-100">
                        {dict.projects?.projectInfo || "Project Information"}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{dict.projects?.manager || "Manager"}:</span>
                          <div className="flex items-center">
                            <Avatar className="h-5 w-5 mr-2">
                              <AvatarImage src={selectedProject.adminAvatar} alt={selectedProject.admin} />
                              <AvatarFallback className="bg-slate-700 text-cyan-500 text-xs">
                                {selectedProject.admin
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-slate-200">{selectedProject.admin}</span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">{dict.projects?.location || "Location"}:</span>
                          <span className="text-slate-200">{selectedProject.location}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">{dict.projects?.startDate || "Start Date"}:</span>
                          <span className="text-slate-200">{selectedProject.startDate}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">{dict.projects?.endDate || "End Date"}:</span>
                          <span className="text-slate-200">{selectedProject.endDate}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">{dict.projects?.budget || "Budget"}:</span>
                          <span className="text-slate-200">${selectedProject.limitBudget.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">{dict.projects?.spent || "Spent"}:</span>
                          <span className="text-slate-200">${selectedProject.currentSpent.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">{dict.projects?.remaining || "Remaining"}:</span>
                          <span className="text-slate-200">
                            ${(selectedProject.limitBudget - selectedProject.currentSpent).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-100">
                        {dict.projects?.progressOverview || "Progress Overview"}
                      </h3>

                      <div className="h-64 w-full relative">
                        <CustomPieChart selectedProject={selectedProject} />
                      </div>

                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-slate-300">
                            {dict.projects?.done || "Done"}: {selectedProject.progress.done}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm text-slate-300">
                            {dict.projects?.inProgress || "In Progress"}: {selectedProject.progress.inProgress}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                          <span className="text-sm text-slate-300">
                            {dict.projects?.todo || "To Do"}: {selectedProject.progress.todo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-100">
                      {dict.projects?.description || "Description"}
                    </h3>
                    <p className="text-slate-300">{selectedProject.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-100">{dict.projects?.taskList || "Task List"}</h3>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        {dict.projects?.addTask || "Add Task"}
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-400">{dict.projects?.taskName || "Task"}</TableHead>
                          <TableHead className="text-slate-400">{dict.projects?.assignee || "Assignee"}</TableHead>
                          <TableHead className="text-slate-400">{dict.projects?.status || "Status"}</TableHead>
                          <TableHead className="text-slate-400">{dict.projects?.dueDate || "Due Date"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProject.tasks.map((task) => (
                          <TableRow key={task.id} className="border-slate-700">
                            <TableCell className="text-slate-300">{task.title}</TableCell>
                            <TableCell className="text-slate-300">{task.assignee}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">{task.dueDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-100">
                        {dict.projects?.teamMembers || "Team Members"}
                      </h3>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <Users className="h-4 w-4 mr-2" />
                        {dict.projects?.addMember || "Add Member"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProject.team.map((member) => (
                        <div
                          key={member.id}
                          className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 flex items-center"
                        >
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-slate-700 text-cyan-500">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-slate-200 font-medium">{member.name}</h4>
                            <p className="text-slate-400 text-sm">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-100">
                        {dict.projects?.materialsList || "Materials List"}
                      </h3>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <Package className="h-4 w-4 mr-2" />
                        {dict.projects?.addMaterial || "Add Material"}
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-400">{dict.projects?.materialName || "Material"}</TableHead>
                          <TableHead className="text-slate-400">{dict.projects?.quantity || "Quantity"}</TableHead>
                          <TableHead className="text-slate-400">{dict.projects?.cost || "Cost"}</TableHead>
                          <TableHead className="text-slate-400">{dict.projects?.status || "Status"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProject.materials.map((material) => (
                          <TableRow key={material.id} className="border-slate-700">
                            <TableCell className="text-slate-300">{material.name}</TableCell>
                            <TableCell className="text-slate-300">
                              {material.quantity} {material.unit}
                            </TableCell>
                            <TableCell className="text-slate-300">${material.cost.toLocaleString()}</TableCell>
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

