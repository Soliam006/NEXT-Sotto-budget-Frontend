"use client"

import { Activity, ClipboardList, Package, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsSelector } from "@/components/dashboard/projects-selector"
import type { Project } from "@/components/dashboard/projects-selector"
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab"
import { TasksTab } from "@/components/dashboard/tabs/tasks-tab"
import { TeamTab } from "@/components/dashboard/tabs/team-tab"
import { MaterialsTab } from "@/components/dashboard/tabs/materials-tab"

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
        id: "task-1",
        title: "Instalar ventanas en el segundo piso",
        description: "Completar la instalación de todas las ventanas del segundo piso según las especificaciones",
        assignee: "Mike Johnson",
        dueDate: new Date().toISOString(),
        status: "PENDING",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: "1",
        worker_id: "1",
      },
      {
        id: "task-2",
        title: "Revisar instalación eléctrica",
        description: "Verificar que todos los circuitos funcionan correctamente",
        assignee: "Sarah Williams",
        status: "IN_PROGRESS",
        dueDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: "1",
        worker_id: "2",
      },
      {
        id: "task-3",
        title: "Pintar paredes de la sala principal",
        description: "Usar la pintura aprobada por el cliente",
        assignee: "David Smith",
        status: "COMPLETED",
        dueDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: "1",
        worker_id: "3",
      }
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

export function DashboardOverview({ dict, lang }: DashboardOverviewProps) {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
        hasChanges={hasChanges}
      />

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 pt-6">
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
                {activeTab === "overview" && <>{dict.dashboard?.overview || "Overview"}</>}
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                {activeTab === "tasks" && <>{dict.dashboard?.tasks || "Tasks"}</>}
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
              >
                <Users className="h-4 w-4 mr-2" />
                {activeTab === "team" && <>{dict.dashboard?.team || "Team"}</>}
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
              >
                <Package className="h-4 w-4 mr-2" />
                {activeTab === "materials" && <>{dict.dashboard?.materials || "Materials"}</>}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview">
              <OverviewTab dict={dict} selectedProject={selectedProject} />
            </TabsContent>

            {/* Tasks Tab Content */}
            <TabsContent value="tasks">
              <TasksTab dict={dict} lang={lang} selectedProject={selectedProject} hasChanges={hasChanges} setHasChanges={setHasChanges} />
            </TabsContent>

            {/* Team Tab Content */}
            <TabsContent value="team">
              <TeamTab dict={dict} selectedProject={selectedProject} />
            </TabsContent>

            {/* Materials Tab Content */}
            <TabsContent value="materials">
              <MaterialsTab dict={dict} selectedProject={selectedProject} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
